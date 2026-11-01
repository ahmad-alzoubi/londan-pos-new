import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  HandCoins, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Phone, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PieChart, 
  Wallet,
  FileSpreadsheet,
  X,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PartnersView = () => {
  const { 
    partners, 
    partnerWithdrawals, 
    partnerFinancialSummary, 
    addPartner, 
    recordPartnerWithdrawal, 
    currency,
    showToast 
  } = useApp();

  // Modals state
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [selectedPartnerForWithdrawal, setSelectedPartnerForWithdrawal] = useState(null);

  // Form states for new partner
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerRole, setNewPartnerRole] = useState('شريك مستثمر');
  const [newPartnerPhone, setNewPartnerPhone] = useState('');
  const [newPartnerShare, setNewPartnerShare] = useState('50');
  const [newPartnerCapital, setNewPartnerCapital] = useState('50000');

  // Form state for withdrawal
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalReason, setWithdrawalReason] = useState('سحوبات شخصية دورية');
  const [withdrawalMethod, setWithdrawalMethod] = useState('كاش');
  const [withdrawalDate, setWithdrawalDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle Add Partner Submit
  const handleAddPartnerSubmit = (e) => {
    e.preventDefault();
    if (!newPartnerName.trim()) {
      showToast('يرجى كتابة اسم الشريك', 'error');
      return;
    }

    // Check total shares
    const currentTotalShares = partners.reduce((sum, p) => sum + p.sharePercentage, 0);
    const addedShare = Number(newPartnerShare) || 0;
    if (currentTotalShares + addedShare > 100) {
      showToast(`مجموع نسب الشركاء سيتجاوز 100%! المتبقي متاح: ${100 - currentTotalShares}%`, 'error');
      return;
    }

    addPartner({
      name: newPartnerName.trim(),
      role: newPartnerRole,
      phone: newPartnerPhone.trim(),
      sharePercentage: addedShare,
      initialCapital: Number(newPartnerCapital) || 0,
    });

    setIsAddPartnerOpen(false);
    setNewPartnerName('');
    setNewPartnerPhone('');
  };

  // Handle Withdrawal Submit
  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    const amount = Number(withdrawalAmount);
    if (!amount || amount <= 0) {
      showToast('يرجى إدخال مبلغ سحب صحيح', 'error');
      return;
    }

    recordPartnerWithdrawal({
      partnerId: selectedPartnerForWithdrawal.id,
      partnerName: selectedPartnerForWithdrawal.name,
      amount,
      reason: withdrawalReason,
      paymentMethod: withdrawalMethod,
      date: withdrawalDate,
    });

    setSelectedPartnerForWithdrawal(null);
    setWithdrawalAmount('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              إدارة حقوق الشركاء والأرباح
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              توزيع أوتوماتيكي دقيق
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            متابعة رأس المال، نسب الشراكة، صافي الأرباح، والمسحوبات الشخصية لكل شريك.
          </p>
        </div>

        <button
          onClick={() => setIsAddPartnerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة شريك جديد</span>
        </button>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Business Profit */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">صافي أرباح المحل</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {partnerFinancialSummary.netBusinessProfit.toLocaleString()}
            <span className="text-xs font-sans font-bold mr-1">{currency.symbol}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">المبيعات - تكلفة البضاعة - المصروفات</p>
        </div>

        {/* Total Revenues */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">إجمالي مبيعات المتجر</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {partnerFinancialSummary.totalRevenue.toLocaleString()}
            <span className="text-xs font-sans font-bold mr-1">{currency.symbol}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">إجمالي الفواتير الصادرة</p>
        </div>

        {/* Total Cost of Goods Sold */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">تكلفة البضاعة المباعة</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-700 dark:text-slate-300">
            {partnerFinancialSummary.totalCOGS.toLocaleString()}
            <span className="text-xs font-sans font-bold mr-1">{currency.symbol}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">تكلفة الشراء الفعلية للقطع</p>
        </div>

        {/* Total Operating Expenses */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">المصروفات التشغيلية</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            {partnerFinancialSummary.totalExpenses.toLocaleString()}
            <span className="text-xs font-sans font-bold mr-1">{currency.symbol}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">الإيجار، الفواتير، والتغليف</p>
        </div>
      </div>

      {/* Partners Cards Section */}
      <div>
        <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" />
          <span>كشف حساب وحصص الشركاء</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partnerFinancialSummary.partners.map((partner) => {
            const hasSurplus = partner.netPayable >= 0;

            return (
              <div
                key={partner.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-colors"
              >
                {/* Header: Partner Name & Share % */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{partner.name}</span>
                      <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {partner.role || 'شريك'}
                      </span>
                    </h4>
                    {partner.phone && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-mono">
                        <Phone className="w-3 h-3" />
                        {partner.phone}
                      </p>
                    )}
                  </div>

                  <div className="text-left">
                    <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 font-mono font-black text-indigo-600 dark:text-indigo-300 text-sm">
                      {partner.sharePercentage}%
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">نسبة الشراكة</span>
                  </div>
                </div>

                {/* Progress bar of ownership */}
                <div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${partner.sharePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Financial Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">رأس المال:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {(partner.initialCapital || 0).toLocaleString()} {currency.symbol}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">نصيبه من الأرباح:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {partner.profitShare.toLocaleString()} {currency.symbol}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">إجمالي المسحوبات:</span>
                    <span className="font-mono font-bold text-rose-500">
                      {(partner.totalWithdrawals || 0).toLocaleString()} {currency.symbol}
                    </span>
                  </div>
                </div>

                {/* Net Payable Card */}
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  hasSurplus
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300'
                }`}>
                  <div>
                    <span className="text-xs font-bold block">
                      {hasSurplus ? 'صافي الأرباح المستحقة للشريك:' : 'تجاوز في المسحوبات (مدين):'}
                    </span>
                    <span className="text-[10px] opacity-80">
                      (الأرباح المستحقة - المسحوبات السابقة)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black font-mono">
                      {partner.netPayable.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold font-sans mr-1">{currency.symbol}</span>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => setSelectedPartnerForWithdrawal(partner)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <HandCoins className="w-3.5 h-3.5 text-amber-400" />
                    <span>تسجيل سحب جديد للشريك</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Partner Withdrawals Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HandCoins className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              سجل مسحوبات الشركاء
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              ({partnerWithdrawals.length} عمليات)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3.5 font-bold">رقم العملية</th>
                <th className="p-3.5 font-bold">اسم الشريك</th>
                <th className="p-3.5 font-bold">المبلغ المسحوب</th>
                <th className="p-3.5 font-bold">التاريخ</th>
                <th className="p-3.5 font-bold">طريقة الصرف</th>
                <th className="p-3.5 font-bold">البيان / السبب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {partnerWithdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400 font-bold">{w.id}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{w.partnerName}</td>
                  <td className="p-3.5 font-mono font-black text-rose-500 text-sm">
                    {w.amount.toLocaleString()} {currency.symbol}
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">{w.date}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-[11px]">
                      {w.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{w.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Partner Modal */}
      {isAddPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>إضافة شريك جديد للنظام</span>
              </h3>
              <button
                onClick={() => setIsAddPartnerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPartnerSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم الشريك الكامل *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: محمد سعيد العبدالله"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نسبة الشراكة % *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newPartnerShare}
                    onChange={(e) => setNewPartnerShare(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رأس المال المدفوع
                  </label>
                  <input
                    type="number"
                    value={newPartnerCapital}
                    onChange={(e) => setNewPartnerCapital(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الصفة أو الدور في المتجر
                </label>
                <input
                  type="text"
                  placeholder="مثال: شريك تنفيذي ومسؤول المشتريات"
                  value={newPartnerRole}
                  onChange={(e) => setNewPartnerRole(e.target.value)}
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
                  value={newPartnerPhone}
                  onChange={(e) => setNewPartnerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPartnerOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25"
                >
                  حفظ الشريك
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Partner Withdrawal Modal */}
      {selectedPartnerForWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <HandCoins className="w-4 h-4 text-amber-500" />
                  <span>تسجيل سحب أرباح لشريك</span>
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                  الشريك: {selectedPartnerForWithdrawal.name} ({selectedPartnerForWithdrawal.sharePercentage}%)
                </p>
              </div>
              <button
                onClick={() => setSelectedPartnerForWithdrawal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المبلغ المسحوب ({currency.symbol}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="0.00"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    طريقة الصرف
                  </label>
                  <select
                    value={withdrawalMethod}
                    onChange={(e) => setWithdrawalMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="كاش">كاش (نقدية الصندوق)</option>
                    <option value="تحويل بنكي">تحويل بنكي</option>
                    <option value="شيك">شيك مصرفي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تاريخ السحب
                  </label>
                  <input
                    type="date"
                    value={withdrawalDate}
                    onChange={(e) => setWithdrawalDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  سبب أو بيان السحب
                </label>
                <input
                  type="text"
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  placeholder="مثال: دفعة أرباح، سحب شخصي..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPartnerForWithdrawal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/25"
                >
                  تسجيل السحب الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
