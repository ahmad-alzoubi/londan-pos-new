import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Receipt, 
  Coins, 
  AlertTriangle, 
  PlusCircle, 
  Users, 
  Shirt, 
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView = () => {
  const { 
    invoices, 
    products, 
    cashDrawer, 
    currency, 
    setActiveTab, 
    partners,
    partnerFinancialSummary 
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayInvoices = invoices.filter(
    (inv) => inv.status === 'paid' && inv.date?.startsWith(todayStr)
  );

  const todaySales = todayInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const todayNetProfit = todayInvoices.reduce((sum, inv) => sum + (inv.netProfit || 0), 0);

  // Products with low stock
  const lowStockProducts = products.filter((p) => {
    const totalStock = p.variants?.reduce((s, v) => s + v.stock, 0) || 0;
    return totalStock <= (p.minStockAlert || 5);
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="px-3 py-1 rounded-full bg-white/20 text-indigo-100 text-xs font-bold backdrop-blur-xs">
            لوحة القيادة الإدارية
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2">
            مرحباً بك في نظام بوتيك لندن للأزياء
          </h2>
          <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
            متابعة فورية للمبيعات، نقدية الصندوق، تنبيهات المقاسات والنواقص، وتوزيع أرباح الشركاء بدقة متناهية.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('pos')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-md hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>بدء عملية بيع جديدة (كاشير)</span>
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-950 text-white border border-indigo-400/30 font-bold text-xs transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>مراجعة أرباح الشركاء</span>
            </button>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">مبيعات اليوم</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {todaySales.toLocaleString()} <span className="text-xs font-sans font-bold">{currency.symbol}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{todayInvoices.length} فواتير بيع اليوم</p>
        </div>

        {/* Today's Net Profit */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">صافي أرباح اليوم</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            +{todayNetProfit.toLocaleString()} <span className="text-xs font-sans font-bold">{currency.symbol}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">بعد خصم تكاليف الشراء</p>
        </div>

        {/* Drawer Cash */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">نقدية درج الكاشير</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {((cashDrawer?.openingBalance || 0) + todaySales).toLocaleString()}{' '}
            <span className="text-xs font-sans font-bold">{currency.symbol}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">شامل رصيد الافتتاح</p>
        </div>

        {/* Low Stock Alert */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">تنبيهات نواقص المخزن</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            {lowStockProducts.length}{' '}
            <span className="text-xs font-sans font-bold">أصناف أوشكت</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">تحتاج توريد وإعادة طلب</p>
        </div>
      </div>

      {/* Split Section: Recent Invoices & Low Stock Alert List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                آخر فواتير المبيعات الصادرة
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('invoices')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              عرض الكل ({invoices.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {invoices.slice(0, 5).map((inv) => (
              <div
                key={inv.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      {inv.id}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {inv.customerName || 'نقدي عام'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                    {new Date(inv.date).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })} • {inv.paymentMethod} • {inv.items?.length || 0} قطع
                  </span>
                </div>

                <div className="text-left font-mono font-black text-sm text-slate-900 dark:text-white">
                  {inv.total.toLocaleString()} {currency.symbol}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock List (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  أصناف قاربت على النفاد
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('inventory')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                المخزن
              </button>
            </div>

            <div className="p-4 space-y-3">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  جميع أصناف الملابس متوفرة بكميات كافية 🎉
                </div>
              ) : (
                lowStockProducts.slice(0, 4).map((p) => {
                  const total = p.variants?.reduce((s, v) => s + v.stock, 0) || 0;
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">
                          {p.name}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          كود: {p.sku}
                        </span>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-rose-600 text-white font-mono font-black text-xs shadow-xs">
                        {total} قطع
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
