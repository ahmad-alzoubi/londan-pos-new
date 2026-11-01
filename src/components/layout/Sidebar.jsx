import React from 'react';
import {
  ShoppingBag,
  LayoutDashboard,
  Receipt,
  Shirt,
  Handshake,
  BarChart3,
  Contact2,
  WalletCards,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const { activeTab, setActiveTab, cart, invoices, suspendedOrders } = useApp();

  const NAV_ITEMS = [
    {
      id: 'pos',
      label: 'نقطة البيع (الكاشير)',
      icon: ShoppingBag,
      badge: cart.length > 0 ? cart.length : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'dashboard',
      label: 'نظرة عامة',
      icon: LayoutDashboard,
    },
    {
      id: 'invoices',
      label: 'الفواتير والمبيعات',
      icon: Receipt,
      badge: invoices.length > 0 ? invoices.length : null,
      badgeColor: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    },
    {
      id: 'inventory',
      label: 'المخزون والأزياء',
      icon: Shirt,
    },
    {
      id: 'partners',
      label: 'حقوق الشركاء والأرباح',
      icon: Handshake,
      highlight: true,
    },
    {
      id: 'analytics',
      label: 'التحليلات المالية',
      icon: BarChart3,
    },
    {
      id: 'customers',
      label: 'العملاء والديون',
      icon: Contact2,
    },
    {
      id: 'expenses',
      label: 'المصروفات والسندات',
      icon: WalletCards,
    },
    {
      id: 'settings',
      label: 'إعدادات النظام',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between select-none shrink-0 transition-colors">
      {/* Navigation Links */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          القوائم والعمليات
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25'
                  : item.highlight
                  ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Boutique Status Card & Mehwar Execution Badge */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-rose-500/5 to-amber-500/10 border border-indigo-200/60 dark:border-indigo-900/40">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>متجر لندن للأزياء</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            محاسبة متكاملة، توزيع أرباح الشركاء، وكاشير سريع للملابس.
          </p>
        </div>

        {/* Mehwar Company Signature */}
        <div className="flex items-center justify-center gap-2 py-1.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:border-emerald-500/40 transition-colors">
          <img src="./mehwar-logo.svg" alt="شركة محور" className="w-4 h-4 rounded-md shadow-2xs shrink-0" />
          <span className="text-[11px]">
            تنفيذ وتطوير <strong className="text-slate-700 dark:text-slate-200 font-bold">شركة محور</strong>
          </span>
        </div>
      </div>
    </aside>
  );
};
