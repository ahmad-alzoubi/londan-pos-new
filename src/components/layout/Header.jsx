import React from 'react';
import { 
  Store, 
  Moon, 
  Sun, 
  Cloud, 
  CloudOff, 
  PauseCircle, 
  PlusCircle, 
  Coins, 
  TrendingUp,
  RotateCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header = ({ onOpenSuspendedModal }) => {
  const { 
    theme, 
    toggleTheme, 
    currency, 
    cart, 
    clearCart, 
    suspendedOrders, 
    cashDrawer, 
    invoices, 
    isSyncing, 
    syncWithSupabase, 
    lastSyncTime,
    setActiveTab
  } = useApp();

  // Calculate today's sales
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = invoices
    .filter(inv => inv.status === 'paid' && inv.date?.startsWith(todayStr))
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between select-none sticky top-0 z-30 transition-colors shadow-xs">
      {/* Brand & Store Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-rose-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
              لندن للأزياء
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              LONDAN BOUTIQUE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            نظام الكاشير والمحاسبة الذكي
          </p>
        </div>
      </div>

      {/* Quick Status / Metrics Strip */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Today's Sales Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium">مبيعات اليوم:</span>
          <span className="text-sm font-bold font-mono">
            {todaySales.toLocaleString()} {currency.symbol}
          </span>
        </div>

        {/* Cash Drawer Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400">
          <Coins className="w-4 h-4" />
          <span className="text-xs font-medium">نقدية الصندوق:</span>
          <span className="text-sm font-bold font-mono">
            {((cashDrawer?.openingBalance || 0) + todaySales).toLocaleString()} {currency.symbol}
          </span>
        </div>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-2.5">
        {/* Suspended Orders Pill */}
        <button
          onClick={onOpenSuspendedModal}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            suspendedOrders.length > 0
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:bg-amber-500/25'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
          }`}
          title="الفواتير المعلقة"
        >
          <PauseCircle className="w-4 h-4" />
          <span className="hidden sm:inline">المعلقة</span>
          {suspendedOrders.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
              {suspendedOrders.length}
            </span>
          )}
        </button>

        {/* Cloud Sync Button */}
        <button
          onClick={syncWithSupabase}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-all"
          title={lastSyncTime ? `آخر مزامنة: ${new Date(lastSyncTime).toLocaleTimeString('ar-SA')}` : 'مزامنة سحابية مع Supabase'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-500' : ''}`} />
          <Cloud className="w-4 h-4 text-indigo-500" />
          <span className="hidden md:inline">سحابي</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs"
          title={theme === 'dark' ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الليلي'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-400 hidden sm:inline">نهاري</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="text-[11px] font-bold text-indigo-600 hidden sm:inline">ليلي</span>
            </>
          )}
        </button>

        {/* New Sale Button */}
        <button
          onClick={() => {
            clearCart();
            setActiveTab('pos');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-600/30 active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>فاتورة جديدة (F1)</span>
        </button>
      </div>
    </header>
  );
};
