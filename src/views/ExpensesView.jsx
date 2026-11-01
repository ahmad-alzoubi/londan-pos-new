import React, { useState } from 'react';
import { 
  WalletCards, 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Tag, 
  FileText,
  X 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ExpensesView = () => {
  const { expenses, addExpense, deleteExpense, currency, showToast } = useApp();

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('إيجار');
  const [amount, setAmount] = useState('');
  const [paidVia, setPaidVia] = useState('نقدية الصندوق');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      showToast('يرجى إدخال مبلغ صحيح', 'error');
      return;
    }
    if (!title.trim()) {
      showToast('يرجى إدخال بيان المصروف', 'error');
      return;
    }

    addExpense({
      title: title.trim(),
      category,
      amount: numAmount,
      paidVia,
      notes: notes.trim(),
      date,
    });

    setIsAddExpenseOpen(false);
    setTitle('');
    setAmount('');
    setNotes('');
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              المصروفات وسندات الصرف
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
              {expenses.length} سندات صرف
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تسجيل مصروفات الإيجار، الكهرباء، الرواتب، التغليف، وتأثيرها المباشر على أرباح الشركاء.
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>سند صرف جديد</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400">إجمالي المصروفات المسجلة</span>
          <div className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400 mt-0.5">
            {totalExpenses.toLocaleString()} <span className="text-sm font-sans font-bold">{currency.symbol}</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
          <WalletCards className="w-7 h-7" />
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3.5 font-bold">الرقم</th>
                <th className="p-3.5 font-bold">بيان المصروف</th>
                <th className="p-3.5 font-bold">الفئة</th>
                <th className="p-3.5 font-bold">المبلغ</th>
                <th className="p-3.5 font-bold">طريقة الدفع</th>
                <th className="p-3.5 font-bold">التاريخ</th>
                <th className="p-3.5 font-bold">ملاحظات</th>
                <th className="p-3.5 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400 font-bold">{exp.id}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{exp.title}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-black text-rose-500 text-sm">
                    {exp.amount.toLocaleString()} {currency.symbol}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{exp.paidVia}</td>
                  <td className="p-3.5 font-mono text-slate-500">{exp.date}</td>
                  <td className="p-3.5 text-slate-500">{exp.notes || '-'}</td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="حذف المصروف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <WalletCards className="w-4 h-4 text-rose-600" />
                <span>إصدار سند صرف / مصروف</span>
              </h3>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  بيان المصروف (العنوان) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فاتورة صيانة الإضاءة"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    المبلغ ({currency.symbol}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الفئة
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="إيجار">إيجار</option>
                    <option value="مرافق">كهرباء ومياه</option>
                    <option value="رواتب">رواتب ومكافآت</option>
                    <option value="مواد تغليف">أكياس وتغليف</option>
                    <option value="صيانة">صيانة ونظافة</option>
                    <option value="تسويق">إعلانات وتسويق</option>
                    <option value="أخرى">مصاريف أخرى</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    طريقة الدفع
                  </label>
                  <select
                    value={paidVia}
                    onChange={(e) => setPaidVia(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="نقدية الصندوق">نقدية الصندوق (كاش)</option>
                    <option value="تحويل بنكي">تحويل بنكي</option>
                    <option value="بطاقة شبكة">بطاقة شبكة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ملاحظات إضافية
                </label>
                <input
                  type="text"
                  placeholder="رقم السند اليدوي أو رقم الفاتورة..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25"
                >
                  حفظ السند
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
