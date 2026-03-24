'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const { addItem, isInCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const stars = '★'.repeat(Math.floor(product.rating));
  const inCart = isInCart(product.id);
  const hasExternalImage = product.image && product.image.startsWith('http') && !imgError;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success('تمت الإضافة للسلة ✅');
  };

  const badgeColors = {
    sale: 'bg-red-500',
    new: 'bg-emerald-500',
    hot: 'bg-orange-500',
  };

  return (
    <div
      className="animate-fade-in-up bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Badge */}
      <div className="relative">
        <span
          className={`absolute top-3 right-3 ${badgeColors[product.badgeType] || 'bg-red-500'} text-white text-xs font-bold px-3 py-1 rounded-full z-10`}
        >
          {product.badge}
        </span>

        {/* Image */}
        <Link href={`/products/${product.id}`}>
          <div className="w-full h-52 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer">
            {hasExternalImage ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 p-2"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                {product.emoji}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Info */}
      <div className="p-4">
        <span className="text-xs text-blue-600 font-medium">{product.categoryLabel}</span>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold mt-1 leading-relaxed line-clamp-2 min-h-[2.8rem] hover:text-blue-600 transition-colors cursor-pointer">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-yellow-400 text-xs tracking-wider">{stars}</span>
          <span className="text-xs text-gray-400">
            {product.rating} ({product.reviews.toLocaleString('ar-SA')})
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-extrabold text-red-500">{product.price} ر.س</span>
          <span className="text-sm text-gray-400 line-through">{product.originalPrice} ر.س</span>
          <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded font-semibold">
            -{discount}%
          </span>
        </div>

        {/* Shipping */}
        <p className="text-xs mt-2 flex items-center gap-1">
          {product.freeShipping ? (
            <span className="text-emerald-600">✅ شحن مجاني للسعودية</span>
          ) : (
            <span className="text-gray-500">🚚 شحن 15 ر.س</span>
          )}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            🛒 اشتر الآن
          </Link>
          <button
            onClick={handleAddToCart}
            className={`px-3 rounded-xl text-lg transition-all ${
              inCart
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-blue-600 hover:text-white'
            }`}
          >
            {inCart ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}
