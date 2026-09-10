import React from 'react';
import { ShoppingBag, UploadCloud, CheckCircle2, Sparkles, Shield, Clock, HeartHandshake, Leaf, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartManual: () => void;
  onStartUpload: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartManual, onStartUpload }) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle organic background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#EAF5EE] blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#F5EBE1] blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Nature pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5EE] border border-[#D8F3DC] text-[#1B4332] text-xs sm:text-sm font-semibold shadow-2xs">
              <Leaf className="w-4 h-4 text-[#2D6A4F]" />
              <span>Direct From Trusted Farmers & Wholesalers</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1B4332] tracking-tight leading-[1.15] font-display">
              Buy Any Type of Groceries, <br className="hidden sm:inline" />
              <span className="text-[#40916C] relative">
                All in One Place
                <svg className="absolute -bottom-2 left-0 w-full text-[#74C69D]/40" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C40 2 160 2 199 5.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-stone-600 max-w-2xl font-normal leading-relaxed">
              Create your grocery list, upload your handwritten list, and let{' '}
              <strong className="text-[#1B4332] font-semibold">Kanaki's Store</strong> keep everything organized for you.
            </p>

            {/* Two Action Buttons as requested in Section 5 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                id="hero-create-list-btn"
                onClick={onStartManual}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] text-white font-bold text-base shadow-lg shadow-[#2D6A4F]/25 hover:from-[#1B4332] hover:to-[#081C15] active:scale-98 transition-all group"
              >
                <ShoppingBag className="w-5 h-5 text-[#95D5B2] group-hover:scale-110 transition-transform" />
                <span>Create Grocery List</span>
                <ArrowRight className="w-4 h-4 text-[#95D5B2] ml-1 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-upload-image-btn"
                onClick={onStartUpload}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-white border-2 border-[#2D6A4F]/30 text-[#1B4332] font-bold text-base shadow-sm hover:border-[#2D6A4F] hover:bg-[#FAF7F2] active:scale-98 transition-all group"
              >
                <UploadCloud className="w-5 h-5 text-[#2D6A4F] group-hover:scale-110 transition-transform" />
                <span>Upload Grocery Image</span>
                <span className="text-[11px] uppercase tracking-wider bg-[#EAF5EE] text-[#1B4332] px-2 py-0.5 rounded-full font-bold">
                  AI OCR
                </span>
              </button>
            </div>

            {/* Value Props Row */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[#E8E2D9] max-w-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#40916C] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-stone-700">Any Item or Brand</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#40916C] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-stone-700">Handwritten OCR</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#40916C] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-stone-700">Excel Sync</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Nature-Inspired Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer organic frame */}
              <div className="relative rounded-3xl bg-gradient-to-br from-[#EAF5EE] via-[#FBF9F5] to-[#F3ECE1] p-6 border border-[#D8CFBF]/70 shadow-xl shadow-[#1B4332]/5">
                {/* Header card preview */}
                <div className="bg-white rounded-2xl p-5 border border-[#E8E2D9] shadow-xs mb-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold">
                        🌿
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1B4332]">Kanaki Fresh Basket</h4>
                        <p className="text-[11px] text-stone-500">Order Ref: KKS-2026-TODAY</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EAF5EE] text-[#1B4332]">
                      Organized
                    </span>
                  </div>

                  {/* Sample items checklist */}
                  <div className="space-y-2.5 pt-3 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF9F5] border border-stone-100">
                      <div className="flex items-center gap-2 font-medium text-stone-800">
                        <span className="text-base">🌾</span>
                        <span>Sona Masoori Rice (Aged)</span>
                      </div>
                      <span className="font-bold text-[#2D6A4F] bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                        5 kg
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF9F5] border border-stone-100">
                      <div className="flex items-center gap-2 font-medium text-stone-800">
                        <span className="text-base">🥛</span>
                        <span>Fresh Farm Cow Milk</span>
                      </div>
                      <span className="font-bold text-[#2D6A4F] bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                        3 litre
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF9F5] border border-stone-100">
                      <div className="flex items-center gap-2 font-medium text-stone-800">
                        <span className="text-base">🍅</span>
                        <span>Ripe Hybrid Tomatoes</span>
                      </div>
                      <span className="font-bold text-[#2D6A4F] bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                        2 kg
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF9F5] border border-stone-100">
                      <div className="flex items-center gap-2 font-medium text-stone-800">
                        <span className="text-base">🥣</span>
                        <span>Pure Cow Ghee (Organic)</span>
                      </div>
                      <span className="font-bold text-[#2D6A4F] bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                        500 g
                      </span>
                    </div>
                  </div>
                </div>

                {/* Micro feature badges */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-[#E8E2D9] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-[#2D6A4F]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">Gemini AI OCR</p>
                      <p className="text-[10px] text-stone-500">Reads messy handwriting</p>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-[#E8E2D9] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">Same-Day Pickup</p>
                      <p className="text-[10px] text-stone-500">Packaged with care</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Leaf badge */}
              <div className="absolute -bottom-4 -left-4 bg-[#1B4332] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-semibold">
                <Leaf className="w-4 h-4 text-[#74C69D]" />
                <span>100% Organically Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
