import React, { useState } from 'react';
import {
  ShoppingBag,
  UploadCloud,
  CheckCircle2,
  FileSpreadsheet,
  Truck,
  Leaf,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package,
  HeartHandshake,
  Clock,
  ChevronRight,
  Layers,
  Award
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DairySpecialtyBanner } from './components/DairySpecialtyBanner';
import { GroceryWizard } from './components/GroceryWizard';
import { OrderTracker } from './components/OrderTracker';
import { FeedbackSection } from './components/FeedbackSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { Dairy3DViewer } from './components/Dairy3DViewer';
import { VegetableShowcase } from './components/VegetableShowcase';
import { Order } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'create' | 'orders' | 'feedback' | 'admin' | '3d-dairy'>('home');
  const [wizardInitialOption, setWizardInitialOption] = useState<'manual' | 'upload'>('manual');
  const [activeTrackingNumber, setActiveTrackingNumber] = useState<string>('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selected3DModel, setSelected3DModel] = useState<'paneer' | 'curd' | 'milk'>('paneer');
  const [preselectedDairyItems, setPreselectedDairyItems] = useState<
    Array<{ name: string; quantity: number; unit: string; notes?: string }> | undefined
  >(undefined);

  const handleOpen3DViewer = (model: 'paneer' | 'curd' | 'milk' = 'paneer') => {
    setSelected3DModel(model);
    const el = document.getElementById('paneer-3d-section');
    if (el && currentTab === 'home') {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentTab('3d-dairy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToVegetables = () => {
    if (currentTab !== 'home') {
      setCurrentTab('home');
      setTimeout(() => {
        const el = document.getElementById('vegetables-importance-showcase');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      const el = document.getElementById('vegetables-importance-showcase');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddVegetableToList = (item: { name: string; quantity: number; unit: string; notes?: string }) => {
    setPreselectedDairyItems([
      { name: item.name, quantity: item.quantity, unit: item.unit, notes: item.notes || 'Daily Solapur Farm Harvest' },
      { name: 'Fresh Curd (Dahi)', quantity: 1, unit: 'kg', notes: 'Pot Set' },
      { name: 'Pure Cow Milk', quantity: 1, unit: 'litre', notes: 'Daily Fresh' },
    ]);
    setWizardInitialOption('manual');
    setCurrentTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdd3DItemToList = (item: { name: string; quantity: number; unit: string; notes?: string }) => {
    setPreselectedDairyItems([
      { name: item.name, quantity: item.quantity, unit: item.unit, notes: item.notes || '3D Inspected Fresh Daily Batch' },
      { name: 'Pure Whole Milk', quantity: 1, unit: 'litre', notes: 'Daily Fresh' },
      { name: 'Fresh Curd (Dahi)', quantity: 1, unit: 'kg', notes: 'Pot Set' },
    ]);
    setWizardInitialOption('manual');
    setCurrentTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartManual = () => {
    setWizardInitialOption('manual');
    setPreselectedDairyItems(undefined);
    setCurrentTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartUpload = () => {
    setWizardInitialOption('upload');
    setPreselectedDairyItems(undefined);
    setCurrentTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAddDairyItem = (item: { name: string; quantity: number; unit: string; notes: string }) => {
    setPreselectedDairyItems([
      { name: item.name, quantity: item.quantity, unit: item.unit, notes: item.notes },
      { name: 'Pure Cow Milk', quantity: 2, unit: 'litre', notes: 'Daily Fresh' },
      { name: 'Fresh Soft Paneer', quantity: 500, unit: 'g', notes: 'Melt in mouth' },
      { name: 'Sona Masoori Rice', quantity: 5, unit: 'kg', notes: 'Aged' },
    ]);
    setWizardInitialOption('manual');
    setCurrentTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSubmitted = (order: Order) => {
    setActiveTrackingNumber(order.orderNumber);
  };

  const handleTrackOrder = (orderNumber: string) => {
    setActiveTrackingNumber(orderNumber);
    setCurrentTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col selection:bg-[#52B788]/20 selection:text-[#1B4332]">
      {/* Primary Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenContact={() => setIsContactOpen(true)}
        onJumpToVegetables={handleJumpToVegetables}
      />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* HOME VIEW */}
        {/* ========================================================= */}
        {currentTab === 'home' && (
          <div className="space-y-16 lg:space-y-24">
            {/* Hero Section */}
            <Hero
              onStartManual={handleStartManual}
              onStartUpload={handleStartUpload}
            />

            {/* Special Dairy & Curd Business Showcase */}
            <DairySpecialtyBanner
              onQuickAddItem={handleQuickAddDairyItem}
              onOrderDairyNow={handleStartManual}
              onView3D={handleOpen3DViewer}
            />

            {/* Interactive 360-Degree 3D Dairy Inspector Section (Paneer Spotlight) */}
            <section id="paneer-3d-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
              <Dairy3DViewer
                selectedModel={selected3DModel}
                onAddToList={handleAdd3DItemToList}
              />
            </section>

            {/* Fresh Vegetables Importance Showcase with Horizontal Scrolling Animation */}
            <VegetableShowcase onAddToList={handleAddVegetableToList} />

            {/* How It Works (Section 21) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5EE] text-[#1B4332]">
                  Effortless Ordering Process
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] font-display">
                  How Kanaki's Store Works
                </h2>
                <p className="text-stone-600 text-sm sm:text-base">
                  From your paper scribble or typed list to neatly packed grocery bags at your door in 4 easy steps.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: '01',
                    icon: <Leaf className="w-6 h-6 text-[#2D6A4F]" />,
                    title: '1. Enter Details',
                    desc: 'Provide your name, phone number, and delivery address in Solapur (413005).',
                  },
                  {
                    step: '02',
                    icon: <UploadCloud className="w-6 h-6 text-[#2D6A4F]" />,
                    title: '2. Create or Upload',
                    desc: 'Type items, pick fresh curd & dairy specials, or upload a handwritten notepad photo.',
                  },
                  {
                    step: '03',
                    icon: <CheckCircle2 className="w-6 h-6 text-[#2D6A4F]" />,
                    title: '3. Review & Edit',
                    desc: 'Review items parsed by Gemini AI OCR, adjust quantities, and confirm.',
                  },
                  {
                    step: '04',
                    icon: <Truck className="w-6 h-6 text-[#2D6A4F]" />,
                    title: '4. Fast Delivery',
                    desc: 'We pack the freshest grains, dairy, and veggies and deliver them to your home.',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="relative bg-white p-7 rounded-3xl border border-[#E8E2D9] shadow-2xs hover:shadow-md hover:border-[#2D6A4F]/40 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-600 uppercase tracking-wider block mb-1">
                      Step {item.step}
                    </span>
                    <h3 className="text-lg font-bold text-[#1B4332] mb-2 font-display">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Accept All Grocery Items (Section 23) */}
            <section className="bg-[#FAF8F5] py-16 border-y border-[#E8E2D9]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5EE] text-[#1B4332]">
                      Zero Restrictions
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] font-display">
                      Buy Any Type of Grocery Item
                    </h2>
                    <p className="text-stone-600 text-sm max-w-xl">
                      Whatever brand or local staple is written on your slip, Kanaki's Store sources it directly for you.
                    </p>
                  </div>

                  <button
                    onClick={handleStartManual}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2D6A4F] text-white font-bold text-xs hover:bg-[#1B4332] transition-colors self-start md:self-auto"
                  >
                    <span>Start Grocery List</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    {
                      category: 'Rice & Grains',
                      emoji: '🌾',
                      examples: 'Sona Masoori, Basmati, Whole Wheat Atta, Poha',
                    },
                    {
                      category: 'Pulses & Dals',
                      emoji: '🥣',
                      examples: 'Toor Dal, Moong, Chana, Urad Dal, Rajma',
                    },
                    {
                      category: 'Fresh Dairy',
                      emoji: '🥛',
                      examples: 'Pure Cow Milk, Curd, Fresh Paneer, Farm Ghee',
                    },
                    {
                      category: 'Oils & Ghee',
                      emoji: '🌻',
                      examples: 'Sunflower Oil, Groundnut Oil, Mustard, Gingelly',
                    },
                    {
                      category: 'Spices & Masalas',
                      emoji: '🌶️',
                      examples: 'Turmeric, Chilli, Coriander, Garam Masala',
                    },
                    {
                      category: 'Fresh Vegetables',
                      emoji: '🥦',
                      examples: 'Tomatoes, Onions, Potatoes, Ginger, Greens',
                    },
                  ].map((cat) => (
                    <div
                      key={cat.category}
                      className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-2xs hover:border-[#2D6A4F] transition-all space-y-2 cursor-pointer"
                      onClick={handleStartManual}
                    >
                      <span className="text-3xl block">{cat.emoji}</span>
                      <h4 className="font-bold text-sm text-[#1B4332]">{cat.category}</h4>
                      <p className="text-[11px] text-stone-500 leading-snug">{cat.examples}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Store Features: Excel Sync & Nature Guarantee */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#081C15] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#52B788]/20 text-[#B7E4C7] border border-[#52B788]/40">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#74C69D]" />
                      Organized Store Database
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
                      Never Lose a Grocery Record. <br />
                      Saved Directly to Excel.
                    </h2>
                    <p className="text-sm sm:text-base text-[#D8F3DC]/80 leading-relaxed max-w-xl">
                      Every order is categorized by customer name, timestamped, and structured with items, quantities, and units inside our store's automated Excel workbook.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={handleStartUpload}
                        className="px-6 py-3.5 rounded-xl bg-white text-[#1B4332] font-bold text-sm hover:bg-[#FAF8F5] transition-colors shadow-sm"
                      >
                        Upload Photo of Grocery List
                      </button>
                      <button
                        onClick={() => setCurrentTab('admin')}
                        className="px-6 py-3.5 rounded-xl bg-[#40916C]/40 border border-[#74C69D]/40 text-white font-bold text-sm hover:bg-[#40916C]/60 transition-colors"
                      >
                        Store Owner Login
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/20">
                      <span className="font-bold text-[#D8F3DC]">kanakis_store_orders.xlsx</span>
                      <span className="text-[10px] bg-[#52B788] text-[#081C15] px-2 py-0.5 rounded-full font-bold">
                        Live Synced
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#B7E4C7] space-y-1.5">
                      <p>✓ Sheet 1: Master Grocery Orders</p>
                      <p>✓ Sheet 2: Itemized Line Details</p>
                      <p>✓ Sheet 3: Registered Customers</p>
                      <p>✓ Sheet 4: Customer Feedback & Ratings</p>
                    </div>
                    <div className="pt-2">
                      <p className="text-[11px] text-[#D8F3DC]/70 italic">
                        Store managers can download the latest report at any time with one click.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer Feedback Component */}
            <FeedbackSection />
          </div>
        )}

        {/* ========================================================= */}
        {/* CREATE GROCERY LIST VIEW */}
        {/* ========================================================= */}
        {currentTab === 'create' && (
          <GroceryWizard
            initialOption={wizardInitialOption}
            initialItems={preselectedDairyItems}
            onOrderSubmitted={handleOrderSubmitted}
            onTrackOrder={handleTrackOrder}
          />
        )}

        {/* ========================================================= */}
        {/* MY ORDERS VIEW */}
        {/* ========================================================= */}
        {currentTab === 'orders' && (
          <OrderTracker
            initialSearch={activeTrackingNumber}
            onNewOrder={handleStartManual}
          />
        )}

        {/* ========================================================= */}
        {/* FEEDBACK VIEW */}
        {/* ========================================================= */}
        {currentTab === 'feedback' && (
          <div className="py-8">
            <FeedbackSection />
          </div>
        )}

        {/* ========================================================= */}
        {/* ADMIN DASHBOARD VIEW */}
        {/* ========================================================= */}
        {currentTab === 'admin' && <AdminDashboard />}

        {/* ========================================================= */}
        {/* 360 DEGREE 3D DAIRY VIEW TAB */}
        {/* ========================================================= */}
        {currentTab === '3d-dairy' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentTab('home')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:text-[#1B4332] hover:bg-[#EAF5EE] transition-colors shadow-2xs cursor-pointer"
              >
                ← Back to Home
              </button>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] bg-[#EAF5EE] px-3.5 py-1.5 rounded-full border border-[#B7E4C7]">
                <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse"></span>
                <span>Solapur Store • 360° Real-time 3D Dairy Inspector</span>
              </div>
            </div>

            <Dairy3DViewer
              selectedModel={selected3DModel}
              onAddToList={handleAdd3DItemToList}
            />
          </div>
        )}
      </main>

      {/* Nature Inspired Footer */}
      <Footer
        onNavigate={setCurrentTab}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Contact Store Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
