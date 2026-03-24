'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { categories } from '@/data/products';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const handleCategoryClick = (catId) => {
    if (catId === 'all') {
      router.push('/');
    } else {
      router.push(`/?category=${catId}`);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-l from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-white shrink-0">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl">
              ⚡
            </div>
            <span className="text-xl sm:text-2xl font-extrabold">TechBox</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج... (سماعات، شاحن، ساعة ذكية...)"
              className="w-full py-2.5 px-5 pr-12 rounded-full bg-white/15 text-white placeholder-white/70 outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all duration-300 text-sm"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
            >
              🔍
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleCart}
              className="relative bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all text-sm"
            >
              🛒
              <span className="hidden sm:inline">السلة</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -left-1 bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-white/15 hover:bg-white/25 text-white p-2 rounded-lg"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full py-2 px-4 pr-10 rounded-xl bg-white/15 text-white placeholder-white/70 outline-none focus:bg-white focus:text-gray-900 text-sm"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
              🔍
            </button>
          </form>
        </div>
      </div>

      {/* Categories Nav */}
      <nav className="bg-blue-900/30 backdrop-blur-sm border-b border-white/10 bg-gradient-to-l from-blue-700 to-blue-900">
        <div className={`max-w-7xl mx-auto ${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-wrap md:flex-nowrap overflow-x-auto px-4 gap-0">
            {categories.map((cat) => (
              <li key={cat.id} className="shrink-0">
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className="block px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm whitespace-nowrap"
                >
                  {cat.icon} {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
