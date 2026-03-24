'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct, getProductProfit } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [form, setForm] = useState({
    title: '', description: '', category: 'chargers', categoryLabel: 'شواحن وبطاريات',
    price: '', costPrice: '', originalPrice: '', rating: '4.5', reviews: '0', emoji: '📦',
    badge: '', badgeType: 'new', freeShipping: true,
    aliUrl: '', colors: '',
  });

  const categoryLabels = {
    smartphones: 'هواتف', headphones: 'سماعات', chargers: 'شواحن وبطاريات',
    watches: 'ساعات ذكية', smarthome: 'منزل ذكي', accessories: 'إكسسوارات', storage: 'تخزين',
  };

  const resetForm = () => {
    setForm({
      title: '', description: '', category: 'chargers', categoryLabel: 'شواحن وبطاريات',
      price: '', costPrice: '', originalPrice: '', rating: '4.5', reviews: '0', emoji: '📦',
      badge: '', badgeType: 'new', freeShipping: true, aliUrl: '', colors: '',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title, description: product.description,
      category: product.category, categoryLabel: product.categoryLabel,
      price: String(product.price), costPrice: String(product.costPrice || ''),
      originalPrice: String(product.originalPrice),
      rating: String(product.rating), reviews: String(product.reviews),
      emoji: product.emoji, badge: product.badge, badgeType: product.badgeType,
      freeShipping: product.freeShipping, aliUrl: product.aliUrl,
      colors: (product.colors || []).join('، '),
    });
    setEditingProduct(product.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: parseInt(form.price),
      costPrice: parseInt(form.costPrice) || 0,
      originalPrice: parseInt(form.originalPrice),
      rating: parseFloat(form.rating),
      reviews: parseInt(form.reviews),
      categoryLabel: categoryLabels[form.category],
      colors: form.colors.split('،').map(c => c.trim()).filter(Boolean),
      specs: {},
    };

    if (editingProduct) {
      updateProduct(editingProduct, productData);
    } else {
      addProduct(productData);
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(id);
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.title.includes(searchQuery) || p.categoryLabel.includes(searchQuery);
    const matchCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // Calculate auto profit when costPrice or price changes
  const autoProfit = form.price && form.costPrice
    ? parseInt(form.price) - parseInt(form.costPrice)
    : null;
  const autoMargin = autoProfit && form.price
    ? Math.round((autoProfit / parseInt(form.price)) * 100)
    : null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">📦 إدارة المنتجات</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} منتج</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          ➕ إضافة منتج
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text" placeholder="ابحث عن منتج..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
          ))}
        </select>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border-2 border-blue-200">
          <h2 className="font-bold text-lg mb-4">
            {editingProduct ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold mb-1">اسم المنتج *</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold mb-1">الوصف</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows="2" className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Dropshipping pricing section */}
            <div className="sm:col-span-2 lg:col-span-3 bg-green-50 rounded-xl p-4 border border-green-200">
              <h3 className="font-bold text-sm text-green-800 mb-3">💰 تسعير الدروب شوبينق</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">سعر التكلفة من المورد (ر.س) *</label>
                  <input required type="number" value={form.costPrice} onChange={e => setForm({...form, costPrice: e.target.value})}
                    placeholder="سعر الشراء من علي إكسبريس"
                    className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">سعر البيع (ر.س) *</label>
                  <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    placeholder="السعر للعميل"
                    className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">السعر قبل الخصم (ر.س)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})}
                    className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              {autoProfit !== null && (
                <div className="mt-3 flex gap-4 text-sm">
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-lg font-bold">
                    الربح: {autoProfit} ر.س
                  </span>
                  <span className={`px-3 py-1 rounded-lg font-bold ${autoMargin >= 30 ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    هامش الربح: {autoMargin}%
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">الفئة *</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value, categoryLabel: categoryLabels[e.target.value]})}
                className="w-full px-4 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {categories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">الأيقونة</label>
              <input value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl text-sm text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">التقييم</label>
              <input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">عدد التقييمات</label>
              <input type="number" value={form.reviews} onChange={e => setForm({...form, reviews: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">البادج</label>
              <input value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} placeholder="مثال: خصم 40%"
                className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">نوع البادج</label>
              <select value={form.badgeType} onChange={e => setForm({...form, badgeType: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="sale">خصم (أحمر)</option>
                <option value="hot">الأكثر مبيعاً (برتقالي)</option>
                <option value="new">جديد (أخضر)</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold mb-1">رابط علي إكسبريس</label>
              <input value={form.aliUrl} onChange={e => setForm({...form, aliUrl: e.target.value})} dir="ltr"
                className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">الألوان (مفصولة بفاصلة)</label>
              <input value={form.colors} onChange={e => setForm({...form, colors: e.target.value})} placeholder="أسود، أبيض، أزرق"
                className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.freeShipping} onChange={e => setForm({...form, freeShipping: e.target.checked})}
                className="w-4 h-4 accent-blue-600" />
              <label className="text-sm">شحن مجاني</label>
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex gap-3 mt-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                {editingProduct ? '💾 حفظ التعديلات' : '➕ إضافة المنتج'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right p-4 font-semibold text-gray-600 w-12">#</th>
                <th className="text-right p-4 font-semibold text-gray-600">المنتج</th>
                <th className="text-right p-4 font-semibold text-gray-600">الفئة</th>
                <th className="text-right p-4 font-semibold text-gray-600">التكلفة</th>
                <th className="text-right p-4 font-semibold text-gray-600">البيع</th>
                <th className="text-right p-4 font-semibold text-gray-600">الربح</th>
                <th className="text-right p-4 font-semibold text-gray-600">الهامش</th>
                <th className="text-right p-4 font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const { cost, profit, margin } = getProductProfit(product);
                return (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-2xl">{product.emoji}</td>
                    <td className="p-4">
                      <p className="font-semibold line-clamp-1 max-w-[200px]">{product.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{product.badge}</p>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{product.categoryLabel}</td>
                    <td className="p-4">
                      <span className="text-gray-600 font-mono">{cost} ر.س</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-blue-600">{product.price} ر.س</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-green-600">{profit} ر.س</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        margin >= 50 ? 'bg-green-100 text-green-700' :
                        margin >= 30 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {margin}%
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(product.id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📦</p>
            <p>لا توجد منتجات</p>
          </div>
        )}
      </div>
    </div>
  );
}
