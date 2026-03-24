'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProductCard from '@/components/ProductCard';
import Sidebar from '@/components/Sidebar';
import { products, categories } from '@/data/products';

function HomeContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: Infinity,
    freeShipping: false,
  });
  const [sortBy, setSortBy] = useState('default');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (categoryParam !== 'all') {
      result = result.filter((p) => p.category === categoryParam);
    }

    // Search filter
    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.categoryLabel.includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    // Shipping filter
    if (filters.freeShipping) {
      result = result.filter((p) => p.freeShipping);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => {
          const dA = 1 - a.price / a.originalPrice;
          const dB = 1 - b.price / b.originalPrice;
          return dB - dA;
        });
        break;
    }

    return result;
  }, [categoryParam, searchParam, filters, sortBy]);

  const currentCategory = categories.find((c) => c.id === categoryParam);
  const pageTitle = searchParam
    ? `نتائج البحث: "${searchParam}"`
    : currentCategory?.id === 'all'
    ? 'جميع المنتجات'
    : `${currentCategory?.icon} ${currentCategory?.label}`;

  return (
    <>
      <Hero />
      <Features />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block sticky top-32 self-start">
            <Sidebar onFilterChange={setFilters} onSortChange={setSortBy} />
          </div>

          {/* Products */}
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{pageTitle}</h2>
                <span className="text-sm text-gray-500">{filteredProducts.length} منتج</span>
              </div>
              <button
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className="lg:hidden bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-sm"
              >
                ⚙️ الفلاتر
              </button>
            </div>

            {/* Mobile Sidebar */}
            {showMobileSidebar && (
              <div className="lg:hidden mb-6">
                <Sidebar onFilterChange={setFilters} onSortChange={setSortBy} />
              </div>
            )}

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">😕</div>
                <p className="text-lg">لم يتم العثور على منتجات</p>
                <p className="text-sm mt-1">جرّب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-20">جاري التحميل...</div>}>
      <HomeContent />
    </Suspense>
  );
}
