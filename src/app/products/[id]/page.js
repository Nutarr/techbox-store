'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductById, products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { openWhatsApp, WHATSAPP_NUMBER } from '@/lib/whatsapp';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { id } = useParams();
  const product = getProductById(id);
  const { addItem, isInCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const hasExternalImage = product?.image && product.image.startsWith('http') && !imgError;

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-xl font-bold mb-2">المنتج غير موجود</p>
        <Link href="/" className="text-blue-600 hover:underline">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const stars = '★'.repeat(Math.floor(product.rating));
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addItem(product);
    toast.success('تمت الإضافة للسلة ✅');
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `مرحباً، أريد طلب هذا المنتج:\n\n📦 ${product.title}\n💰 السعر: ${product.price} ر.س\n${product.freeShipping ? '🚚 شحن مجاني' : '🚚 شحن: 15 ر.س'}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  // Related products (same category)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
        <span>/</span>
        <Link href={`/?category=${product.category}`} className="hover:text-blue-600">
          {product.categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Product Detail */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-gray-50 flex items-center justify-center p-12 min-h-[400px] relative">
            <span
              className={`absolute top-4 right-4 ${
                product.badgeType === 'new'
                  ? 'bg-emerald-500'
                  : product.badgeType === 'hot'
                  ? 'bg-orange-500'
                  : 'bg-red-500'
              } text-white text-sm font-bold px-4 py-1.5 rounded-full`}
            >
              {product.badge}
            </span>
            {hasExternalImage ? (
              <img
                src={product.image}
                alt={product.title}
                className="max-h-64 object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-[8rem]">{product.emoji}</span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-10 flex flex-col">
            <span className="text-blue-600 text-sm font-medium">{product.categoryLabel}</span>
            <h1 className="text-2xl font-extrabold mt-2 leading-relaxed">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-yellow-400 text-lg">{stars}</span>
              <span className="text-gray-500 text-sm">
                {product.rating} ({product.reviews.toLocaleString('ar-SA')} تقييم)
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mt-4">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-6">
              <span className="text-3xl font-extrabold text-red-500">{product.price} ر.س</span>
              <span className="text-lg text-gray-400 line-through">{product.originalPrice} ر.س</span>
              <span className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-sm font-bold">
                وفّر {discount}%
              </span>
            </div>

            {/* Shipping */}
            <p className="mt-3 text-sm">
              {product.freeShipping ? (
                <span className="text-emerald-600 font-medium">✅ شحن مجاني للسعودية</span>
              ) : (
                <span className="text-gray-500">🚚 رسوم الشحن: 15 ر.س</span>
              )}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <span className="text-sm font-bold text-gray-700">الألوان المتاحة:</span>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="px-3 py-1 border border-gray-200 rounded-full text-sm hover:border-blue-500 cursor-pointer transition-colors"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={handleWhatsApp}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                🛒 اطلب الآن عبر واتساب
              </button>
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-colors ${
                  inCart
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {inCart ? '✓ في السلة' : '+ أضف للسلة'}
              </button>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="border-t px-6 md:px-10 py-8">
          <h2 className="text-xl font-bold mb-6">📋 المواصفات التقنية</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {Object.entries(product.specs).map(([key, value], i) => (
              <div
                key={key}
                className={`flex justify-between py-3 px-4 ${
                  i % 2 === 0 ? 'bg-gray-50' : ''
                } rounded-lg`}
              >
                <span className="text-gray-500 text-sm">{key}</span>
                <span className="font-semibold text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">منتجات مشابهة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
