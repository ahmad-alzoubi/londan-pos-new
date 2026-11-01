import React, { useState } from 'react';
import { Store, Lock, Mail, ArrowLeft, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginScreen = () => {
  const { login, adminCredentials } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      if (!res.success) {
        setErrorMsg(res.error);
        setIsLoading(false);
      }
    }, 200);
  };

  const handleQuickAdminLogin = () => {
    setEmail(adminCredentials.email);
    setPassword(adminCredentials.password);
    login(adminCredentials.email, adminCredentials.password);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden font-sans select-none" dir="rtl">
      {/* Decorative luxury orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-rose-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Store className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              بوتيك لندن للأزياء
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              LONDAN BOUTIQUE • نظام الكاشير والمحاسبة الذكي
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              البريد الإلكتروني أو اسم المستخدم
            </label>
            <div className="relative">
              <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                placeholder="admin@londan.com أو admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3 pr-10 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'جاري التحقق...' : 'تسجيل الدخول للنظام'}</span>
          </button>
        </form>

        {/* Demo Quick Login Box */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-center space-y-2">
          <div className="text-[11px] text-indigo-300 font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>بيانات حساب الإدارة الافتراضي</span>
          </div>

          <div className="text-[10px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <div>المستخدم: <strong className="text-indigo-400">{adminCredentials.email}</strong></div>
            <div>كلمة المرور: <strong className="text-emerald-400">{adminCredentials.password}</strong></div>
          </div>

          <button
            type="button"
            onClick={handleQuickAdminLogin}
            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-colors cursor-pointer"
          >
            ⚡ دخول تجريبي سريع بحساب الإدارة
          </button>
        </div>

        {/* Mehwar Branding */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-slate-500 text-[11px]">
          <img src="/mehwar-logo.svg" alt="شركة محور" className="w-4 h-4 rounded-md" />
          <span>تنفيذ وتطوير <strong>شركة محور</strong></span>
        </div>
      </div>
    </div>
  );
};
