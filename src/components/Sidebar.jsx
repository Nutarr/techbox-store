'use client';

import { useState } from 'react';

export default function Sidebar({ onFilterChange, onSortChange }) {
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [freeShipping, setFreeShipping] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const handlePriceChange = (min, max) => {
    setPriceMin(min);
    setPriceMax(max);
    onFilterChange({
      priceMin: min ? parseInt(min) : 0,
      priceMax: max ? parseInt(max) : Infinity,
      freeShipping,
    });
  };

  const handleShippingChange = (checked) => {
    setFreeShipping(checked);
    onFilterChange({
      priceMin: priceMin ? parseInt(priceMin) : 0,
      priceMax: priceMax ? parseInt(priceMax) : Infinity,
      freeShipping: checked,
    });
  };

  const handleSort = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  return (
    <aside className="space-y-4">
      {/* Sort */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h3 className="text-sm font-bold text-blue-600 mb-3 flex items-center gap-2">
          🏷️ الترتيب
        </h3>
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="w-full p-2.5 border border-gray-200 rounded-xl text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">الترتيب الافتراضي</option>
          <option value="price-low">السعر: من الأقل للأعلى</option>
          <option value="price-high">السعر: من الأعلى للأقل</option>
          <option value="rating">الأعلى تقييماً</option>
          <option value="discount">الأكثر خصماً</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h3 className="text-sm font-bold text-blue-600 mb-3 flex items-center gap-2">
          💰 نطاق السعر
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="من"
            value={priceMin}
            onChange={(e) => handlePriceChange(e.target.value, priceMax)}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="إلى"
            value={priceMax}
            onChange={(e) => handlePriceChange(priceMin, e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h3 className="text-sm font-bold text-blue-600 mb-3 flex items-center gap-2">
          🚚 الشحن
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={freeShipping}
            onChange={(e) => handleShippingChange(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm group-hover:text-blue-600 transition-colors">
            شحن مجاني فقط
          </span>
        </label>
      </div>
    </aside>
  );
}
