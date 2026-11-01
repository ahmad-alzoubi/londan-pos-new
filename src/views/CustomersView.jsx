import React, { useState } from 'react';
import { 
  Contact2, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowDownLeft, 
  Clock, 
  DollarSign,
  X,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomersView = () => {
  const { customers, addCustomer, settleCustomerDebt, currency, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [selectedCustomerForSettle, setSelectedCustomerForSettle] = useState(null);

  // Form states
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [settleAmount, setSettleAmount] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCustName.trim()) {
      showToast('يرجى إدخال اسم العميل', 'error');
      return;
    }

    addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim() || '-',
      email: newCustEmail.trim() || '-',
    });

    setIsAddCustomerOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
  };

  const handleSettleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(settleAmount);
    if (!amount || amount <= 0) {
      showToast('يرجى إدخال مبلغ سداد صحيح', 'error');
      return;
    }

    settleCustomerDebt(selectedCustomerForSettle.id, amount);
    setSelectedCustomerForSettle(null);
    setSettleAmount('');
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery))
  );

  const totalDebts = customers.reduce((sum, c) => sum + (c.balance || 0), 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              العملاء والحسابات الآجلة (الديون)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              {customers.length} عملاء
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            متابعة ديون الزبائن، سجل المشتريات، وتسجيل دفعات السداد فورياً.
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة عميل جديد</span>
        </button>
      </div>

      {/* Debt Summary Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs font-medium text-amber-100">إجمالي الديون والذمم المستحقة على العملاء</span>
          <h3 className="text-2xl font-black font-mono mt-0.5">
            {totalDebts.toLocaleString()} {currency.symbol}
          </h3>
        </div>
        <div className="p-3 rounded-xl bg-white/20">
          <Clock className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم العميل أو رقم الجوال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3.5 font-bold">اسم العميل</th>
                <th className="p-3.5 font-bold">رقم الجوال</th>
                <th className="p-3.5 font-bold">إجمالي المشتريات</th>
                <th className="p-3.5 font-bold">عدد الطلبات</th>
                <th className="p-3.5 font-bold">الرصيد المدين (الدين)</th>
                <th className="p-3.5 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.map((c) => {
                const hasDebt = (c.balance || 0) > 0;

                return (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-500" />
                      <span>{c.name}</span>
                    </td>

                    <td className="p-3.5 font-mono text-slate-500">
                      {c.phone}
                    </td>

                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {(c.totalPurchases || 0).toLocaleString()} {currency.symbol}
                    </td>

                    <td className="p-3.5 font-mono text-slate-500">
                      {c.ordersCount || 0} فواتير
                    </td>

                    <td className="p-3.5">
                      <span className={`font-mono font-black text-sm ${
                        hasDebt ? 'text-rose-500' : 'text-emerald-500'
                      }`}>
                        {(c.balance || 0).toLocaleString()} {currency.symbol}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      {hasDebt && (
                        <button
                          onClick={() => {
                            setSelectedCustomerForSettle(c);
                            setSettleAmount(c.balance.toString());
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          تسديد دين
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                إضافة عميل جديد
              </h3>
              <button
                onClick={() => setIsAddCustomerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم العميل *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ريم الشريف"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  placeholder="05xxxxxxxx"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25"
                >
                  حفظ العميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settle Debt Modal */}
      {selectedCustomerForSettle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تسديد دين / استلام دفعة</span>
                </h3>
                <span className="text-xs text-slate-400">
                  العميل: {selectedCustomerForSettle.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedCustomerForSettle(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSettleSubmit} className="p-5 space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs">
                <span className="text-slate-500 dark:text-slate-400 block">إجمالي الدين المستحق حالياً:</span>
                <span className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
                  {selectedCustomerForSettle.balance.toLocaleString()} {currency.symbol}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المبلغ المسدد الآن ({currency.symbol}) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedCustomerForSettle.balance}
                  required
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustomerForSettle(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25"
                >
                  تسجيل السداد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
