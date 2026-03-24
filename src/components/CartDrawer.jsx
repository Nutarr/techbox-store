'use client';

import { useCart } from '@/context/CartContext';
import { openWhatsApp, formatOrderMessage } from '@/lib/whatsapp';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, totalPrice, totalItems, updateQty, removeItem } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    const message = formatOrderMessage(items, totalPrice);
    openWhatsApp(message);
  };

  const handleBuyFromAli = () => {
    items.forEach((item) => {
      window.open(item.aliUrl, '_blank');
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white z-[61] animate-slide-in flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            🛒 سلة التسوق
            {totalItems > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {totalItems} منتج
              </span>
            )}
          </h2>
          <button
            onClick={toggleCart}
            className="text-gray-400 hover:text-gray-600 text-xl p-1"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4 opacity-30">🛒</div>
              <p className="text-lg">السلة فارغة</p>
              <p className="text-sm mt-1">أضف منتجات للبدء</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold line-clamp-1">{item.title}</h4>
                    <p className="text-red-500 font-bold text-sm mt-1">
                      {(item.price * item.qty).toLocaleString('ar-SA')} ر.س
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 border rounded-lg flex items-center justify-center text-sm hover:bg-gray-200"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 border rounded-lg flex items-center justify-center text-sm hover:bg-gray-200"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 text-xs mr-auto"
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">الإجمالي:</span>
              <span className="font-extrabold text-lg text-red-500">
                {totalPrice.toLocaleString('ar-SA')} ر.س
              </span>
            </div>

            {/* WhatsApp Order */}
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-lg">📱</span>
              اطلب عبر واتساب
            </button>

            {/* Buy from AliExpress */}
            <button
              onClick={handleBuyFromAli}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-lg">🛒</span>
              اشتر مباشرة من علي إكسبريس
            </button>
          </div>
        )}
      </div>
    </>
  );
}
