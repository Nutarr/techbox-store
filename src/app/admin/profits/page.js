'use client';

import { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminProfits() {
  const { products, orders, getProductProfit, stats } = useAdmin();
  const [sortBy, setSortBy] = useState('profit');
  const [calcCost, setCalcCost] = useState('');
  const [calcSell, setCalcSell] = useState('');
  const [calcQty, setCalcQty] = useState('1');

  // Products with profit data
  const productsWithProfit = useMemo(() => {
    return products.map(p => ({
      ...p,
      ...getProductProfit(p),
    })).sort((a, b) => {
      if (sortBy === 'profit') return b.profit - a.profit;
      if (sortBy === 'margin') return b.margin - a.margin;
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'cost') return b.cost - a.cost;
      return 0;
    });
  }, [products, getProductProfit, sortBy]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const cats = {};
    productsWithProfit.forEach(p => {
      if (!cats[p.categoryLabel]) {
        cats[p.categoryLabel] = { count: 0, totalProfit: 0, avgMargin: 0, margins: [] };
      }
      cats[p.categoryLabel].count++;
      cats[p.categoryLabel].totalProfit += p.profit;
      cats[p.categoryLabel].margins.push(p.margin);
    });
    Object.keys(cats).forEach(key => {
      cats[key].avgMargin = Math.round(
        cats[key].margins.reduce((a, b) => a + b, 0) / cats[key].margins.length
      );
    });
    return Object.entries(cats).sort((a, b) => b[1].totalProfit - a[1].totalProfit);
  }, [productsWithProfit]);

  // Quick calculator
  const calcProfit = calcSell && calcCost ? (parseInt(calcSell) - parseInt(calcCost)) * parseInt(calcQty || 1) : 0;
  const calcMargin = calcSell && calcCost ? Math.round(((parseInt(calcSell) - parseInt(calcCost)) / parseInt(calcSell)) * 100) : 0;

  // Potential monthly profit
  const potentialMonthly = useMemo(() => {
    const avgProfit = productsWithProfit.length > 0
      ? productsWithProfit.reduce((sum, p) => sum + p.profit, 0) / productsWithProfit.length
      : 0;
    return {
      low: Math.round(avgProfit * 30),
      mid: Math.round(avgProfit * 100),
      high: Math.round(avgProfit * 300),
    };
  }, [productsWithProfit]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-800">💰 حاسبة الأرباح</h1>
        <p className="text-gray-500 mt-1">تحليل أرباح الدروب شوبينق</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
          <p className="text-sm opacity-80">إجمالي الأرباح</p>
          <p className="text-2xl font-extrabold">{stats.totalProfit.toLocaleString('ar-SA')} ر.س</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <p className="text-sm opacity-80">إجمالي الإيرادات</p>
          <p className="text-2xl font-extrabold">{stats.totalRevenue.toLocaleString('ar-SA')} ر.س</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
          <p className="text-sm opacity-80">متوسط الربح/طلب</p>
          <p className="text-2xl font-extrabold">{stats.avgProfit} ر.س</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
          <p className="text-sm opacity-80">هامش الربح الإجمالي</p>
          <p className="text-2xl font-extrabold">{stats.profitMargin}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Calculator */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4">🧮 حاسبة سريعة</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">سعر التكلفة (ر.س)</label>
              <input type="number" value={calcCost} onChange={e => setCalcCost(e.target.value)}
                placeholder="سعر الشراء من المورد"
                className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">سعر البيع (ر.س)</label>
              <input type="number" value={calcSell} onChange={e => setCalcSell(e.target.value)}
                placeholder="السعر للعميل"
                className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">الكمية</label>
              <input type="number" value={calcQty} onChange={e => setCalcQty(e.target.value)} min="1"
                className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            {calcProfit > 0 && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200 mt-3">
                <p className="text-sm text-green-700 mb-1">الربح الإجمالي:</p>
                <p className="text-3xl font-extrabold text-green-700">{calcProfit} ر.س</p>
                <p className="text-sm text-green-600 mt-1">هامش الربح: {calcMargin}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4">📊 الربح حسب الفئة</h2>
          <div className="space-y-3">
            {categoryBreakdown.map(([cat, data]) => (
              <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-sm">{cat}</p>
                  <p className="text-xs text-gray-400">{data.count} منتج</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-green-600 text-sm">~ {data.totalProfit} ر.س</p>
                  <p className="text-xs text-gray-400">هامش {data.avgMargin}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Potential */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4">📈 الربح الشهري المتوقع</h2>
          <p className="text-xs text-gray-400 mb-4">بناء على متوسط ربح المنتجات الحالية</p>
          <div className="space-y-3">
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <p className="text-sm text-yellow-700">30 طلب/شهر (بداية)</p>
              <p className="text-2xl font-extrabold text-yellow-700">{potentialMonthly.low.toLocaleString('ar-SA')} ر.س</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-700">100 طلب/شهر (متوسط)</p>
              <p className="text-2xl font-extrabold text-blue-700">{potentialMonthly.mid.toLocaleString('ar-SA')} ر.س</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-green-700">300 طلب/شهر (متقدم)</p>
              <p className="text-2xl font-extrabold text-green-700">{potentialMonthly.high.toLocaleString('ar-SA')} ر.س</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Profit Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="font-bold text-lg">📋 جدول أرباح المنتجات</h2>
          <div className="flex gap-2">
            {[
              { key: 'profit', label: 'حسب الربح' },
              { key: 'margin', label: 'حسب الهامش' },
              { key: 'price', label: 'حسب السعر' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  sortBy === opt.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right p-4 font-semibold text-gray-600">#</th>
                <th className="text-right p-4 font-semibold text-gray-600">المنتج</th>
                <th className="text-right p-4 font-semibold text-gray-600">التكلفة</th>
                <th className="text-right p-4 font-semibold text-gray-600">البيع</th>
                <th className="text-right p-4 font-semibold text-gray-600">الربح</th>
                <th className="text-right p-4 font-semibold text-gray-600">الهامش</th>
                <th className="text-right p-4 font-semibold text-gray-600">ربح 10 قطع</th>
                <th className="text-right p-4 font-semibold text-gray-600">ربح 100 قطعة</th>
              </tr>
            </thead>
            <tbody>
              {productsWithProfit.map((p, i) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-xl">{p.emoji}</td>
                  <td className="p-4">
                    <p className="font-semibold line-clamp-1 max-w-[200px]">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.categoryLabel}</p>
                  </td>
                  <td className="p-4 font-mono text-gray-600">{p.cost} ر.س</td>
                  <td className="p-4 font-bold text-blue-600">{p.price} ر.س</td>
                  <td className="p-4 font-extrabold text-green-600">{p.profit} ر.س</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      p.margin >= 50 ? 'bg-green-100 text-green-700' :
                      p.margin >= 30 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {p.margin}%
                    </span>
                  </td>
                  <td className="p-4 text-green-600 font-bold">{p.profit * 10} ر.س</td>
                  <td className="p-4 text-green-700 font-extrabold">{(p.profit * 100).toLocaleString('ar-SA')} ر.س</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
