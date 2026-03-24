'use client';

import { usePathname } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ToastProvider from '@/components/ToastProvider';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isTrack = pathname.startsWith('/track');

  if (isAdmin || isTrack) {
    return (
      <ToastProvider>
        {children}
      </ToastProvider>
    );
  }

  return (
    <CartProvider>
      <ToastProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
      </ToastProvider>
    </CartProvider>
  );
}
