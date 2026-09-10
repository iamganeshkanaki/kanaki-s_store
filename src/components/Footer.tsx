import React from 'react';
import { Sprout, Phone, Mail, MapPin, Clock, Heart, Download, ShieldCheck, Leaf } from 'lucide-react';
import { api } from '../services/api';

interface FooterProps {
  onNavigate: (tab: 'home' | 'create' | 'orders' | 'feedback' | 'admin') => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContact }) => {
  return (
    <footer className="bg-[#1B4332] text-white pt-16 pb-12 border-t border-[#2D6A4F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#2D6A4F]/60">
          {/* Brand Column (lg: 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2D6A4F] flex items-center justify-center text-white shadow-xs">
                <Sprout className="w-6 h-6 text-[#95D5B2]" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight font-display text-white">
                  KANAKI'S STORE
                </h3>
                <p className="text-xs text-[#95D5B2] font-semibold">
                  "Your Everyday Grocery Partner"
                </p>
              </div>
            </div>

            <p className="text-sm text-[#D8F3DC]/80 leading-relaxed max-w-sm">
              Fresh daily curd (dahi), rich malai, pure milk, soft paneer, authentic taak (buttermilk), sweet lassi, and daily grocery staples.
              Type your list or upload a handwritten note — delivered fresh across Solapur.
            </p>

            <div className="pt-2">
              <a
                href={api.getExcelDownloadUrl('all')}
                download="kanakis_store_orders.xlsx"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-xs font-bold text-[#D8F3DC] hover:bg-[#40916C] hover:text-white transition-colors border border-[#52B788]/30 shadow-xs"
              >
                <Download className="w-4 h-4 text-[#95D5B2]" />
                <span>Export Master Orders (.xlsx)</span>
              </a>
            </div>
          </div>

          {/* Quick Links Column (lg: 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#95D5B2]">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#D8F3DC]/90">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('create')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Create Grocery List</span>
                  <span className="text-[10px] bg-[#2D6A4F] text-[#D8F3DC] px-1.5 py-0.2 rounded-sm font-semibold">
                    New
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('orders')}
                  className="hover:text-white transition-colors"
                >
                  My Orders & Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('feedback')}
                  className="hover:text-white transition-colors"
                >
                  Customer Feedback Form
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors"
                >
                  Contact Store
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-amber-200"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Store Owner Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours Column (lg: 4) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#95D5B2]">
              Store Location & Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D8F3DC]/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#74C69D] shrink-0 mt-0.5" />
                <span>J-2 / 95 pragati chowk vidi gharkul solapur near sona chandi aprtment, Pincode 413005</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#74C69D] shrink-0" />
                <span>+91 8600476638 (Primary) / +91 9373173377 (Alt)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#74C69D] shrink-0" />
                <span>iamganeshkanaki@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#74C69D] shrink-0" />
                <span>Monday – Sunday: 7:00 AM – 9:30 PM (Fresh morning & evening curd batches)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Developer Credit (Section 16 & 25) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8F3DC]/70">
          <p>© {new Date().getFullYear()} KANAKI'S STORE. All rights reserved.</p>

          <div className="flex items-center gap-1.5 font-medium text-[#D8F3DC]">
            <span>Developed with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>by</span>
            <strong className="text-white font-bold bg-[#2D6A4F] px-2 py-0.5 rounded-lg border border-[#52B788]/40">
              Ganesh Kanaki
            </strong>
          </div>
        </div>
      </div>
    </footer>
  );
};
