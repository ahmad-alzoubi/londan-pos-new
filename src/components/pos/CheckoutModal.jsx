import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  Banknote, 
  Clock, 
  Layers, 
  User, 
  Receipt, 
  CheckCircle2, 
  Printer, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const CheckoutModal = ({ isOpen, onClose, onPrintReceipt }) => {
  const { 
    cartTotal, 
    currency, 
    customers, 
    selectedCustomer, 
    setSelectedCustomer, 
    completeCheckout,
    showToast 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('كاش');
  const [cashGiven, setCashGiven] = useState('');
  const [notes, setNotes] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [splitCash, setSplitCash] = useState('');
  const [splitCard, setSplitCard] = useState('');

  // Default cash given to exact total on open
  useEffect(() => {
    if (isOpen) {
      setCashGiven(cartTotal.toString());
      setSplitCash((cartTotal / 2).toString());
      setSplitCard((cartTotal / 2).toString());
    }
  }, [isOpen, cartTotal]);

  if (!isOpen) return null;

  const numCashGiven = parseFloat(cashGiven) || 0;
  const changeDue = Math.max(0, numCashGiven - cartTotal);

  // Quick cash buttons based on total
  const quickCashOptions = [
    cartTotal,
    Math.ceil(cartTotal / 50) * 50 || 50,
    Math.ceil(cartTotal / 100) * 100 || 100,
    500,
  ].filter((v, idx, arr) => arr.indexOf(v) === idx && v >= cartTotal);

  const handleCheckoutSubmit = (autoPrint = true) => {
    if (paymentMethod === 'كاش' && numCashGiven < cartTotal) {
      showToast('المبلغ المستلم أقل من إجمالي الفاتورة!', 'error');
      return;
    }

    const invoice = completeCheckout({
      paymentMethod,
      paidAmount: paymentMethod === 'كاش' ? numCashGiven : cartTotal,
      changeAmount: paymentMethod === 'كاش' ? changeDue : 0,
      notes,
    });

    if (invoice) {
      // Trigger festive celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {
        // Ignore confetti error if any
      }

      onClose();

      if (autoPrint) {
        setTimeout(() => {
          onPrintReceipt(invoice);
        }, 150);
      }
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    (c.phone && c.phone.includes(customerSearch))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>إتمام عملية البيع والدفع</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              حدد طريقة الدفع وأصدر الفاتورة للعميل فورياً
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Total Payable Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white flex items-center justify-between shadow-lg shadow-indigo-600/20">
            <div>
              <span className="text-xs font-medium text-indigo-200 block">المبلغ الإجمالي المطلوب</span>
              <span className="text-xs text-indigo-300">شامل كافة الخصومات</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black font-mono tracking-tight">
                {cartTotal.toLocaleString()}
              </span>
              <span className="text-sm font-bold mr-1.5">{currency.symbol}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              طريقة الدفع
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'كاش', label: 'نقداً (كاش)', icon: Banknote },
                { id: 'شبكة', label: 'مدى / بطاقة', icon: CreditCard },
                { id: 'آجل / ذمم', label: 'آجل (دين)', icon: Clock },
                { id: 'مجزأ', label: 'دفع مجزأ', icon: Layers },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Handling Details */}
          {paymentMethod === 'كاش' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  المبلغ المستلم من الزبون:
                </label>
                <div className="flex items-center gap-1.5">
                  {quickCashOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setCashGiven(opt.toString())}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-mono font-bold hover:border-indigo-500 cursor-pointer text-slate-700 dark:text-slate-200"
                    >
                      {opt} {currency.symbol}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  placeholder="أدخل المبلغ المستلم"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-lg font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Change Due Display */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  المبلغ المتبقي للعميل (الفكة / الباقي):
                </span>
                <span className={`text-xl font-black font-mono ${changeDue >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                  {changeDue.toLocaleString()} {currency.symbol}
                </span>
              </div>
            </div>
          )}

          {/* Customer Selection */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              تحديد العميل (اختياري)
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو رقم الجوال..."
                  value={selectedCustomer ? selectedCustomer.name : customerSearch}
                  onChange={(e) => {
                    setSelectedCustomer(null);
                    setCustomerSearch(e.target.value);
                    setIsCustomerDropdownOpen(true);
                  }}
                  onFocus={() => setIsCustomerDropdownOpen(true)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                {selectedCustomer && (
                  <button
                    onClick={() => {
                      setSelectedCustomer(null);
                      setCustomerSearch('');
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Customer Dropdown Results */}
            {isCustomerDropdownOpen && !selectedCustomer && (
              <div className="absolute top-full right-0 left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setIsCustomerDropdownOpen(false);
                      }}
                      className="w-full text-right px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{c.name}</span>
                      <span className="text-slate-400 font-mono">{c.phone}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-slate-400">
                    لا يوجد عميل بهذا الاسم
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              ملاحظات الفاتورة (تظهر أسفل الفاتورة)
            </label>
            <input
              type="text"
              placeholder="مثال: خصم خاص لعميل دائم، أو تم فحص المقاسات..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            رجوع للسلة
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCheckoutSubmit(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              حفظ بدون طباعة
            </button>

            <button
              onClick={() => handleCheckoutSubmit(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-lg shadow-emerald-600/25 active:scale-98 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>إتمام وطباعة الإيصال (F12)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
