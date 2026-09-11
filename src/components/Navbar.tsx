import React, { useState } from 'react';
import { Sprout, ShoppingBag, Search, MessageSquareHeart, PhoneCall, ShieldCheck, Menu, X, Leaf, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentTab: 'home' | 'create' | 'orders' | 'feedback' | 'admin' | '3d-dairy';
  onNavigate: (tab: 'home' | 'create' | 'orders' | 'feedback' | 'admin' | '3d-dairy') => void;
  onOpenContact: () => void;
  onJumpToVegetables?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenContact, onJumpToVegetables }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'create' | 'orders' | 'feedback' | 'admin' | '3d-dairy') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  const navItems: { id: 'home' | '3d-dairy' | 'create' | 'orders' | 'feedback'; label: string; isSpecial?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: '3d-dairy', label: '360° 3D Dairy', isSpecial: true },
    { id: 'create', label: 'Create Grocery List' },
    { id: 'orders', label: 'My Orders' },
    { id: 'feedback', label: 'Feedback' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E8E2D9] transition-all">
      {/* Nature notice ribbon */}
      <div className="bg-[#1B4332] text-[#D8F3DC] text-xs py-1.5 px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52B788] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52B788]"></span>
            </span>
            <Leaf className="w-3.5 h-3.5 text-[#52B788]" />
            <span>Fresh groceries & daily fresh curd, malai, milk, paneer, taak & lassi • Solapur (413005)</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#B7E4C7]">
            <span>📞 Call / WhatsApp: +91 8600476638 / 9373173377</span>
            <span className="w-1 h-1 rounded-full bg-[#52B788]"></span>
            <span>7:00 AM – 9:30 PM</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <motion.div
            onClick={() => handleNavClick('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="store-logo-header"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] flex items-center justify-center text-white shadow-sm shadow-[#2D6A4F]/20 group-hover:shadow-md transition-shadow duration-200">
              <Sprout className="w-6 h-6 text-[#95D5B2] transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1B4332] font-display">
                  KANAKI'S STORE
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#40916C]"></span>
              </div>
              <p className="text-xs text-[#52B788] font-medium tracking-wide">
                Your Everyday Grocery Partner
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#1B4332]'
                      : item.isSpecial
                      ? 'text-amber-800 hover:text-amber-900 hover:bg-amber-50'
                      : 'text-stone-700 hover:text-[#1B4332] hover:bg-[#F3EFEA]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navActivePill"
                      className="absolute inset-0 bg-[#EAF5EE] rounded-xl border border-[#D8F3DC] -z-10 shadow-2xs"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  {item.isSpecial && <Box className="w-3.5 h-3.5 text-amber-600" />}
                  <span>{item.label}</span>
                  {item.isSpecial && !isActive && (
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">
                      3D
                    </span>
                  )}
                </button>
              );
            })}

            {onJumpToVegetables && (
              <button
                id="nav-veggies-btn"
                onClick={onJumpToVegetables}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-[#1B4332] hover:bg-[#EAF5EE] transition-colors duration-150 flex items-center gap-1.5"
                title="Daily Solapur Vegetables & Health Importance"
              >
                <Leaf className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Fresh Veggies</span>
              </button>
            )}

            <button
              id="nav-contact-btn"
              onClick={onOpenContact}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:text-[#1B4332] hover:bg-[#F3EFEA] transition-colors duration-150"
            >
              Contact
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="admin-portal-header-btn"
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                currentTab === 'admin'
                  ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                  : 'border-[#D8CFBF] text-stone-700 hover:bg-[#F0EBE1] hover:text-[#1B4332]'
              }`}
              title="Store Owner & Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-[#40916C]" />
              <span>Admin Portal</span>
            </button>

            <button
              id="header-create-cta-btn"
              onClick={() => handleNavClick('create')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] text-white font-semibold text-sm shadow-md shadow-[#2D6A4F]/25 hover:from-[#1B4332] hover:to-[#081C15] active:scale-98 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-[#74C69D]" />
              <span>Create Grocery List</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-[#D8CFBF] text-stone-700 hover:bg-[#F0EBE1] focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#FAF7F2] border-b border-[#E8E2D9] px-4 pt-3 pb-5 space-y-2"
          >
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold ${
                currentTab === 'home' ? 'bg-[#EAF5EE] text-[#1B4332]' : 'text-stone-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('3d-dairy')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold flex items-center justify-between ${
                currentTab === '3d-dairy'
                  ? 'bg-amber-100 text-amber-950 font-bold'
                  : 'text-stone-700 hover:bg-amber-50/70'
              }`}
            >
              <span className="flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-600" />
                <span>360° 3D Dairy (Paneer & Curd)</span>
              </span>
              <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                Interactive
              </span>
            </button>
            {onJumpToVegetables && (
              <button
                onClick={() => {
                  onJumpToVegetables();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold text-stone-700 hover:bg-[#EAF5EE] flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#2D6A4F]" />
                  <span>Fresh Daily Vegetables</span>
                </span>
                <span className="text-[10px] bg-[#EAF5EE] text-[#1B4332] px-2 py-0.5 rounded-full font-bold border border-[#B7E4C7]">
                  Health Info
                </span>
              </button>
            )}
            <button
              onClick={() => handleNavClick('create')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold ${
                currentTab === 'create' ? 'bg-[#EAF5EE] text-[#1B4332]' : 'text-stone-700'
              }`}
            >
              Create Grocery List
            </button>
            <button
              onClick={() => handleNavClick('orders')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold ${
                currentTab === 'orders' ? 'bg-[#EAF5EE] text-[#1B4332]' : 'text-stone-700'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => handleNavClick('feedback')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold ${
                currentTab === 'feedback' ? 'bg-[#EAF5EE] text-[#1B4332]' : 'text-stone-700'
              }`}
            >
              Feedback
            </button>
            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold text-stone-700"
            >
              Contact Store
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold flex items-center justify-between ${
                currentTab === 'admin' ? 'bg-[#2D6A4F] text-white' : 'text-stone-700 border border-[#D8CFBF]'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#40916C]" />
                Store Admin Portal
              </span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Owner</span>
            </button>
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('create')}
                className="w-full py-3 rounded-xl bg-[#2D6A4F] text-white font-bold text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-5 h-5 text-[#95D5B2]" />
                <span>Start Grocery List</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
