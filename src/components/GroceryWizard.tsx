import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  Hash,
  Plus,
  Trash2,
  UploadCloud,
  FileText,
  Camera,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Download,
  Loader2,
  Edit3,
  RefreshCw,
  Search,
  Leaf
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { GroceryItem, Order } from '../types';

interface GroceryWizardProps {
  initialOption?: 'manual' | 'upload';
  initialItems?: Array<{ name: string; quantity: number; unit: string; notes?: string }>;
  onOrderSubmitted?: (order: Order) => void;
  onTrackOrder?: (orderNumber: string) => void;
}

const COMMON_UNITS = ['kg', 'g', 'litre', 'ml', 'packet', 'piece', 'bunch', 'dozen', 'box'];

const POPULAR_GROCERY_SUGGESTIONS = [
  // Fresh Dairy & Curd Specialties
  { name: 'Fresh Curd (Dahi)', unit: 'kg', defaultQty: 1, category: 'dairy' },
  { name: 'Fresh Malai', unit: 'g', defaultQty: 250, category: 'dairy' },
  { name: 'Pure Cow / Buffalo Milk', unit: 'litre', defaultQty: 2, category: 'dairy' },
  { name: 'Fresh Soft Paneer', unit: 'g', defaultQty: 500, category: 'dairy' },
  { name: 'Spiced Taak (Buttermilk)', unit: 'packet', defaultQty: 2, category: 'dairy' },
  { name: 'Sweet Delicious Lassi', unit: 'ml', defaultQty: 500, category: 'dairy' },
  { name: 'Pure Cow Ghee', unit: 'g', defaultQty: 500, category: 'dairy' },
  // Daily Grocery Staples
  { name: 'Sona Masoori Rice', unit: 'kg', defaultQty: 5, category: 'staple' },
  { name: 'Whole Wheat Atta', unit: 'kg', defaultQty: 5, category: 'staple' },
  { name: 'Toor Dal', unit: 'kg', defaultQty: 2, category: 'staple' },
  { name: 'Moong Dal', unit: 'kg', defaultQty: 1, category: 'staple' },
  { name: 'Sunflower Cooking Oil', unit: 'litre', defaultQty: 2, category: 'staple' },
  { name: 'Refined Sugar', unit: 'kg', defaultQty: 2, category: 'staple' },
  { name: 'Tata Salt', unit: 'kg', defaultQty: 1, category: 'staple' },
  { name: 'Fresh Tomatoes', unit: 'kg', defaultQty: 2, category: 'produce' },
  { name: 'Onions', unit: 'kg', defaultQty: 3, category: 'produce' },
  { name: 'Potatoes', unit: 'kg', defaultQty: 2, category: 'produce' },
  { name: 'Turmeric Powder', unit: 'g', defaultQty: 200, category: 'spice' },
  { name: 'Tea Powder', unit: 'g', defaultQty: 500, category: 'staple' },
];

export const GroceryWizard: React.FC<GroceryWizardProps> = ({
  initialOption = 'manual',
  initialItems,
  onOrderSubmitted,
  onTrackOrder,
}) => {
  // Wizard steps: 1 = Customer Info, 2 = Grocery List (Manual / Upload), 3 = Review & Submit, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [listMode, setListMode] = useState<'manual' | 'upload'>(initialOption);

  // Customer state
  const [customer, setCustomer] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    city: 'Solapur',
    pincode: '413005',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Grocery items list
  const [items, setItems] = useState<Array<{ id: string; name: string; quantity: number; unit: string; notes: string }>>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes || '',
      }));
    }
    return [
      { id: '1', name: 'Fresh Curd (Dahi)', quantity: 1, unit: 'kg', notes: 'Daily Fresh Batch' },
      { id: '2', name: 'Fresh Malai', quantity: 250, unit: 'g', notes: 'Thick Cream' },
      { id: '3', name: 'Pure Cow Milk', quantity: 2, unit: 'litre', notes: 'Morning Delivery' },
      { id: '4', name: 'Fresh Soft Paneer', quantity: 500, unit: 'g', notes: 'Farm Fresh' },
      { id: '5', name: 'Sona Masoori Rice', quantity: 5, unit: 'kg', notes: 'Aged' },
    ];
  });

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(
        initialItems.map((item, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          notes: item.notes || '',
        }))
      );
    }
  }, [initialItems]);

  // Option B: Image Upload & OCR state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isExtractingOCR, setIsExtractingOCR] = useState(false);
  const [ocrSuccessMessage, setOcrSuccessMessage] = useState<string>('');
  const [ocrErrorMessage, setOcrErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Search filter for quick item addition
  const [searchQuery, setSearchQuery] = useState('');

  // Order submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [submitError, setSubmitError] = useState('');

  // -----------------------------------------------------------------
  // Validation: Customer Step
  // -----------------------------------------------------------------
  const validateCustomerStep = () => {
    const errors: { [key: string]: string } = {};

    if (!customer.name.trim()) {
      errors.name = 'Please enter your full name.';
    } else if (customer.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    const cleanMobile = customer.mobile.replace(/\D/g, '');
    if (!customer.mobile.trim()) {
      errors.mobile = 'Please enter your mobile number.';
    } else if (cleanMobile.length < 10) {
      errors.mobile = 'Please enter a valid mobile number (at least 10 digits).';
    }

    if (!customer.address.trim()) {
      errors.address = 'Please enter your delivery address.';
    } else if (customer.address.trim().length < 5) {
      errors.address = 'Please enter a complete address for timely delivery.';
    }

    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextFromCustomer = () => {
    if (validateCustomerStep()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // -----------------------------------------------------------------
  // Manual List Operations
  // -----------------------------------------------------------------
  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unit: 'kg',
      notes: '',
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleQuickAdd = (suggestion: { name: string; unit: string; defaultQty: number }) => {
    const exists = items.some((i) => i.name.toLowerCase() === suggestion.name.toLowerCase());
    if (exists) {
      setItems((prev) =>
        prev.map((i) =>
          i.name.toLowerCase() === suggestion.name.toLowerCase()
            ? { ...i, quantity: Number(i.quantity) + 1 }
            : i
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now().toString() + Math.random(),
          name: suggestion.name,
          quantity: suggestion.defaultQty,
          unit: suggestion.unit,
          notes: '',
        },
      ]);
    }
  };

  const handleUpdateItem = (id: string, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // -----------------------------------------------------------------
  // Option B: Image Upload & OCR
  // -----------------------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setOcrErrorMessage('Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    // Validate size (< 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setOcrErrorMessage('Image size exceeds 15MB limit. Please choose a smaller photo.');
      return;
    }

    setImageFileName(file.name);
    setOcrErrorMessage('');
    setOcrSuccessMessage('');

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadedImage(base64);
      processOCR(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const processOCR = async (base64Img: string, mimeType = 'image/jpeg') => {
    setIsExtractingOCR(true);
    setOcrErrorMessage('');
    setOcrSuccessMessage('');

    try {
      const response = await api.extractOCR(base64Img, mimeType);
      if (response.success && response.items && response.items.length > 0) {
        const parsedItems = response.items.map((it, idx) => ({
          id: `ocr-${Date.now()}-${idx}`,
          name: it.name,
          quantity: it.quantity || 1,
          unit: it.unit || 'kg',
          notes: it.notes || '',
        }));

        setItems(parsedItems);
        setOcrSuccessMessage(
          `Extracted ${parsedItems.length} items using ${response.source || 'AI OCR'}. Please review and modify before submitting!`
        );
      } else {
        setOcrErrorMessage('Could not extract any grocery items. Please add items manually or try another photo.');
      }
    } catch (err: any) {
      setOcrErrorMessage(err.message || 'OCR processing failed. Please enter items manually.');
    } finally {
      setIsExtractingOCR(false);
    }
  };

  // Load sample demo lists for testing convenience
  const loadDemoSampleImage = (type: 'handwritten' | 'receipt') => {
    setOcrErrorMessage('');
    setImageFileName(type === 'handwritten' ? 'handwritten_grocery_list.png' : 'store_receipt_sample.png');

    // Create an elegant synthetic handwritten canvas as demonstration data URL
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Paper background
      ctx.fillStyle = '#FFFDF8';
      ctx.fillRect(0, 0, 600, 400);

      // Notebook blue lines
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      for (let y = 50; y < 400; y += 35) {
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(570, y);
        ctx.stroke();
      }

      // Notebook red margin line
      ctx.strokeStyle = '#FCA5A5';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(90, 20);
      ctx.lineTo(90, 380);
      ctx.stroke();

      // Heading
      ctx.font = 'bold 22px cursive, sans-serif';
      ctx.fillStyle = '#1E3A8A';
      ctx.fillText("Kanaki's Store & Dairy - Grocery", 110, 42);

      // Items
      ctx.font = '19px cursive, sans-serif';
      ctx.fillStyle = '#1F2937';
      const sampleText = [
        '1. Fresh Curd (Dahi) 1kg',
        '2. Fresh Malai 250g',
        '3. Soft Paneer 500g',
        '4. Spiced Taak 2 packets',
        '5. Fresh Milk 2L',
        '6. Sona Masoori Rice 5kg',
      ];
      sampleText.forEach((txt, i) => {
        ctx.fillText(txt, 110, 85 + i * 35);
      });

      const demoUrl = canvas.toDataURL('image/png');
      setUploadedImage(demoUrl);
      processOCR(demoUrl, 'image/png');
    }
  };

  // -----------------------------------------------------------------
  // Order Submission
  // -----------------------------------------------------------------
  const handleFinalSubmit = async () => {
    // Basic validation
    if (items.length === 0) {
      setSubmitError('Please add at least one grocery item before submitting.');
      return;
    }

    const validItems = items.filter((i) => i.name.trim().length > 0);
    if (validItems.length === 0) {
      setSubmitError('All grocery items are empty. Please enter item names.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const order = await api.createOrder({
        customer,
        items: validItems,
        source: listMode === 'upload' ? 'Image Upload' : 'Manual Entry',
      });

      setSubmittedOrder(order);
      setStep(4);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2D6A4F', '#52B788', '#D8F3DC', '#B7E4C7', '#FBBF24'],
      });

      if (onOrderSubmitted) {
        onOrderSubmitted(order);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit grocery list. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------------------------------------------
  // Filtered search list
  // -----------------------------------------------------------------
  const filteredSuggestions = searchQuery.trim()
    ? POPULAR_GROCERY_SUGGESTIONS.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : POPULAR_GROCERY_SUGGESTIONS;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Step Indicator Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          {/* Connecting line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-[#E5DFD5] -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#2D6A4F] transition-all duration-300 -z-0"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />

          {/* Steps */}
          {[
            { num: 1, label: 'Customer Info' },
            { num: 2, label: 'Grocery List' },
            { num: 3, label: 'Review & Confirm' },
            { num: 4, label: 'Order Submitted' },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#1B4332] text-white ring-4 ring-[#D8F3DC]'
                    : step > s.num
                    ? 'bg-[#2D6A4F] text-white'
                    : 'bg-white border-2 border-[#D8CFBF] text-stone-500'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span
                className={`text-[11px] sm:text-xs font-semibold mt-1.5 whitespace-nowrap ${
                  step >= s.num ? 'text-[#1B4332]' : 'text-stone-600'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps Content Wrapped in AnimatePresence */}
      <AnimatePresence mode="wait">
        {/* ========================================================= */}
        {/* STEP 1: CUSTOMER INFORMATION FORM */}
        {/* ========================================================= */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D9] shadow-sm"
          >
          <div className="flex items-center gap-3 pb-6 border-b border-stone-100 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5EE] text-[#2D6A4F] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B4332] font-display">
                Customer Information
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Please enter your contact and delivery details so Kanaki's Store can pack and fulfill your order.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="cust-fullname-input"
                  type="text"
                  placeholder="e.g. Ganesh Kanaki"
                  value={customer.name}
                  onChange={(e) => {
                    setCustomer({ ...customer, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-hidden transition-all ${
                    formErrors.name
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-[#D8CFBF] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10'
                  }`}
                />
              </div>
              {formErrors.name && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="cust-mobile-input"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={customer.mobile}
                  onChange={(e) => {
                    setCustomer({ ...customer, mobile: e.target.value });
                    if (formErrors.mobile) setFormErrors({ ...formErrors, mobile: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-hidden transition-all ${
                    formErrors.mobile
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-[#D8CFBF] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10'
                  }`}
                />
              </div>
              {formErrors.mobile && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.mobile}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="cust-email-input"
                  type="email"
                  placeholder="e.g. ganesh@example.com"
                  value={customer.email}
                  onChange={(e) => {
                    setCustomer({ ...customer, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-hidden transition-all ${
                    formErrors.email
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-[#D8CFBF] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10'
                  }`}
                />
              </div>
              {formErrors.email && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Delivery Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <textarea
                  id="cust-address-input"
                  rows={2}
                  placeholder="House / Flat No., Street, Landmark, Area"
                  value={customer.address}
                  onChange={(e) => {
                    setCustomer({ ...customer, address: e.target.value });
                    if (formErrors.address) setFormErrors({ ...formErrors, address: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-hidden transition-all ${
                    formErrors.address
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-[#D8CFBF] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10'
                  }`}
                />
              </div>
              {formErrors.address && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.address}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                City
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="cust-city-input"
                  type="text"
                  placeholder="Solapur"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D8CFBF] text-sm font-medium focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Pincode
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="cust-pincode-input"
                  type="text"
                  placeholder="413005"
                  value={customer.pincode}
                  onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D8CFBF] text-sm font-medium focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Fields marked with <span className="text-red-500 font-bold">*</span> are required
            </span>
            <button
              id="continue-to-list-btn"
              onClick={handleNextFromCustomer}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2D6A4F] text-white font-bold text-sm shadow-md shadow-[#2D6A4F]/20 hover:bg-[#1B4332] active:scale-98 transition-all"
            >
              <span>Next: Create Grocery List</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: GROCERY LIST CREATION (OPTIONS A & B) */}
      {/* ========================================================= */}
      {step === 2 && (
        <motion.div
          key="step-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Method Selector Tabs */}
          <div className="bg-white rounded-2xl p-2 border border-[#E8E2D9] shadow-2xs flex gap-2">
            <button
              id="tab-manual-entry-btn"
              onClick={() => setListMode('manual')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                listMode === 'manual'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-[#FAF7F2] hover:text-[#1B4332]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Option A — Type Grocery List</span>
            </button>

            <button
              id="tab-upload-image-btn"
              onClick={() => setListMode('upload')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                listMode === 'upload'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-[#FAF7F2] hover:text-[#1B4332]'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Option B — Upload Grocery Image</span>
              <span className="text-[10px] uppercase tracking-wider bg-emerald-700 text-emerald-100 px-1.5 py-0.5 rounded-full font-bold">
                AI OCR
              </span>
            </button>
          </div>

          {/* ------------------------------------------------------- */}
          {/* OPTION B: UPLOAD GROCERY IMAGE CONTAINER */}
          {/* ------------------------------------------------------- */}
          {listMode === 'upload' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D9] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1B4332] font-display">
                    Upload Your Grocery List
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Upload a photo of your handwritten or printed grocery list. Our AI Vision model will extract all items automatically!
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF5EE] text-[#1B4332]">
                  <Sparkles className="w-3.5 h-3.5 text-[#40916C]" />
                  Gemini Vision Powered
                </span>
              </div>

              {/* Upload Drag-and-Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  uploadedImage
                    ? 'border-[#40916C] bg-[#F4FAF6]'
                    : 'border-[#D8CFBF] hover:border-[#2D6A4F] bg-[#FAF8F5]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8E2D9] shadow-sm flex items-center justify-center text-[#2D6A4F]">
                    {isExtractingOCR ? (
                      <Loader2 className="w-7 h-7 animate-spin text-[#2D6A4F]" />
                    ) : (
                      <UploadCloud className="w-7 h-7" />
                    )}
                  </div>

                  <div>
                    <p className="text-base font-bold text-[#1B4332]">
                      {isExtractingOCR
                        ? 'Analyzing image with Gemini Vision OCR...'
                        : uploadedImage
                        ? 'Uploaded: ' + (imageFileName || 'Grocery photo')
                        : 'Upload Your Grocery List'}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Upload a photo of your handwritten or printed grocery list (JPG, JPEG, PNG, WEBP)
                    </p>
                  </div>

                  {/* Buttons inside dropzone */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] transition-colors"
                    >
                      Choose Photo From Device
                    </button>
                  </div>
                </div>
              </div>

              {/* Sample test buttons for quick demo evaluation */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E2D9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-stone-600 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#40916C]" />
                  Don't have an image on this computer? Test with instant sample:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadDemoSampleImage('handwritten')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#D8CFBF] text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-bold transition-colors"
                  >
                    📝 Load Handwritten Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => loadDemoSampleImage('receipt')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#D8CFBF] text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-bold transition-colors"
                  >
                    🧾 Load Receipt Sample
                  </button>
                </div>
              </div>

              {/* Preview Thumbnail and OCR Status */}
              {uploadedImage && (
                <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl bg-[#EAF5EE] border border-[#D8F3DC] shadow-xs">
                  <div className="relative w-28 h-28 shrink-0 overflow-hidden rounded-xl border-2 border-[#52B788] shadow-sm bg-white">
                    <img
                      src={uploadedImage}
                      alt="Grocery List Upload"
                      className="w-full h-full object-cover"
                    />
                    {isExtractingOCR && (
                      <>
                        <motion.div
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#52B788] to-transparent shadow-[0_0_10px_#52B788] z-10"
                        />
                        <div className="absolute inset-0 bg-[#2D6A4F]/10 pointer-events-none" />
                      </>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
                        OCR Extraction Status
                      </p>
                      {isExtractingOCR && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 animate-pulse">
                          Scanning with AI...
                        </span>
                      )}
                    </div>
                    {isExtractingOCR ? (
                      <div className="space-y-1">
                        <p className="text-xs text-stone-700 flex items-center gap-2 font-medium">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2D6A4F]" />
                          Reading handwriting and categorizing quantities & units...
                        </p>
                        <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                            className="w-1/2 h-full bg-[#2D6A4F] rounded-full"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-[#1B4332]">
                        {ocrSuccessMessage ||
                          'Image processed successfully. The extracted items are displayed in the editable table below for your review.'}
                      </p>
                    )}
                    <p className="text-[11px] text-stone-500">
                      <strong>Important Notice:</strong> Never automatically submitted — you can edit or add items below before placing the order!
                    </p>
                  </div>
                </div>
              )}

              {ocrErrorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{ocrErrorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* OPTION A / SHARED REVIEW TABLE */}
          {/* ------------------------------------------------------- */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D9] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1B4332] font-display">
                  {listMode === 'upload' ? 'Review & Edit Extracted Items' : 'Your Grocery Items'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  {listMode === 'upload'
                    ? 'Review the OCR results, correct any handwriting mistakes, and adjust quantities.'
                    : 'Add any grocery item, select quantity and unit, or search from popular staples.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2D6A4F] bg-[#EAF5EE] px-3 py-1.5 rounded-xl">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'} in List
                </span>
                <button
                  id="add-grocery-item-top-btn"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Grocery Item</span>
                </button>
              </div>
            </div>

            {/* Quick Staples Auto-Suggest / Chips */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D9] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#40916C]" />
                  <span>Quick Staple Suggestions & Search</span>
                </label>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search staples (Rice, Dal, Oil...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#D8CFBF] bg-white text-xs focus:outline-hidden focus:border-[#2D6A4F]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {filteredSuggestions.map((sug) => (
                  <button
                    key={sug.name}
                    type="button"
                    onClick={() => handleQuickAdd(sug)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#D8CFBF] text-xs font-medium text-stone-800 hover:bg-[#EAF5EE] hover:border-[#40916C] hover:text-[#1B4332] active:scale-95 transition-all"
                  >
                    <Plus className="w-3 h-3 text-[#40916C]" />
                    <span>{sug.name}</span>
                    <span className="text-[10px] text-stone-600 bg-stone-100 px-1 rounded-xs">
                      {sug.defaultQty} {sug.unit}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Items Table */}
            {items.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-[#E8E2D9] rounded-2xl">
                <FileText className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-stone-700">Your grocery list is empty</p>
                <p className="text-xs text-stone-500 mt-1 mb-4">
                  Click below to add your first item or pick from the popular suggestions above.
                </p>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Grocery Item</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3 w-10">#</th>
                      <th className="py-2.5 px-3">Item Name</th>
                      <th className="py-2.5 px-3 w-28">Quantity</th>
                      <th className="py-2.5 px-3 w-32">Unit</th>
                      <th className="py-2.5 px-3">Notes / Brand</th>
                      <th className="py-2.5 px-3 w-12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm">
                    {items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#FAF9F5] transition-colors group">
                        <td className="py-3 px-3 text-xs font-semibold text-stone-600">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            placeholder="e.g. Sona Masoori Rice"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#D8CFBF] focus:outline-hidden focus:border-[#2D6A4F] text-sm font-medium bg-white"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            step="any"
                            min="0.1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value) || 1)}
                            className="w-full px-3 py-2 rounded-lg border border-[#D8CFBF] focus:outline-hidden focus:border-[#2D6A4F] text-sm font-medium bg-white"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={item.unit}
                            onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                            className="w-full px-2.5 py-2 rounded-lg border border-[#D8CFBF] focus:outline-hidden focus:border-[#2D6A4F] text-xs font-medium bg-white"
                          >
                            {COMMON_UNITS.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            placeholder="e.g. Organic, Aged"
                            value={item.notes}
                            onChange={(e) => handleUpdateItem(item.id, 'notes', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#D8CFBF] focus:outline-hidden focus:border-[#2D6A4F] text-xs font-medium bg-white"
                          />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bottom Add Item Button */}
            <div className="pt-2">
              <button
                id="add-grocery-item-bottom-btn"
                type="button"
                onClick={handleAddItem}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#2D6A4F]/40 hover:border-[#2D6A4F] text-[#1B4332] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#EAF5EE]/50 transition-all"
              >
                <Plus className="w-4 h-4 text-[#40916C]" />
                <span>+ Add Grocery Item</span>
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#D8CFBF] text-stone-700 font-bold text-sm hover:bg-[#FAF7F2] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back: Customer Info</span>
              </button>

              <button
                id="review-order-btn"
                onClick={() => {
                  if (items.filter((i) => i.name.trim().length > 0).length === 0) {
                    alert('Please enter at least one grocery item.');
                    return;
                  }
                  setStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2D6A4F] text-white font-bold text-sm shadow-md shadow-[#2D6A4F]/20 hover:bg-[#1B4332] active:scale-98 transition-all"
              >
                <span>Review & Confirm Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* STEP 3: REVIEW & FINAL CONFIRMATION */}
      {/* ========================================================= */}
      {step === 3 && (
        <motion.div
          key="step-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D9] shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1B4332] font-display">
                Review & Confirm Grocery Order
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Please double-check your delivery information and grocery list before final submission.
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit List</span>
            </button>
          </div>

          {/* Customer Summary Box */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8E2D9] space-y-3">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Customer & Delivery Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-stone-600 block">Full Name:</span>
                <span className="font-bold text-[#1B4332]">{customer.name}</span>
              </div>
              <div>
                <span className="text-xs text-stone-600 block">Mobile Number:</span>
                <span className="font-bold text-[#1B4332]">{customer.mobile}</span>
              </div>
              <div>
                <span className="text-xs text-stone-600 block">Email Address:</span>
                <span className="font-medium text-stone-800">{customer.email || '—'}</span>
              </div>
              <div>
                <span className="text-xs text-stone-600 block">City & Pincode:</span>
                <span className="font-medium text-stone-800">
                  {customer.city || 'Hubballi'} {customer.pincode ? `— ${customer.pincode}` : ''}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-stone-600 block">Delivery Address:</span>
                <span className="font-medium text-stone-800">{customer.address}</span>
              </div>
            </div>
          </div>

          {/* Grocery Items Review Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Grocery Items ({items.length})
              </h4>
              <span className="text-xs text-stone-500">
                Source: <strong className="text-[#1B4332]">{listMode === 'upload' ? 'Image Upload (OCR)' : 'Manual Entry'}</strong>
              </span>
            </div>

            <div className="rounded-2xl border border-[#E8E2D9] overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-[#FAF9F5] border-b border-stone-200 text-xs font-bold text-stone-600">
                  <tr>
                    <th className="py-2.5 px-4 w-12">#</th>
                    <th className="py-2.5 px-4">Grocery Item</th>
                    <th className="py-2.5 px-4 w-28 text-center">Quantity</th>
                    <th className="py-2.5 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {items.map((it, idx) => (
                    <tr key={it.id} className="hover:bg-stone-50/60">
                      <td className="py-2.5 px-4 text-xs font-semibold text-stone-600">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-bold text-[#1B4332]">{it.name}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#EAF5EE] text-[#1B4332] font-bold text-xs">
                          {it.quantity} {it.unit}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-stone-500">{it.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {submitError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#D8CFBF] text-stone-700 font-bold text-sm hover:bg-[#FAF7F2] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Edit</span>
            </button>

            <button
              id="confirm-submit-order-btn"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] text-white font-bold text-base shadow-lg shadow-[#2D6A4F]/25 hover:from-[#1B4332] hover:to-[#081C15] active:scale-98 transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving & Updating Excel...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#95D5B2]" />
                  <span>Confirm & Submit Order</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* STEP 4: ORDER SUCCESS CONFIRMATION */}
      {/* ========================================================= */}
      {step === 4 && submittedOrder && (
        <motion.div
          key="step-4"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E2D9] shadow-xl text-center space-y-6"
        >
          {/* Nature Sprout Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#2D6A4F]/30"
          >
            <span className="text-4xl">🌿</span>
          </motion.div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5EE] text-[#1B4332]">
              Order Placed Successfully
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-display">
              "Your grocery list has been submitted successfully!"
            </h2>
            <p className="text-sm text-stone-600 max-w-lg mx-auto">
              Thank you, <strong className="text-[#1B4332]">{submittedOrder.customerName}</strong>! Our store team is preparing your fresh order right now.
            </p>
          </div>

          {/* Reference Number Pill */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#D8CFBF] max-w-md mx-auto">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              Order Reference Number
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-extrabold text-[#2D6A4F] tracking-wide">
              {submittedOrder.orderNumber}
            </p>
            <p className="text-xs text-stone-500 mt-2">
              Save this reference number to track your delivery or inquire at the store.
            </p>
          </div>

          {/* Excel Synchronization Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
            <span>Automatically recorded into store database and master workbook <strong>kanakis_store_orders.xlsx</strong></span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href={api.getExcelDownloadUrl('all')}
              download="kanakis_store_orders.xlsx"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2D6A4F] text-white font-bold text-xs hover:bg-[#1B4332] shadow-sm transition-colors"
            >
              <Download className="w-4 h-4 text-[#95D5B2]" />
              <span>Download Excel Report (.xlsx)</span>
            </a>

            {onTrackOrder && (
              <button
                onClick={() => onTrackOrder(submittedOrder.orderNumber)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#2D6A4F] text-[#2D6A4F] font-bold text-xs hover:bg-[#EAF5EE] transition-colors"
              >
                <span>Track This Order</span>
              </button>
            )}

            <button
              onClick={() => {
                setStep(1);
                setCustomer({
                  name: '',
                  mobile: '',
                  email: '',
                  address: '',
                  city: 'Solapur',
                  pincode: '413005',
                });
                setItems([
                  { id: '1', name: 'Fresh Curd (Dahi)', quantity: 1, unit: 'kg', notes: 'Fresh morning batch' },
                  { id: '2', name: 'Sona Masoori Rice', quantity: 5, unit: 'kg', notes: '' },
                ]);
                setUploadedImage(null);
                setSubmittedOrder(null);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Submit Another Grocery List</span>
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};
