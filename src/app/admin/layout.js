'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/context/AdminContext';

const navItems = [
  { href: '/admin', label: 'الرئيسية', icon: '📊' },
  { href: '/admin/products', label: 'المنتجات', icon: '📦' },
  { href: '/admin/orders', label: 'الطلبات', icon: '🛒' },
  { href: '/admin/profits', label: 'الأرباح', icon: '💰' },
  { href: '/admin/guidelines', label: 'قواعد المنتجات', icon: '📋' },
  { href: '/admin/settings', label: 'الإعدادات', icon: '⚙️' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-100 flex" dir="rtl">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white shrink-0 hidden md:flex flex-col">
          <div className="p-5 border-b border-gray-700">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl">⚡</div>
              <div>
                <h1 className="font-bold text-lg">TechBox</h1>
                <p className="text-xs text-gray-400">دروب شوبينق</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700 space-y-2">
            <Link href="/track" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              📍 صفحة تتبع العميل
            </Link>
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              🌐 عرض المتجر
            </Link>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-sm">دروب شوبينق</span>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-lg text-sm ${
                  pathname === item.href ? 'bg-blue-600' : 'bg-gray-800'
                }`}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:p-8 p-4 pt-16 md:pt-8 overflow-auto">
          {children}
        </main>
      </div>
    </AdminProvider>
  );
}
