import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Printer, 
  RotateCcw, 
  Eye, 
  Calendar, 
  User, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  X,
  ArrowDownLeft,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThermalReceiptView } from '../components/pos/ThermalReceiptView';

export const InvoicesView = () => {
  const { invoices, currency, processReturnInvoice, deleteInvoice } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState(null);
  const [invoiceToPrint, setInvoiceToPrint] = useState(null);
  const [returnInvoiceModal, setReturnInvoiceModal] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [restockOnDelete, setRestockOnDelete] = useState(true);
  const [returnReason, setReturnReason] = useState('المقاس غير مناسب للزبون');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.paymentMethod?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'paid' && inv.status === 'paid') ||
      (statusFilter === 'returned' && inv.status === 'returned');

    return matchesSearch && matchesStatus;
  });

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!returnInvoiceModal) return;
    processReturnInvoice(returnInvoiceModal.id, returnReason);
    setReturnInvoiceModal(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              سجل فواتير المبيعات والمرتجع
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              {invoices.length} فواتير مسجلة
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إعادة طباعة الإيصالات، مراجعة الأرباح، ومعالجة المرتجعات واستعادة المخزون تلقائياً.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث برقم الفاتورة أو اسم العميل أو طريقة الدفع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'paid', label: 'مدفوعة' },
            { id: 'returned', label: 'مرتجعة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3.5 font-bold">رقم الفاتورة</th>
                <th className="p-3.5 font-bold">التاريخ والوقت</th>
                <th className="p-3.5 font-bold">العميل</th>
                <th className="p-3.5 font-bold">طريقة الدفع</th>
                <th className="p-3.5 font-bold">الأصناف</th>
                <th className="p-3.5 font-bold">الإجمالي</th>
                <th className="p-3.5 font-bold">الربح الصافي</th>
                <th className="p-3.5 font-bold">الحالة</th>
                <th className="p-3.5 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map((inv) => {
                const isReturned = inv.status === 'returned';

                return (
                  <tr
                    key={inv.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      isReturned ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''
                    }`}
                  >
                    <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {inv.id}
                    </td>

                    <td className="p-3.5 font-mono text-slate-500">
                      {new Date(inv.date).toLocaleDateString('ar-SA')} - {new Date(inv.date).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {inv.customerName || 'نقدي عام'}
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {inv.paymentMethod}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-slate-500">
                      {inv.items?.length || 0} قطع
                    </td>

                    <td className="p-3.5 font-mono font-black text-slate-900 dark:text-white">
                      {inv.total.toLocaleString()} {currency.symbol}
                    </td>

                    <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {isReturned ? '0' : `+${(inv.netProfit || 0).toLocaleString()}`} {currency.symbol}
                    </td>

                    <td className="p-3.5">
                      {isReturned ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                          <RotateCcw className="w-3 h-3" />
                          مرتجعة
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          مدفوعة
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Print Receipt */}
                        <button
                          onClick={() => setInvoiceToPrint(inv)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="طباعة إيصال الكاشير"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* View Details */}
                        <button
                          onClick={() => setSelectedInvoiceForDetail(inv)}
                          className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                          title="معاينة تفاصيل الفاتورة"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Return Invoice button */}
                        {!isReturned && (
                          <button
                            onClick={() => setReturnInvoiceModal(inv)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="إرجاع / استبدال الفاتورة"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Invoice button */}
                        <button
                          onClick={() => setInvoiceToDelete(inv)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="حذف الفاتورة نهائياً"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoiceForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-indigo-600" />
                  <span>تفاصيل الفاتورة {selectedInvoiceForDetail.id}</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(selectedInvoiceForDetail.date).toLocaleString('ar-SA')}
                </span>
              </div>
              <button
                onClick={() => setSelectedInvoiceForDetail(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div>
                  <span className="text-slate-400 block text-[11px]">العميل:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedInvoiceForDetail.customerName || 'نقدي عام'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">طريقة الدفع:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedInvoiceForDetail.paymentMethod}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">الكاشير:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedInvoiceForDetail.cashierName || 'كاشير المحل'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">صافي أرباح الفاتورة:</span>
                  <span className="font-bold font-mono text-emerald-600">
                    +{selectedInvoiceForDetail.netProfit} {currency.symbol}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">الأصناف المبيعة:</h4>
                <div className="space-y-2">
                  {selectedInvoiceForDetail.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.variant || `${item.size} / ${item.color}`} × {item.qty}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {(item.price * item.qty).toLocaleString()} {currency.symbol}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Totals */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono font-bold">
                    {(selectedInvoiceForDetail.subtotal || selectedInvoiceForDetail.total).toLocaleString()} {currency.symbol}
                  </span>
                </div>
                {selectedInvoiceForDetail.discount > 0 && (
                  <div className="flex justify-between text-rose-500 font-bold">
                    <span>الخصم الممنوح:</span>
                    <span className="font-mono">
                      - {selectedInvoiceForDetail.discount.toLocaleString()} {currency.symbol}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>الإجمالي الصافي:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {selectedInvoiceForDetail.total.toLocaleString()} {currency.symbol}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <button
                onClick={() => setSelectedInvoiceForDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  setInvoiceToPrint(selectedInvoiceForDetail);
                  setSelectedInvoiceForDetail(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الإيصال</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Invoice Modal */}
      {returnInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-rose-600 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>تأكيد استرجاع الفاتورة {returnInvoiceModal.id}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  سيتم إعادة جميع قطع الفاتورة للمخزون واسترجاع المبلغ للزبون
                </p>
              </div>
              <button
                onClick={() => setReturnInvoiceModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="p-5 space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
                <span className="font-bold block">مبلغ الاسترجاع المستحق:</span>
                <span className="text-lg font-black font-mono">
                  {returnInvoiceModal.total.toLocaleString()} {currency.symbol}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  سبب الاسترجاع أو الاستبدال:
                </label>
                <input
                  type="text"
                  required
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="مثال: مقاس غير مناسب، عيب في القماش، رغبة العميل..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReturnInvoiceModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25"
                >
                  تأكيد الإرجاع واستعادة المخزون
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Invoice Modal */}
      {invoiceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-rose-600 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span>تأكيد حذف الفاتورة نهائياً</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  رقم الفاتورة: {invoiceToDelete.id} • العميل: {invoiceToDelete.customerName || 'نقدي عام'}
                </p>
              </div>
              <button
                onClick={() => setInvoiceToDelete(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
                <span className="font-bold block">مبلغ الفاتورة المحذوفة:</span>
                <span className="text-lg font-black font-mono">
                  {invoiceToDelete.total.toLocaleString()} {currency.symbol}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  سيتم حذف هذه الفاتورة من السجلات وتحديث تقارير المبيعات والأرباح.
                </p>
              </div>

              {invoiceToDelete.status !== 'returned' && (
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={restockOnDelete}
                    onChange={(e) => setRestockOnDelete(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      استرجاع قطع الملابس للمخزون
                    </span>
                    <span className="text-[10px] text-slate-400">
                      إعادة المقاسات والكميات المبيعة إلى رصيد المستودع
                    </span>
                  </div>
                </label>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteInvoice(invoiceToDelete.id, restockOnDelete);
                    setInvoiceToDelete(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25 cursor-pointer"
                >
                  نعم، احذف الفاتورة الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thermal Receipt Print Modal */}
      <ThermalReceiptView
        invoice={invoiceToPrint}
        isOpen={Boolean(invoiceToPrint)}
        onClose={() => setInvoiceToPrint(null)}
      />
    </div>
  );
};
