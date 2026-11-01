import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PieChart as PieIcon, 
  CreditCard, 
  Shirt, 
  Award, 
  Calendar, 
  ArrowUpRight,
  Wallet,
  Sparkles,
  ShoppingBag,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';

const PIE_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export const AnalyticsView = () => {
  const { invoices, expenses, products, currency } = useApp();
  const [period, setPeriod] = useState('all'); // 'today', 'week', 'month', 'all'

  // Filter invoices by period
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (inv.status !== 'paid') return false;
      const invDate = new Date(inv.date);
      const now = new Date();

      if (period === 'today') {
        return invDate.toDateString() === now.toDateString();
      }
      if (period === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return invDate >= oneWeekAgo;
      }
      if (period === 'month') {
        return (
          invDate.getMonth() === now.getMonth() &&
          invDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  }, [invoices, period]);

  // Financial calculations
  const totalSales = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalCost = filteredInvoices.reduce((sum, inv) => sum + (inv.costTotal || 0), 0);
  const grossProfit = totalSales - totalCost;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = grossProfit - totalExpenses;
  const profitMarginPercent = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0;
  const avgOrderValue = filteredInvoices.length > 0 ? (totalSales / filteredInvoices.length).toFixed(0) : 0;

  // Timeline / Daily Trend Data
  const trendData = useMemo(() => {
    const daysMap = {};
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('ar-SA', { weekday: 'short' });
      daysMap[key] = { day: dayName, date: key, sales: 0, profit: 0, count: 0 };
      last7Days.push(key);
    }

    filteredInvoices.forEach((inv) => {
      const key = inv.date?.split('T')[0];
      if (daysMap[key]) {
        daysMap[key].sales += inv.total;
        daysMap[key].profit += inv.netProfit || 0;
        daysMap[key].count += 1;
      }
    });

    return last7Days.map((k) => daysMap[k]);
  }, [filteredInvoices]);

  // Category Breakdown Data
  const categoryChartData = useMemo(() => {
    const catMap = {};
    filteredInvoices.forEach((inv) => {
      inv.items?.forEach((item) => {
        const prod = products.find((p) => p.id === item.id);
        const cat = prod?.category || 'أزياء عامة';
        if (!catMap[cat]) catMap[cat] = { category: cat, revenue: 0, itemsCount: 0 };
        catMap[cat].revenue += item.price * item.qty;
        catMap[cat].itemsCount += item.qty;
      });
    });

    return Object.values(catMap).sort((a, b) => b.revenue - a.revenue);
  }, [filteredInvoices, products]);

  // Payment Breakdown Data
  const paymentPieData = useMemo(() => {
    const pMap = {};
    filteredInvoices.forEach((inv) => {
      const method = inv.paymentMethod || 'كاش';
      pMap[method] = (pMap[method] || 0) + inv.total;
    });

    return Object.entries(pMap).map(([name, value]) => ({ name, value }));
  }, [filteredInvoices]);

  // Best selling products calculation
  const topSellingProducts = useMemo(() => {
    const productSalesMap = {};
    filteredInvoices.forEach((inv) => {
      inv.items?.forEach((item) => {
        if (!productSalesMap[item.name]) {
          productSalesMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
        }
        productSalesMap[item.name].qty += item.qty;
        productSalesMap[item.name].revenue += item.price * item.qty;
      });
    });

    return Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredInvoices]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>التحليلات المالية والرسوم البيانية</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              شارتات تفاعلية
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مؤشرات أداء متجر لندن للأزياء، منحنيات المبيعات اليومية، وتحليل أرباح الأصناف.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {[
            { id: 'today', label: 'اليوم' },
            { id: 'week', label: 'هذا الأسبوع' },
            { id: 'month', label: 'هذا الشهر' },
            { id: 'all', label: 'كل الفترات' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Financial KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Revenue */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-bold">إجمالي المبيعات</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
            {totalSales.toLocaleString()} <span className="text-xs font-sans font-bold">{currency.symbol}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {filteredInvoices.length} فواتير بيع
          </div>
        </div>

        {/* Cost of Goods Sold */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-bold">تكلفة البضاعة (COGS)</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-slate-700 dark:text-slate-300">
            {totalCost.toLocaleString()} <span className="text-xs font-sans font-bold">{currency.symbol}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            تكلفة شراء القطع
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-bold">المصروفات التشغيلية</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-rose-600 dark:text-rose-400">
            {totalExpenses.toLocaleString()} <span className="text-xs font-sans font-bold">{currency.symbol}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            إيجار ومرافق وتغليف
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20">
          <div className="flex items-center justify-between text-emerald-100 mb-1.5">
            <span className="text-xs font-bold">صافي الربح</span>
            <div className="p-1.5 rounded-lg bg-white/20 text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black font-mono">
            {netProfit.toLocaleString()} <span className="text-xs font-sans font-bold">{currency.symbol}</span>
          </div>
          <div className="text-[10px] text-emerald-100/90 mt-1">
            هامش الربح: {profitMarginPercent}%
          </div>
        </div>

        {/* Average Order Value */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-bold">متوسط الفاتورة</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
            {avgOrderValue} <span className="text-xs font-sans font-bold">{currency.symbol}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            معدل الصرف لكل زبون
          </div>
        </div>
      </div>

      {/* Visual Recharts Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Profit Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>منحنى المبيعات وصافي الأرباح</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                رسم بياني تفاعلي يوضح الإيرادات والأرباح اليومية
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                المبيعات
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                الأرباح
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px',
                    direction: 'rtl',
                  }}
                  formatter={(value) => [`${value.toLocaleString()} ${currency.symbol}`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="المبيعات"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="الأرباح"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Donut / Pie Chart (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <span>توزيع طرق الدفع</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-2">نسبة السداد كاش مقابل شبكة وآجل</p>

            <div className="h-48 w-full flex items-center justify-center">
              {paymentPieData.length === 0 ? (
                <div className="text-xs text-slate-400">لا توجد بيانات دفع كافية</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {paymentPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderRadius: '10px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                        direction: 'rtl',
                      }}
                      formatter={(val) => [`${val.toLocaleString()} ${currency.symbol}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold">
            {paymentPieData.map((item, idx) => (
              <span key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                />
                <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Bar Chart & Top Selling Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Sales Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <Shirt className="w-4 h-4 text-indigo-600" />
            <span>مبيعات فئات الأزياء والملابس</span>
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">
            مقارنة الإيرادات المحققة من كل قسم في البوتيك
          </p>

          <div className="h-64 w-full">
            {categoryChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                لا توجد مبيعات في هذه الفترة
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="category" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '11px',
                      direction: 'rtl',
                    }}
                    formatter={(val) => [`${val.toLocaleString()} ${currency.symbol}`, 'الإيراد']}
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top 5 Best Sellers List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>الموديلات الأكثر طلباً وتحقيقاً للأرباح</span>
              </h3>
              <span className="text-xs text-slate-400">أعلى إيراد</span>
            </div>

            <div className="space-y-2.5">
              {topSellingProducts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  لا توجد مبيعات مسجلة في هذه الفترة
                </div>
              ) : (
                topSellingProducts.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          تم بيع {item.qty} قطع
                        </div>
                      </div>
                    </div>

                    <div className="text-left font-mono font-bold text-xs text-slate-900 dark:text-white">
                      {item.revenue.toLocaleString()} {currency.symbol}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 text-[11px] text-indigo-900 dark:text-indigo-300">
            ✨ يتم تحديث هذه الشارتات والتحليلات تلقائياً مع كل فاتورة بيع جديدة أو عملية مرتجع.
          </div>
        </div>
      </div>
    </div>
  );
};
