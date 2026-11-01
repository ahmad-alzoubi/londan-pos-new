import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  Printer, 
  Download, 
  Upload, 
  Cloud, 
  RefreshCw, 
  Volume2, 
  Check, 
  Sliders, 
  Database,
  ShieldCheck,
  RotateCcw,
  Sun,
  Moon,
  Lock,
  Key,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_PRODUCTS, INITIAL_PARTNERS, INITIAL_INVOICES, INITIAL_CUSTOMERS, INITIAL_EXPENSES } from '../data/initialClothingData';

export const SettingsView = () => {
  const { 
    currentUser,
    adminCredentials,
    updateAdminCredentials,
    theme,
    toggleTheme,
    currency, 
    setCurrency, 
    showToast, 
    syncWithSupabase, 
    isSyncing, 
    lastSyncTime,
    setProducts,
    setPartners,
    setInvoices,
    setCustomers,
    setExpenses,
    products,
    partners,
    invoices,
    customers,
    expenses
  } = useApp();

  // Admin Security Form
  const [adminName, setAdminName] = useState(adminCredentials?.name || 'مدير النظام');
  const [adminEmail, setAdminEmail] = useState(adminCredentials?.email || 'admin@londan.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');

  const handleUpdateAdmin = (e) => {
    e.preventDefault();
    if (adminPassword && adminPassword !== adminConfirmPassword) {
      showToast('كلمتا المرور غير متطابقتين!', 'error');
      return;
    }
    updateAdminCredentials(
      adminEmail,
      adminPassword || adminCredentials.password,
      adminName
    );
    setAdminPassword('');
    setAdminConfirmPassword('');
  };

  const [storeName, setStoreName] = useState('بوتيك لندن للأزياء');
  const [storePhone, setStorePhone] = useState('+966 50 123 4567');
  const [storeAddress, setStoreAddress] = useState('الرياض - شارع العليا العام');
  const [taxNumber, setTaxNumber] = useState('300123456700003');
  const [receiptWidth, setReceiptWidth] = useState('80mm');

  // Currency form
  const [currSymbol, setCurrSymbol] = useState(currency.symbol);
  const [currCode, setCurrCode] = useState(currency.code);

  const handleSaveStoreInfo = (e) => {
    e.preventDefault();
    setCurrency({
      ...currency,
      symbol: currSymbol,
      code: currCode,
    });
    showToast('تم حفظ إعدادات المتجر بنجاح', 'success');
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      storeName,
      storePhone,
      storeAddress,
      taxNumber,
      currency,
      products,
      partners,
      invoices,
      customers,
      expenses,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `londan_pos_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('تم تصدير ملف النسخة الاحتياطية بنجاح 💾', 'success');
  };

  // Import JSON Backup
  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.products) setProducts(imported.products);
        if (imported.partners) setPartners(imported.partners);
        if (imported.invoices) setInvoices(imported.invoices);
        if (imported.customers) setCustomers(imported.customers);
        if (imported.expenses) setExpenses(imported.expenses);
        if (imported.currency) setCurrency(imported.currency);

        showToast('تم استعادة البيانات من النسخة الاحتياطية بنجاح!', 'success');
      } catch (err) {
        showToast('فشل قراءة ملف النسخة الاحتياطية', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Reset to Demo Factory State
  const handleResetFactory = () => {
    if (confirm('هل أنت متأكد من استعادة بيانات البوتيك الافتراضية؟ سيتم مسح التعديلات المحلية.')) {
      setProducts(INITIAL_PRODUCTS);
      setPartners(INITIAL_PARTNERS);
      setInvoices(INITIAL_INVOICES);
      setCustomers(INITIAL_CUSTOMERS);
      setExpenses(INITIAL_EXPENSES);
      showToast('تمت استعادة البيانات الافتراضية بنجاح', 'info');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>إعدادات النظام والمتجر</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          تخصيص بيانات المتجر، العملة، مظهر النظام، والمزامنة السحابية.
        </p>
      </div>

      {/* Theme Appearance Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>مظهر الواجهة (المظهر الداكن / الفاتح)</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              if (theme !== 'dark') toggleTheme();
            }}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-950/50'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400">
              <Moon className="w-5 h-5" />
            </div>
            <div className="text-right">
              <div className="font-bold text-xs">الوضع الليلي (Dark)</div>
              <div className="text-[10px] text-slate-400">مريح للعين أثناء العمل الطويل</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (theme !== 'light') toggleTheme();
            }}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-amber-50/80 border-amber-500 text-slate-900 shadow-md shadow-amber-500/10'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600">
              <Sun className="w-5 h-5" />
            </div>
            <div className="text-right">
              <div className="font-bold text-xs">الوضع الفاتح (Light)</div>
              <div className="text-[10px] text-slate-400">إضاءة عالية وتباين ناصع</div>
            </div>
          </button>
        </div>
      </div>

      {/* Admin Account & Security Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>حساب وأمان إدارة النظام (Admin Credentials)</span>
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            صلاحية المدير العام
          </span>
        </div>

        <form onSubmit={handleUpdateAdmin} className="space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">البريد / المستخدم الحالي:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">{adminCredentials.email}</span>
            </div>
            <div className="text-left">
              <span className="text-slate-400 block text-[10px]">كلمة المرور الحالية:</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{adminCredentials.password}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم المدير المعروض
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                البريد الإلكتروني / اسم المستخدم الجديد
              </label>
              <input
                type="text"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                كلمة المرور الجديدة (اتركها فارغة للإبقاء على الحالية)
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminConfirmPassword}
                onChange={(e) => setAdminConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>تحديث وحفظ بيانات الدخول</span>
            </button>
          </div>
        </form>
      </div>

      {/* Store Identity & Currency Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Store className="w-4 h-4 text-indigo-500" />
          <span>هوية المتجر والفواتير</span>
        </h3>

        <form onSubmit={handleSaveStoreInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم البوتيك / المتجر
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                رقم التواصل / الجوال
              </label>
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                عنوان المتجر (يظهر بالفاتورة)
              </label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الرقم الضريبي (إن وجد)
              </label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                رمز العملة (مثل: ر.س، د.أ، $)
              </label>
              <input
                type="text"
                value={currSymbol}
                onChange={(e) => setCurrSymbol(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                كود العملة (ISO)
              </label>
              <input
                type="text"
                value={currCode}
                onChange={(e) => setCurrCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-center"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>

      {/* Cloud Sync & Supabase */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Cloud className="w-4 h-4 text-indigo-500" />
          <span>المزامنة السحابية (Supabase)</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                الاتصال السحابي بقاعدة بيانات Supabase جاهز
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {lastSyncTime
                ? `آخر مزامنة ناجحة: ${new Date(lastSyncTime).toLocaleString('ar-SA')}`
                : 'يتم حفظ كافة البيانات محلياً مع إمكانية المزامنة السحابية المركزية بلمسة واحدة.'}
            </p>
          </div>

          <button
            onClick={syncWithSupabase}
            disabled={isSyncing}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>مزامنة سحابية الآن</span>
          </button>
        </div>
      </div>

      {/* Backup & Restore Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Database className="w-4 h-4 text-emerald-500" />
          <span>النسخ الاحتياطي والأمان (Backup & Restore)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportBackup}
            className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-slate-800 dark:text-slate-200 transition-all cursor-pointer text-xs font-bold"
          >
            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>تصدير نسخة احتياطية كاملة (JSON)</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-slate-800 dark:text-slate-200 transition-all cursor-pointer text-xs font-bold">
            <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>استيراد واستعادة من ملف نسخة</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            استعادة بيانات البوتيك الأصلية والمحاكاة
          </span>
          <button
            onClick={handleResetFactory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة البيانات الافتراضية</span>
          </button>
        </div>
      </div>

      {/* Mehwar Company Official Footer Signature */}
      <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/mehwar-logo.svg" alt="شركة محور" className="w-8 h-8 rounded-xl shadow-xs shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              تنفيذ وتطوير شركة محور (Mehwar)
            </div>
            <div className="text-[11px] text-slate-500">
              أنظمة سحابية، كاشير متطور، وحلول محاسبية احترافية لمتاجر الأزياء.
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          إصدار مرخص وموثق v1.0
        </span>
      </div>
    </div>
  );
};
