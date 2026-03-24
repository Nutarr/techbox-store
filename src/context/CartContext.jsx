'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQty = useCallback((productId, delta) => {
    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === productId) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      });
      return updated.filter(Boolean);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const isInCart = useCallback(
    (productId) => items.some((item) => item.id === productId),
    [items]
  );

  const getWhatsAppMessage = useCallback(() => {
    if (items.length === 0) return '';

    let message = '🛒 *طلب جديد من TechBox*\n\n';
    items.forEach((item, i) => {
      message += `${i + 1}. ${item.title}\n`;
      message += `   الكمية: ${item.qty} | السعر: ${item.price * item.qty} ر.س\n`;
      message += `   رابط المنتج: ${item.aliUrl}\n\n`;
    });
    message += `──────────────\n`;
    message += `💰 *الإجمالي: ${totalPrice} ر.س*\n\n`;
    message += `📱 الاسم:\n📍 العنوان:\n`;

    return encodeURIComponent(message);
  }, [items, totalPrice]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        toggleCart,
        isInCart,
        getWhatsAppMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
