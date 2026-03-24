'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminSettings() {
  const { storeSettings, setStoreSettings } = useAdmin();
  const [form, setForm] = useState({ ...storeSettings });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setStoreSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800">⚙️ إعدادات المتجر</h1>
        <p className="text-gray-500 text-sm mt-1">تخصيص معلومات وإعدادات متجرك</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">🏪 معلومات المتجر</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">اسم المتجر</label>
              <input value={form.storeName} onChange={e => setForm({...form, storeName: e.target.value})}
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">البريد الإلكتروني</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} dir="ltr"
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">رقم الواتساب</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} dir="ltr"
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400 mt-1">بدون + أو مسافات (مثال: 966558118653)</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">المدينة</label>
              <input value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">💰 التسعير والشحن</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">العملة</label>
              <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}
                className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ر.س">ريال سعودي (ر.س)</option>
                <option value="د.إ">درهم إماراتي (د.إ)</option>
                <option value="ج.م">جنيه مصري (ج.م)</option>
                <option value="د.ك">دينار كويتي (د.ك)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">الحد الأدنى للشحن المجاني ({form.currency})</label>
              <input type="number" value={form.freeShippingMin} onChange={e => setForm({...form, freeShippingMin: parseInt(e.target.value)})}
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">هامش الربح (%)</label>
              <input type="number" value={form.profitMargin} onChange={e => setForm({...form, profitMargin: parseInt(e.target.value)})}
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400 mt-1">النسبة المئوية المضافة على سعر علي إكسبريس</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors">
          💾 حفظ الإعدادات
        </button>

        {saved && (
          <p className="text-green-600 font-semibold text-sm">✅ تم حفظ الإعدادات بنجاح!</p>
        )}
      </form>
    </div>
  );
}
