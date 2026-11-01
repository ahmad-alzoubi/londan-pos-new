import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Barcode, 
  Trash2, 
  Plus, 
  Minus, 
  Pause, 
  CreditCard, 
  Layers, 
  Sparkles, 
  ShoppingBag, 
  Tag, 
  UserCheck, 
  RotateCcw,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SizeColorModal } from '../components/pos/SizeColorModal';
import { CheckoutModal } from '../components/pos/CheckoutModal';
import { ThermalReceiptView } from '../components/pos/ThermalReceiptView';
import { soundFX } from '../utils/soundEffects';

export const POSView = () => {
  const { 
    products, 
    categories, 
    cart, 
    cartSubtotal, 
    cartTotal, 
    cartDiscount, 
    setCartDiscount, 
    updateCartQty, 
    removeFromCart, 
    clearCart, 
    holdOrder, 
    currency, 
    selectedCustomer, 
    setSelectedCustomer,
    showToast,
    addToCart
  } = useApp();

  // Search & Filter State
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');

  // Modals
  const [activeProductForVariant, setActiveProductForVariant] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState(null);

  const barcodeInputRef = useRef(null);

  // Keyboard Shortcuts (F1, F9, F12)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F1 -> Clear Cart
      if (e.key === 'F1') {
        e.preventDefault();
        clearCart();
        showToast('تم فتح فاتورة جديدة', 'info');
      }
      // F9 -> Hold Order
      if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0) holdOrder();
      }
      // F12 -> Checkout
      if (e.key === 'F12') {
        e.preventDefault();
        if (cart.length > 0) setIsCheckoutOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart]);

  // Barcode Scanner Form Submit
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const query = barcodeInput.trim();
    // Find product by barcode or SKU
    const matchedProduct = products.find(
      (p) => p.barcode === query || p.sku.toLowerCase() === query.toLowerCase()
    );

    if (matchedProduct) {
      // If it has multiple variants, open size modal, else add first available
      if (matchedProduct.variants && matchedProduct.variants.length > 1) {
        setActiveProductForVariant(matchedProduct);
      } else {
        const variant = matchedProduct.variants?.[0] || { size: 'Standard', color: 'افتراضي', stock: 10 };
        addToCart(matchedProduct, variant);
      }
      setBarcodeInput('');
    } else {
      soundFX.playError();
      showToast(`لم يتم العثور على صنف بالباركود: ${query}`, 'error');
      setBarcodeInput('');
    }
  };

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode?.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Left/Center Area: Catalog & Product Selection */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden border-l border-slate-200 dark:border-slate-800">
        {/* Search & Barcode Bar */}
        <div className="flex items-center gap-3 mb-3">
          {/* Barcode Quick Scan */}
          <form onSubmit={handleBarcodeSubmit} className="relative flex-1 max-w-sm">
            <Barcode className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder="امسح الباركود أو أدخل الكود ثم اضغط Enter..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </form>

          {/* Text Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو نوع القماش أو الموديل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>
        </div>

        {/* Clothing Categories Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0 mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-3">
            {filteredProducts.map((product) => {
              // Calculate total stock across all variants
              const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
              const isLowStock = totalStock > 0 && totalStock <= (product.minStockAlert || 5);
              const isOutOfStock = totalStock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => setActiveProductForVariant(product)}
                  className={`group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg hover:border-indigo-500/60 transition-all flex flex-col justify-between cursor-pointer select-none ${
                    isOutOfStock ? 'opacity-60' : 'active:scale-98'
                  }`}
                >
                  {/* Product Image */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}

                    {/* Category Tag */}
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                      {product.category}
                    </span>

                    {/* Stock Warning Badge */}
                    {isOutOfStock ? (
                      <span className="absolute bottom-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
                        نفد المخزون
                      </span>
                    ) : isLowStock ? (
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-xs">
                        متبقي {totalStock} قطع
                      </span>
                    ) : (
                      <span className="absolute bottom-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900/60 text-emerald-400 backdrop-blur-xs font-mono">
                        {totalStock} متوفر
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {product.variants?.length || 0} مقاسات وألوان
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400">
                        {product.price} <span className="text-[11px] font-sans font-bold">{currency.symbol}</span>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        اختر المقاس
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Area: POS Cart & Live Bill Panel */}
      <div className="w-full lg:w-96 bg-white dark:bg-slate-900 flex flex-col border-r border-slate-200 dark:border-slate-800 shadow-xl z-10 shrink-0">
        {/* Cart Top Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              سلة المبيعات الحالية
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {cart.reduce((s, i) => s + i.qty, 0)} قطع
            </span>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              title="تفريغ السلة (F1)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Customer Quick Info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-semibold">{selectedCustomer?.name || 'زبون نقدي عام'}</span>
          </div>
          {selectedCustomer?.balance > 0 && (
            <span className="text-rose-500 font-bold">
              دين سابق: {selectedCustomer.balance} {currency.symbol}
            </span>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingBag className="w-16 h-16 stroke-1 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">السلة فارغة</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                اختر صنفاً من الملابس أو امسح الباركود لبدء الفاتورة
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/50 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h5>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold">
                      {item.size}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {item.color}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-200 mt-1">
                    {(item.price * item.qty).toLocaleString()} {currency.symbol}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
                  <button
                    onClick={() => updateCartQty(item.cartItemId, item.qty - 1)}
                    className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 shadow-2xs cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-7 text-center font-mono font-black text-xs text-slate-900 dark:text-white">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateCartQty(item.cartItemId, item.qty + 1)}
                    className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bill Calculations & Action Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Discount input */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              خصم خاص:
            </span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                value={cartDiscount || ''}
                onChange={(e) => setCartDiscount(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-20 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white text-center"
              />
              <span className="text-xs text-slate-400 font-bold">{currency.symbol}</span>
            </div>
          </div>

          {/* Subtotal & Total */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>المجموع الفرعي:</span>
              <span className="font-mono font-semibold">{cartSubtotal.toLocaleString()} {currency.symbol}</span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-rose-500 font-bold">
                <span>الخصم المطبق:</span>
                <span className="font-mono">- {cartDiscount.toLocaleString()} {currency.symbol}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-black text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
              <span>صافي الفاتورة:</span>
              <span className="text-xl font-mono text-indigo-600 dark:text-indigo-400">
                {cartTotal.toLocaleString()} <span className="text-xs font-bold font-sans">{currency.symbol}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Hold & Pay */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              disabled={cart.length === 0}
              onClick={() => holdOrder()}
              className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-300 dark:border-amber-800/60 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>تعليق (F9)</span>
            </button>

            <button
              disabled={cart.length === 0}
              onClick={() => setIsCheckoutOpen(true)}
              className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-lg shadow-emerald-600/25 active:scale-98 transition-all disabled:opacity-40 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>دفع الفاتورة (F12)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SizeColorModal
        product={activeProductForVariant}
        isOpen={Boolean(activeProductForVariant)}
        onClose={() => setActiveProductForVariant(null)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onPrintReceipt={(inv) => setReceiptToPrint(inv)}
      />

      <ThermalReceiptView
        invoice={receiptToPrint}
        isOpen={Boolean(receiptToPrint)}
        onClose={() => setReceiptToPrint(null)}
      />
    </div>
  );
};
