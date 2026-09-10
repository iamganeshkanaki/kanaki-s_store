import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E8E2D9] shadow-2xl space-y-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF5EE] text-[#1B4332] mb-1">
            We Are Here To Help
          </span>
          <h3 className="text-2xl font-bold text-[#1B4332] font-display">
            Contact Kanaki's Store & Dairy
          </h3>
          <p className="text-xs text-stone-500">
            Inquire about fresh curd (dahi), malai, milk, paneer, taak, lassi, or any grocery staple availability and doorstep delivery.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-2 text-stone-700">
            <Phone className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>+91 8600476638 (Primary)</span>
          </div>
          <div className="flex items-center gap-2 text-stone-700">
            <Phone className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>+91 9373173377 (Alt)</span>
          </div>
          <div className="flex items-center gap-2 text-stone-700 col-span-2">
            <Mail className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>iamganeshkanaki@gmail.com</span>
          </div>
          <div className="flex items-start gap-2 text-stone-700 col-span-2">
            <MapPin className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
            <span>J-2 / 95 pragati chowk vidi gharkul solapur near sona chandi aprtment, Pincode 413005</span>
          </div>
          <div className="flex items-center gap-2 text-stone-700 col-span-2">
            <Clock className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>Open Every Day: 7:00 AM – 9:30 PM (Fresh morning & evening batches)</span>
          </div>
        </div>

        {sent ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Your message has been sent to our store desk. We will call you shortly!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ganesh Kanaki"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#2D6A4F]"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#2D6A4F]"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Message / Inquired Item
              </label>
              <textarea
                rows={2}
                required
                placeholder="Can I order organic brown basmati rice in 25kg bag?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#2D6A4F]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#2D6A4F] text-white font-bold text-xs hover:bg-[#1B4332] shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Store Inquiry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
