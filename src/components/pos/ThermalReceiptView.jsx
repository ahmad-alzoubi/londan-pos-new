import React from 'react';
import { Printer, X, Download, Share2, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ThermalReceiptView = ({ invoice, isOpen, onClose }) => {
  const { currency } = useApp();

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            معاينة إيصال الكاشير الحراري (80mm)
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Box */}
        <div className="p-4 overflow-y-auto bg-slate-100 dark:bg-slate-950 flex justify-center">
          <div
            id="thermal-receipt"
            className="w-[80mm] min-h-[110mm] bg-white text-black p-4 shadow-md font-mono text-[11px] leading-tight select-text"
            dir="rtl"
          >
            {/* Store Header */}
            <div className="text-center pb-3 border-b border-dashed border-black">
              <h2 className="text-sm font-black tracking-tight font-sans">
                بوتيك لندن للأزياء
              </h2>
              <p className="text-[10px] text-gray-700">LONDAN FASHION BOUTIQUE</p>
              <p className="text-[9px] text-gray-600 mt-1">الرياض - شارع العليا العام</p>
              <p className="text-[9px] text-gray-600">هاتف: +966 50 123 4567</p>
              <div className="mt-1.5 inline-block border border-black px-2 py-0.5 text-[9px] font-bold">
                فاتورة مبيعات ضريبية مبسطة
              </div>
            </div>

            {/* Invoice Info */}
            <div className="py-2.5 border-b border-dashed border-black space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>رقم الفاتورة:</span>
                <span className="font-bold">{invoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span>التاريخ والوقت:</span>
                <span>
                  {new Date(invoice.date).toLocaleDateString('ar-SA')} - {new Date(invoice.date).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>الكاشير:</span>
                <span>{invoice.cashierName || 'كاشير المحل'}</span>
              </div>
              <div className="flex justify-between">
                <span>العميل:</span>
                <span className="font-bold">{invoice.customerName || 'نقدي عام'}</span>
              </div>
              <div className="flex justify-between">
                <span>طريقة الدفع:</span>
                <span className="font-bold">{invoice.paymentMethod}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-2.5 border-b border-dashed border-black">
              <div className="flex justify-between font-bold pb-1 text-[10px] border-b border-gray-300">
                <span className="w-1/2">الصنف والمقاس</span>
                <span className="w-1/6 text-center">الكمية</span>
                <span className="w-1/3 text-left">المبلغ</span>
              </div>

              <div className="space-y-1.5 pt-1.5">
                {invoice.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-start text-[10px]">
                    <div className="w-1/2">
                      <div className="font-bold text-[10px] leading-tight">{item.name}</div>
                      <div className="text-[9px] text-gray-600">
                        {item.variant || `${item.size} - ${item.color}`}
                      </div>
                    </div>
                    <div className="w-1/6 text-center font-bold">{item.qty}</div>
                    <div className="w-1/3 text-left font-bold">
                      {(item.price * item.qty).toLocaleString()} {currency.symbol}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals & Calculations */}
            <div className="py-2 border-b border-dashed border-black space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span>{(invoice.subtotal || invoice.total).toLocaleString()} {currency.symbol}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-red-600 font-bold">
                  <span>الخصم الممنوح:</span>
                  <span>- {invoice.discount.toLocaleString()} {currency.symbol}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-black pt-1 border-t border-black">
                <span>الإجمالي الصافي:</span>
                <span>{invoice.total.toLocaleString()} {currency.symbol}</span>
              </div>
              {invoice.paidAmount > 0 && invoice.paymentMethod === 'كاش' && (
                <>
                  <div className="flex justify-between text-[10px] pt-1">
                    <span>المبلغ المدفوع:</span>
                    <span>{invoice.paidAmount.toLocaleString()} {currency.symbol}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>الباقي للعميل:</span>
                    <span>{(invoice.changeAmount || 0).toLocaleString()} {currency.symbol}</span>
                  </div>
                </>
              )}
            </div>

            {/* QR / Barcode Simulator */}
            <div className="py-3 text-center space-y-1">
              <div className="inline-block p-1 bg-white border border-black">
                {/* Simulated QR block */}
                <div className="w-20 h-20 bg-slate-900 mx-auto flex items-center justify-center text-white text-[8px] font-bold">
                  QR VERIFIED
                </div>
              </div>
              <p className="text-[8px] text-gray-500 font-sans">
                الاستبدال والاسترجاع خلال 3 أيام مع إحضار الفاتورة
              </p>
              <p className="text-[9px] font-bold font-sans mt-1">
                سعدنا بزيارتكم في بوتيك لندن!
              </p>
              <div className="pt-2 text-[8px] text-gray-500 font-sans flex items-center justify-center gap-1 border-t border-dotted border-gray-300 mt-2">
                <img src="./mehwar-logo.svg" alt="محور" className="w-2.5 h-2.5" />
                <span>برمجة وتطوير شركة محور</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            إغلاق
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الإيصال الحراري</span>
          </button>
        </div>
      </div>
    </div>
  );
};
