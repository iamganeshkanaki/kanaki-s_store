import React, { useState, useEffect } from 'react';
import { Star, MessageSquareHeart, Send, CheckCircle2, User, Phone, Hash, AlertCircle, Quote } from 'lucide-react';
import { Feedback } from '../types';
import { api } from '../services/api';

const QUICK_SENTIMENTS = [
  'Excellent',
  'Very Good',
  'Good',
  'Average',
  'Needs Improvement',
];

export const FeedbackSection: React.FC = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [recentFeedbacks, setRecentFeedbacks] = useState<Feedback[]>([]);

  const loadFeedbacks = async () => {
    try {
      const data = await api.getFeedback();
      setRecentFeedbacks(data);
    } catch (err) {
      console.error('Failed to load feedback:', err);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !mobile.trim() || !feedback.trim()) {
      setErrorMessage('Please fill in your name, mobile number, and feedback comments.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage(false);

    try {
      await api.submitFeedback({
        customerName: name.trim(),
        mobile: mobile.trim(),
        orderNumber: orderNumber.trim() || undefined,
        rating,
        feedback: feedback.trim(),
      });

      setSuccessMessage(true);
      setName('');
      setMobile('');
      setOrderNumber('');
      setFeedback('');
      setRating(5);
      loadFeedbacks();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E2D9] shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5EE] text-[#1B4332]">
                Customer Reviews
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-display">
                We'd Love to Hear From You 🌿
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Your feedback helps Kanaki's Store keep groceries fresh, clean, and delivered right on time.
              </p>
            </div>

            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your feedback has been recorded in the database and store Excel report.</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="feedback-name-input"
                      type="text"
                      placeholder="e.g. Ganesh Kanaki"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8CFBF] text-xs font-medium focus:outline-hidden focus:border-[#2D6A4F]"
                      required
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="feedback-mobile-input"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8CFBF] text-xs font-medium focus:outline-hidden focus:border-[#2D6A4F]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Order ID */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Order ID (Optional)
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="feedback-ordernumber-input"
                    type="text"
                    placeholder="e.g. KKS-001 or KKS-20260910-001"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8CFBF] text-xs font-medium focus:outline-hidden focus:border-[#2D6A4F]"
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div className="pt-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 hover:scale-115 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300 hover:text-amber-200'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-[#1B4332] ml-2">
                    {rating === 5
                      ? '⭐⭐⭐⭐⭐ (5/5 — Excellent)'
                      : rating === 4
                      ? '⭐⭐⭐⭐ (4/5 — Very Good)'
                      : rating === 3
                      ? '⭐⭐⭐ (3/5 — Good)'
                      : rating === 2
                      ? '⭐⭐ (2/5 — Average)'
                      : '⭐ (1/5 — Needs Improvement)'}
                  </span>
                </div>
              </div>

              {/* Quick Sentiments */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1.5">
                  Quick feedback ideas:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SENTIMENTS.map((sentiment) => (
                    <button
                      key={sentiment}
                      type="button"
                      onClick={() =>
                        setFeedback((prev) => (prev ? `${prev} ${sentiment}.` : `${sentiment}.`))
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-stone-200 text-xs text-stone-700 hover:bg-[#EAF5EE] hover:text-[#1B4332] hover:border-[#40916C] transition-colors"
                    >
                      + {sentiment}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Your Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback-message-input"
                  rows={3}
                  placeholder="Tell us about the grocery quality, packing, or list upload experience..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#D8CFBF] text-xs font-medium focus:outline-hidden focus:border-[#2D6A4F]"
                  required
                />
              </div>

              <button
                id="submit-feedback-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#2D6A4F] text-white font-bold text-sm shadow-md shadow-[#2D6A4F]/20 hover:bg-[#1B4332] active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Feedback...' : 'Submit Feedback 🌿'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Customer Testimonials */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-[#1B4332] flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-[#40916C]" />
              <span>Recent Customer Experiences</span>
            </h3>

            <div className="space-y-3">
              {recentFeedbacks.slice(0, 4).map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-2 relative"
                >
                  <Quote className="w-6 h-6 text-[#95D5B2]/30 absolute top-4 right-4 pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1B4332]">{fb.customerName}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: fb.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed italic">
                    "{fb.feedback}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                    <span>{fb.orderNumber ? `Ref: ${fb.orderNumber}` : 'Verified Customer'}</span>
                    <span>{fb.createdAt ? fb.createdAt.slice(0, 10) : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
