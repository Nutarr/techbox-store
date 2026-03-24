'use client';

import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { stats, orders, products, getProductProfit } = useAdmin();

  const statCards = [
    { label: 'إجمالي المنتجات', value: stats.totalProducts, icon: '📦', color: 'bg-blue-500', link: '/admin/products' },
    { label: 'إجمالي الطلبات', value: stats.totalOrders, icon: '🛒', color: 'bg-indigo-500', link: '/admin/orders' },
    { label: 'الإيرادات', value: `${stats.totalRevenue.toLocaleString('ar-SA')} ر.س`, icon: '💵', color: 'bg-cyan-500', link: '/admin/profits' },
    { label: 'صافي الربح', value: `${stats.totalProfit.toLocaleString('ar-SA')} ر.س`, icon: '💰', color: 'bg-green-500', link: '/admin/profits' },
    { label: 'هامش الربح', value: `${stats.profitMargin}%`, icon: '📈', color: 'bg-purple-500', link: '/admin/profits' },
    { label: 'بانتظار الطلب من المورد', value: stats.pendingSupplier, icon: '⏳', color: 'bg-orange-500', link: '/admin/orders' },
  ];

  // Top profitable products
  const topProducts = [...products]
    .map(p => ({ ...p, ...getProductProfit(p) }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-800">مرحباً صلاح 👋</h1>
        <p className="text-gray-500 mt-1">ملخص أداء متجر الدروب شوبينق</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.link}>
            <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className={`${card.color} text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl`}>
                  {card.icon}
                </span>
              </div>
              <p className="text-2xl font-extrabold text-gray-800">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Orders with Supplier Status */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">آخر الطلبات</h2>
            <Link href="/admin/orders" className="text-blue-600 text-sm hover:underline">عرض الكل</Link>
          </div>
          <div className="divide-y">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-blue-600 text-sm">{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{order.customer}</span>
                  <span className="font-bold text-red-500">{order.total} ر.س</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-400">ربح: <span className="text-green-600 font-bold">{order.profit || 0} ر.س</span></span>
                  <SupplierBadge status={order.supplierStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Profitable Products */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">أعلى المنتجات ربحاً</h2>
            <Link href="/admin/profits" className="text-blue-600 text-sm hover:underline">حاسبة الأرباح</Link>
          </div>
          <div className="divide-y">
            {topProducts.map((product) => (
              <div key={product.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{product.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm line-clamp-1">{product.title.substring(0, 40)}...</p>
                    <p className="text-xs text-gray-400">تكلفة: {product.cost} ر.س → بيع: {product.price} ر.س</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-green-600">{product.profit} ر.س</p>
                  <p className="text-xs text-gray-400">{product.margin}% هامش</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Link href="/admin/products" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
          <span className="text-3xl mb-2 block">➕</span>
          <p className="font-bold text-sm">إضافة منتج</p>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
          <span className="text-3xl mb-2 block">📋</span>
          <p className="font-bold text-sm">إدارة الطلبات</p>
        </Link>
        <Link href="/admin/profits" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
          <span className="text-3xl mb-2 block">💰</span>
          <p className="font-bold text-sm">حاسبة الأرباح</p>
        </Link>
        <Link href="/track" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
          <span className="text-3xl mb-2 block">📍</span>
          <p className="font-bold text-sm">تتبع الطلبات</p>
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    'جديد': 'bg-blue-100 text-blue-700',
    'قيد التنفيذ': 'bg-yellow-100 text-yellow-700',
    'تم الشحن': 'bg-green-100 text-green-700',
    'مكتمل': 'bg-gray-100 text-gray-700',
    'ملغي': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
}

function SupplierBadge({ status }) {
  const colors = {
    'لم يُطلب': 'text-red-500',
    'تم الطلب': 'text-yellow-600',
    'تم الشحن': 'text-blue-600',
    'تم التوصيل': 'text-green-600',
  };
  return (
    <span className={`text-xs font-semibold ${colors[status] || 'text-gray-400'}`}>
      🏭 {status || 'لم يُطلب'}
    </span>
  );
}
