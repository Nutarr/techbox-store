'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

const statusOptions = ['جديد', 'قيد التنفيذ', 'تم الشحن', 'مكتمل', 'ملغي'];
const supplierStatusOptions = ['لم يُطلب', 'تم الطلب', 'تم الشحن', 'تم التوصيل'];

export default function AdminOrders() {
  const { orders, updateOrderStatus, updateSupplierInfo } = useAdmin();
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({
    supplierOrderId: '', trackingNumber: '', trackingUrl: '',
    supplierNote: '', estimatedDelivery: '', supplierStatus: 'لم يُطلب',
  });

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const statusColors = {
    'جديد': 'bg-blue-100 text-blue-700',
    'قيد التنفيذ': 'bg-yellow-100 text-yellow-700',
    'تم الشحن': 'bg-green-100 text-green-700',
    'مكتمل': 'bg-gray-100 text-gray-700',
    'ملغي': 'bg-red-100 text-red-700',
  };

  const supplierColors = {
    'لم يُطلب': 'bg-red-100 text-red-700',
    'تم الطلب': 'bg-yellow-100 text-yellow-700',
    'تم الشحن': 'bg-blue-100 text-blue-700',
    'تم التوصيل': 'bg-green-100 text-green-700',
  };

  const openSupplierEdit = (order) => {
    setSupplierForm({
      supplierOrderId: order.supplierOrderId || '',
      trackingNumber: order.trackingNumber || '',
      trackingUrl: order.trackingUrl || '',
      supplierNote: order.supplierNote || '',
      estimatedDelivery: order.estimatedDelivery || '',
      supplierStatus: order.supplierStatus || 'لم يُطلب',
    });
    setEditingSupplier(order.id);
  };

  const saveSupplierInfo = () => {
    updateSupplierInfo(editingSupplier, supplierForm);
    setEditingSupplier(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800">🛒 إدارة الطلبات - دروب شوبينق</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} طلب</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-extrabold text-red-600">{orders.filter(o => o.supplierStatus === 'لم يُطلب').length}</p>
          <p className="text-xs text-red-500 font-semibold">بانتظار الطلب</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-extrabold text-yellow-600">{orders.filter(o => o.supplierStatus === 'تم الطلب').length}</p>
          <p className="text-xs text-yellow-600 font-semibold">تم الطلب من المورد</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-extrabold text-blue-600">{orders.filter(o => o.supplierStatus === 'تم الشحن').length}</p>
          <p className="text-xs text-blue-600 font-semibold">في الطريق</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-extrabold text-green-600">{orders.filter(o => o.supplierStatus === 'تم التوصيل').length}</p>
          <p className="text-xs text-green-600 font-semibold">تم التوصيل</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}>
          الكل ({orders.length})
        </button>
        {statusOptions.map(status => {
          const count = orders.filter(o => o.status === status).length;
          return (
            <button key={status} onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filterStatus === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}>
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Order Header */}
            <div
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono font-bold text-blue-600">{order.id}</span>
                <span className="text-gray-400 text-xs">{order.date}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${supplierColors[order.supplierStatus || 'لم يُطلب']}`}>
                  🏭 {order.supplierStatus || 'لم يُطلب'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <p className="font-semibold">{order.customer}</p>
                  <p className="text-xs text-gray-400">{order.city}</p>
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-red-500">{order.total} ر.س</p>
                  <p className="text-xs text-green-600 font-bold">ربح: {order.profit || 0} ر.س</p>
                </div>
                <span className="text-gray-400">{expandedOrder === order.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrder === order.id && (
              <div className="border-t px-5 py-4 bg-gray-50 space-y-4">
                {/* Items */}
                <div>
                  <h3 className="font-bold text-sm mb-2">المنتجات:</h3>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between bg-white p-3 rounded-xl text-sm">
                        <span>{item.title} × {item.qty}</span>
                        <div className="text-left">
                          <span className="font-bold">{item.price * item.qty} ر.س</span>
                          {item.costPrice && (
                            <span className="text-xs text-gray-400 mr-2">(تكلفة: {item.costPrice * item.qty} ر.س)</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2 text-sm bg-white p-3 rounded-xl">
                    <span>الإجمالي: <strong className="text-red-500">{order.total} ر.س</strong></span>
                    <span>التكلفة: <strong className="text-gray-600">{order.totalCost || 0} ر.س</strong></span>
                    <span>الربح: <strong className="text-green-600">{order.profit || 0} ر.س</strong></span>
                  </div>
                </div>

                {/* Supplier Info */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-blue-800">🏭 معلومات المورد</h3>
                    {editingSupplier !== order.id && (
                      <button onClick={() => openSupplierEdit(order)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-700">
                        ✏️ تعديل
                      </button>
                    )}
                  </div>

                  {editingSupplier === order.id ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-blue-700">حالة الطلب من المورد</label>
                        <select value={supplierForm.supplierStatus}
                          onChange={e => setSupplierForm({...supplierForm, supplierStatus: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                          {supplierStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-blue-700">رقم طلب المورد</label>
                        <input value={supplierForm.supplierOrderId}
                          onChange={e => setSupplierForm({...supplierForm, supplierOrderId: e.target.value})}
                          placeholder="AE-XXXXXXXXXX" dir="ltr"
                          className="w-full px-3 py-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-blue-700">رقم التتبع</label>
                        <input value={supplierForm.trackingNumber}
                          onChange={e => setSupplierForm({...supplierForm, trackingNumber: e.target.value})}
                          placeholder="LP001XXXXXXXXX" dir="ltr"
                          className="w-full px-3 py-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-blue-700">التوصيل المتوقع</label>
                        <input type="date" value={supplierForm.estimatedDelivery}
                          onChange={e => setSupplierForm({...supplierForm, estimatedDelivery: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg text-sm" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold mb-1 text-blue-700">ملاحظات</label>
                        <input value={supplierForm.supplierNote}
                          onChange={e => setSupplierForm({...supplierForm, supplierNote: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg text-sm" />
                      </div>
                      <div className="sm:col-span-2 flex gap-2">
                        <button onClick={saveSupplierInfo}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700">
                          💾 حفظ
                        </button>
                        <button onClick={() => setEditingSupplier(null)}
                          className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-300">
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">حالة المورد:</span> <strong>{order.supplierStatus || 'لم يُطلب'}</strong></div>
                      <div><span className="text-gray-500">رقم الطلب:</span> <strong dir="ltr">{order.supplierOrderId || '-'}</strong></div>
                      <div><span className="text-gray-500">رقم التتبع:</span> <strong dir="ltr">{order.trackingNumber || '-'}</strong></div>
                      <div><span className="text-gray-500">التوصيل المتوقع:</span> <strong>{order.estimatedDelivery || '-'}</strong></div>
                      {order.supplierNote && (
                        <div className="col-span-2"><span className="text-gray-500">ملاحظات:</span> {order.supplierNote}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Change Order Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span className="text-sm font-semibold">حالة الطلب للعميل:</span>
                  <div className="flex gap-2 flex-wrap">
                    {statusOptions.map(status => (
                      <button key={status}
                        onClick={() => updateOrderStatus(order.id, status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          order.status === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border hover:bg-gray-100 text-gray-600'
                        }`}>
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer info */}
                <div className="text-sm text-gray-500">
                  📞 {order.phone} &nbsp; 📍 {order.city}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm">
            <p className="text-4xl mb-2">📋</p>
            <p>لا توجد طلبات بهذه الحالة</p>
          </div>
        )}
      </div>
    </div>
  );
}
