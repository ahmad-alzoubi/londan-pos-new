import React, { useState } from 'react';
import { X, Check, Package, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SizeColorModal = ({ product, isOpen, onClose }) => {
  const { addToCart, currency } = useApp();
  const [selectedVariant, setSelectedVariant] = useState(null);

  if (!isOpen || !product) return null;

  const handleSelectAndAdd = (variant) => {
    if (variant.stock <= 0) return;
    addToCart(product, variant);
    onClose();
  };

  // Helper color map for visual circles
  const getColorHex = (colorName = '') => {
    const map = {
      'خمري': '#800020',
      'كحلي ديب': '#000080',
      'كحلي بريطاني': '#1e3a8a',
      'أبيض عاجي': '#fdfbf7',
      'أسود فحمي': '#18181b',
      'أسود ملكي': '#09090b',
      'أسود كلاسيك': '#171717',
      'بيج ناعم': '#e2d5c3',
      'رمادي حجري': '#78716c',
      'هافان / تان': '#a16207',
    };
    return map[colorName] || '#64748b';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-6 border-b border-slate-100 dark:border-slate-800 flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Package className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">
                {product.price} {currency.symbol}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                كود: {product.sku}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Size & Color Grid */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              اختر المقاس واللون المطلوب للإضافة للسلة
            </h4>
            <span className="text-xs text-slate-400">
              {product.variants?.length || 0} خيارات متوفرة
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {product.variants?.map((v, idx) => {
              const isOutOfStock = v.stock <= 0;
              const isSelected = selectedVariant === v;

              return (
                <button
                  key={`${v.size}-${v.color}-${idx}`}
                  disabled={isOutOfStock}
                  onClick={() => handleSelectAndAdd(v)}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'opacity-40 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                      : 'hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/10 active:scale-98 bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 shadow-xs"
                      style={{ backgroundColor: getColorHex(v.color) }}
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded text-xs">
                          {v.size}
                        </span>
                        <span>{v.color}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {isOutOfStock ? 'نفد من المخزن' : `المتوفر: ${v.stock} قطعة`}
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    +
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
