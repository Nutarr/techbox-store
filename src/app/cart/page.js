'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { openWhatsApp, formatOrderMessage } from '@/lib/whatsapp';

export default function CartPage() {
  const { items, totalPrice, totalItems, updateQty, removeItem, clearCart } = useCart();

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    const message = formatOrderMessage(items, totalPrice);
    openWhatsApp(message);
  };

  const handleBuyFromAli = () => {
    items.forEach((item) => {
      window.open(item.aliUrl, '_blank');
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">سلة التسوق</span>
      </nav>

      <h1 className="text-2xl font-extrabold mb-6">🛒 سلة التسوق</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg text-center py-20 px-4">
          <div className="text-6xl mb-4 opacity-30">🛒</div>
          <p className="text-xl font-bold text-gray-600 mb-2">السلة فارغة</p>
          <p className="text-gray-400 mb-6">أضف منتجات من المتجر للبدء</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Items */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`flex gap-4 p-5 ${i > 0 ? 'border-t' : ''}`}
              >
                <Link href={`/products/${item.id}`}>
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shrink-0 cursor-pointer hover:bg-gray-100 transition-colors">
                    {item.emoji}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-semibold text-sm hover:text-blue-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{item.categoryLabel}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="font-bold w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-red-500">
                        {(item.price * item.qty).toLocaleString('ar-SA')} ر.س
                      </p>
                      {item.qty > 1 && (
                        <p className="text-xs text-gray-400">{item.price} ر.س × {item.qty}</p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-600 self-start text-lg"
                  title="حذف"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-bold text-lg mb-4">ملخص الطلب</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">عدد المنتجات:</span>
                <span>{totalItems} منتج</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">المجموع الفرعي:</span>
                <span>{totalPrice.toLocaleString('ar-SA')} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الشحن:</span>
                <span className="text-emerald-600">مجاني</span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between text-lg font-extrabold">
                <span>الإجمالي:</span>
                <span className="text-red-500">{totalPrice.toLocaleString('ar-SA')} ر.س</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                📱 اطلب عبر واتساب
              </button>
              <button
                onClick={handleBuyFromAli}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                🛒 اشتر مباشرة من علي إكسبريس
              </button>
              <button
                onClick={clearCart}
                className="w-full py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm transition-colors"
              >
                🗑️ تفريغ السلة
              </button>
            </div>
          </div>

          <Link href="/" className="block text-center text-blue-600 hover:underline text-sm mt-4">
            ← متابعة التسوق
          </Link>
        </div>
      )}
    </div>
  );
}
