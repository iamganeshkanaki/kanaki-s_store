import React from 'react';
import { Sparkles, Plus, Check, Phone, Milk, ShieldCheck, Box, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DairyItem {
  id: string;
  name: string;
  marathiName?: string;
  description: string;
  unit: string;
  defaultQty: number;
  badge: string;
  icon: string;
}

const DAIRY_PRODUCTS: DairyItem[] = [
  {
    id: 'dairy-curd',
    name: 'Fresh Curd (Dahi)',
    marathiName: 'ताजे घट्ट दही',
    description: 'Thick, traditionally set creamy curd prepared fresh morning and evening without preservatives.',
    unit: 'kg',
    defaultQty: 1,
    badge: 'Best Seller',
    icon: '🥣',
  },
  {
    id: 'dairy-malai',
    name: 'Fresh Malai (Cream)',
    marathiName: 'शुद्ध साय / मलाई',
    description: 'Rich, natural thick top cream skimmed from pure whole milk. Ideal for cooking and sweets.',
    unit: 'g',
    defaultQty: 250,
    badge: 'Farm Fresh',
    icon: '🧈',
  },
  {
    id: 'dairy-milk',
    name: 'Pure Whole Milk',
    marathiName: 'ताजे दूध (गाय / म्हैस)',
    description: '100% pure, unadulterated fresh morning & evening milk delivered straight from local dairies.',
    unit: 'litre',
    defaultQty: 2,
    badge: 'Daily Essential',
    icon: '🥛',
  },
  {
    id: 'dairy-paneer',
    name: 'Fresh Soft Paneer',
    marathiName: 'मऊ फ्रेश पनीर',
    description: 'Extra soft, moist cottage cheese crafted daily. High protein, tender texture.',
    unit: 'g',
    defaultQty: 500,
    badge: 'Chef Favorite',
    icon: '🧀',
  },
  {
    id: 'dairy-taak',
    name: 'Spiced Taak (Buttermilk)',
    marathiName: 'मसाला ताक / मठ्ठा',
    description: 'Traditionally churned buttermilk tempered with roasted jeera, rock salt, ginger & fresh coriander.',
    unit: 'packet',
    defaultQty: 2,
    badge: 'Digestive & Cool',
    icon: '🍶',
  },
  {
    id: 'dairy-lassi',
    name: 'Rich Sweet Lassi',
    marathiName: 'शाही गोड लस्सी',
    description: 'Thick churned sweet lassi topped with fresh malai layer, cardamom, and gentle sweetness.',
    unit: 'glass / 500ml',
    defaultQty: 1,
    badge: 'Refreshing',
    icon: '🥤',
  },
];

interface DairySpecialtyBannerProps {
  onQuickAddItem: (item: { name: string; quantity: number; unit: string; notes: string }) => void;
  onOrderDairyNow: () => void;
  onView3D?: (model: 'paneer' | 'curd' | 'milk') => void;
}

export const DairySpecialtyBanner: React.FC<DairySpecialtyBannerProps> = ({
  onQuickAddItem,
  onOrderDairyNow,
  onView3D,
}) => {
  const [addedItem, setAddedItem] = React.useState<string | null>(null);

  const handleAdd = (item: DairyItem) => {
    onQuickAddItem({
      name: item.name,
      quantity: item.defaultQty,
      unit: item.unit.split(' ')[0],
      notes: `${item.marathiName || ''} - Fresh Daily Batch`,
    });
    setAddedItem(item.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1800);
  };

  return (
    <section className="py-14 bg-gradient-to-b from-[#F3ECE1]/60 via-[#FBF9F5] to-[#FBF9F5] border-y border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5EE] text-[#1B4332] text-xs font-bold mb-2">
              <Milk className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Kanaki Special Dairy & Curd Business • Solapur</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] font-display tracking-tight">
              Fresh Daily Curd, Malai & Pure Dairy 🥛
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl mt-1">
              We prepare and supply thick pot-set curd, fresh malai, pure farm milk, soft paneer, authentic spiced taak (buttermilk), and chilled lassi every single day.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {onView3D && (
              <button
                type="button"
                onClick={() => onView3D('paneer')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold transition-all shadow-xs shadow-amber-700/20 active:scale-95"
              >
                <Box className="w-3.5 h-3.5" />
                <span>360° 3D Paneer View</span>
              </button>
            )}
            <a
              href="tel:8600476638"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#2D6A4F]/30 text-xs font-bold text-[#1B4332] hover:bg-[#EAF5EE] transition-colors shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Order by Call</span>
            </a>
            <button
              onClick={onOrderDairyNow}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] transition-colors shadow-sm shadow-[#2D6A4F]/20"
            >
              <span>Build Full List</span>
            </button>
          </div>
        </div>

        {/* 6-Card Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DAIRY_PRODUCTS.map((prod, idx) => {
            const isJustAdded = addedItem === prod.id;
            return (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-5 border border-[#E8E2D9] shadow-xs hover:border-[#2D6A4F]/60 hover:shadow-lg transition-shadow flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 6 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      className="w-12 h-12 rounded-xl bg-[#FAF9F5] border border-stone-200/80 flex items-center justify-center text-2xl"
                    >
                      {prod.icon}
                    </motion.div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAF5EE] text-[#1B4332] border border-[#B7E4C7]/50">
                      {prod.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#1B4332] group-hover:text-[#2D6A4F] transition-colors">
                      {prod.name}
                    </h3>
                    {prod.marathiName && (
                      <p className="text-xs text-[#52B788] font-semibold">
                        {prod.marathiName}
                      </p>
                    )}
                    <p className="text-xs text-stone-600 leading-relaxed pt-1">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-stone-700 bg-[#FAF9F5] px-2.5 py-1 rounded-lg border border-stone-200">
                      Qty: {prod.defaultQty} {prod.unit}
                    </span>
                    {onView3D && (prod.id === 'dairy-paneer' || prod.id === 'dairy-curd' || prod.id === 'dairy-milk') && (
                      <button
                        type="button"
                        onClick={() =>
                          onView3D(
                            prod.id === 'dairy-paneer' ? 'paneer' : prod.id === 'dairy-curd' ? 'curd' : 'milk'
                          )
                        }
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-[11px] font-bold transition-colors cursor-pointer group/btn"
                        title="View 3D 360° interactive view"
                      >
                        <Box className="w-3 h-3 text-amber-700 group-hover/btn:rotate-12 transition-transform" />
                        <span>360° 3D</span>
                      </button>
                    )}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleAdd(prod)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#2D6A4F] text-white hover:bg-[#1B4332]'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isJustAdded ? (
                        <motion.span
                          key="added"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          className="flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Added!</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to List</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quality Assurance Strip */}
        <div className="p-4 rounded-2xl bg-[#1B4332] text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#95D5B2]" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#D8F3DC]">
                Pure Quality Guarantee • 100% Fresh Daily Batches
              </p>
              <p className="text-[#B7E4C7] text-[11px]">
                No starch, no chemical thickeners. Pure traditional dairy preparation from Solapur.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#B7E4C7] font-medium">
            <span>📍 J-2 / 95 Pragati Chowk, Vidi Gharkul, Solapur</span>
            <span>📞 8600476638 / 9373173377</span>
          </div>
        </div>
      </div>
    </section>
  );
};
