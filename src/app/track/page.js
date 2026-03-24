'use client';

import { useState } from 'react';
import Link from 'next/link';

// This page works independently without AdminContext
// In production, this would fetch from an API

const sampleOrders = {
  'ORD-001': {
    id: 'ORD-001',
    date: '2026-03-24',
    customer: 'أحمد',
    status: 'جديد',
    total: 213,
    items: [
      { title: 'شاحن GaN 140W', qty: 2 },
      { title: 'سماعات Baseus Bowie MA10', qty: 1 },
    ],
    timeline: [
      { status: 'تم استلام الطلب', date: '2026-03-24', done: true },
      { status: 'جاري التجهيز', date: '', done: false },
      { status: 'تم الشحن', date: '', done: false },
      { status: 'في الطريق', date: '', done: false },
      { status: 'تم التوصيل', date: '', done: false },
    ],
    trackingNumber: '',
    estimatedDelivery: '',
  },
  'ORD-002': {
    id: 'ORD-002',
    date: '2026-03-23',
    customer: 'سارة',
    status: 'قيد التنفيذ',
    total: 125,
    items: [
      { title: 'ساعة ذكية Ultra 2', qty: 1 },
    ],
    timeline: [
      { status: 'تم استلام الطلب', date: '2026-03-23', done: true },
      { status: 'جاري التجهيز', date: '2026-03-24', done: true },
      { status: 'تم الشحن', date: '', done: false },
      { status: 'في الطريق', date: '', done: false },
      { status: 'تم التوصيل', date: '', done: false },
    ],
    trackingNumber: '',
    estimatedDelivery: '2026-04-08',
  },
  'ORD-003': {
    id: 'ORD-003',
    date: '2026-03-22',
    customer: 'خالد',
    status: 'تم الشحن',
    total: 234,
    items: [
      { title: 'باوربانك GaN 25000mAh', qty: 1 },
      { title: 'شاحن سيارة 140W', qty: 1 },
    ],
    timeline: [
      { status: 'تم استلام الطلب', date: '2026-03-22', done: true },
      { status: 'جاري التجهيز', date: '2026-03-23', done: true },
      { status: 'تم الشحن', date: '2026-03-24', done: true },
      { status: 'في الطريق', date: '2026-03-24', done: true },
      { status: 'تم التوصيل', date: '', done: false },
    ],
    trackingNumber: 'LP00182736492SA',
    estimatedDelivery: '2026-04-05',
  },
};

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    // Simulate API call
    setTimeout(() => {
      const found = sampleOrders[orderId.toUpperCase().trim()];
      if (found) {
        setOrder(found);
      } else {
        setError('لم يتم العثور على الطلب. تأكد من رقم الطلب وحاول مرة أخرى.');
      }
      setLoading(false);
    }, 800);
  };

  const statusColor = (status) => {
    const colors = {
      'جديد': 'text-blue-600',
      'قيد التنفيذ': 'text-yellow-600',
      'تم الشحن': 'text-green-600',
      'مكتمل': 'text-gray-600',
    };
    return colors[status] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 to-blue-800 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            ← العودة للمتجر
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl">⚡</div>
            <h1 className="text-2xl font-extrabold">TechBox</h1>
          </div>
          <p className="text-blue-200">تتبع طلبك</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-3">📍 تتبع طلبك</h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="أدخل رقم الطلب (مثال: ORD-001)"
              dir="ltr"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-mono text-center"
            />
            <button type="submit" disabled={!orderId.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              {loading ? '⏳' : '🔍 بحث'}
            </button>
          </form>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
              ❌ {error}
            </div>
          )}
        </div>

        {/* Order Result */}
        {order && (
          <div className="space-y-4 pb-12">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-mono font-bold text-blue-600 text-lg">{order.id}</span>
                  <span className="text-gray-400 text-sm mr-3">{order.date}</span>
                </div>
                <span className={`font-bold text-lg ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-xl text-sm">
                    <span>{item.title}</span>
                    <span className="text-gray-500">× {item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <span className="font-semibold">الإجمالي:</span>
                <span className="text-xl font-extrabold text-red-500">{order.total} ر.س</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-6">📦 حالة الطلب</h3>
              <div className="space-y-0">
                {order.timeline.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    {/* Circle and line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        step.done
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.done ? '✓' : i + 1}
                      </div>
                      {i < order.timeline.length - 1 && (
                        <div className={`w-0.5 h-10 ${step.done ? 'bg-green-300' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-6">
                      <p className={`font-semibold text-sm ${step.done ? 'text-green-700' : 'text-gray-400'}`}>
                        {step.status}
                      </p>
                      {step.date && <p className="text-xs text-gray-400">{step.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking & Delivery Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">🚚 معلومات الشحن</h3>
              <div className="space-y-3 text-sm">
                {order.trackingNumber ? (
                  <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl">
                    <span className="text-blue-700 font-semibold">رقم التتبع:</span>
                    <span className="font-mono font-bold text-blue-800" dir="ltr">{order.trackingNumber}</span>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-500 text-center">
                    لم يتم إضافة رقم تتبع بعد
                  </div>
                )}

                {order.estimatedDelivery && (
                  <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl">
                    <span className="text-green-700 font-semibold">التوصيل المتوقع:</span>
                    <span className="font-bold text-green-800">{order.estimatedDelivery}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <p className="text-gray-500 text-sm mb-3">هل تحتاج مساعدة بخصوص طلبك؟</p>
              <a
                href={`https://wa.me/966558118653?text=${encodeURIComponent(`مرحباً، أستفسر عن طلبي رقم ${order.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                💬 تواصل معنا عبر واتساب
              </a>
            </div>
          </div>
        )}

        {/* Info when no order */}
        {!order && !error && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-400">
            <p className="text-5xl mb-4">📦</p>
            <p className="font-semibold text-gray-600 mb-2">أدخل رقم طلبك لمتابعة حالته</p>
            <p className="text-sm">ستجد رقم الطلب في رسالة واتساب التي وصلتك بعد الطلب</p>
          </div>
        )}
      </div>
    </div>
  );
}
