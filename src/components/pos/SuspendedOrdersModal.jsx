import React from 'react';
import { X, Play, Trash2, Clock, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SuspendedOrdersModal = ({ isOpen, onClose }) => {
  const { suspendedOrders, restoreOrder, deleteSuspendedOrder, currency } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              الفواتير المعلقة في المحل
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              {suspendedOrders.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          {suspendedOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm">لا توجد أي فواتير معلقة حالياً</p>
            </div>
          ) : (
            suspendedOrders.map((order) => {
              const totalAmount = order.items.reduce((s, i) => s + i.price * i.qty, 0) - (order.discount || 0);

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                        {order.id}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {order.note || 'فاتورة معلقة'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{order.items.length} أصناف</span>
                      <span>•</span>
                      <span>
                        {new Date(order.date).toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      الإجمالي: {totalAmount.toLocaleString()} {currency.symbol}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        restoreOrder(order.id);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>استرجاع</span>
                    </button>

                    <button
                      onClick={() => deleteSuspendedOrder(order.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
