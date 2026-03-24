'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

const defaultRules = [
  {
    id: 1,
    category: 'التقييم',
    icon: '⭐',
    title: 'تقييم عالي',
    rules: [
      'الحد الأدنى للتقييم 4.5 نجوم',
      'عدد التقييمات لا يقل عن 1,000 تقييم',
      'نسبة التقييمات السلبية (1-2 نجمة) أقل من 5%',
      'قراءة أحدث 10 تقييمات سلبية والتأكد من عدم وجود مشاكل متكررة',
      'تجنب المنتجات ذات التقييمات المزيفة (تقييمات متشابهة بنفس النص)',
    ],
    color: 'yellow',
  },
  {
    id: 2,
    category: 'الشحن',
    icon: '🚚',
    title: 'شحن سريع - يفضل للسعودية',
    rules: [
      'أولوية للمنتجات التي تشحن من مستودعات السعودية أو الإمارات',
      'إذا لم يتوفر، اختيار الشحن من الصين بخدمة AliExpress Standard أو Cainiao',
      'مدة التوصيل لا تتجاوز 15 يوم عمل للسعودية',
      'تجنب الشحن بـ China Post Ordinary (بطيء جداً 45-60 يوم)',
      'تأكد من وجود رقم تتبع للشحنة',
      'يفضل البائعين الذين يوفرون شحن مجاني للسعودية',
    ],
    color: 'blue',
  },
  {
    id: 3,
    category: 'الصور',
    icon: '📸',
    title: 'صور واضحة واحترافية',
    rules: [
      'المنتج يجب أن يحتوي على 5 صور على الأقل',
      'صور حقيقية وليست رسومات (Real Photos)',
      'وجود صور من زوايا مختلفة وتوضيح الحجم الحقيقي',
      'صور توضح المنتج أثناء الاستخدام (Lifestyle)',
      'وجود صور من العملاء في التقييمات (يدل على جودة المنتج)',
      'تجنب المنتجات بصور مبالغ فيها بالفوتوشوب',
    ],
    color: 'purple',
  },
  {
    id: 4,
    category: 'البائع',
    icon: '🏪',
    title: 'موثوقية البائع',
    rules: [
      'البائع يجب أن يكون "Top Rated" أو تقييمه 95%+ إيجابي',
      'عمر المتجر أكثر من سنة',
      'عدد المتابعين أكثر من 500',
      'نسبة الاستجابة للرسائل أعلى من 90%',
      'تأكد من أن البائع يستجيب خلال 24 ساعة',
      'يفضل البائعين المعتمدين "AliExpress Choice"',
    ],
    color: 'green',
  },
  {
    id: 5,
    category: 'التسعير',
    icon: '💰',
    title: 'قواعد التسعير والربح',
    rules: [
      'هامش الربح لا يقل عن 40% (مثال: تكلفة 28 → بيع 67 = هامش 58%)',
      'مقارنة السعر مع 3 بائعين على الأقل قبل الاختيار',
      'تجنب المنتجات الرخيصة جداً (أقل من 5 ر.س تكلفة) لأن الشحن يكلف أكثر',
      'تحقق من أن السعر المعروض يشمل الضرائب والشحن',
      'ضع سعر "قبل الخصم" أعلى بـ 50-80% من سعر البيع',
      'راجع الأسعار أسبوعياً لأن أسعار علي إكسبريس تتغير',
    ],
    color: 'emerald',
  },
  {
    id: 6,
    category: 'الجودة',
    icon: '✅',
    title: 'معايير جودة المنتج',
    rules: [
      'المنتج يحتوي على وصف تفصيلي ومواصفات واضحة',
      'وجود ضمان من البائع (حماية المشتري)',
      'تجنب المنتجات المقلدة للعلامات التجارية المشهورة',
      'تأكد من أن المنتج يتوافق مع المعايير السعودية (مثال: الشواحن بفولت 220V)',
      'يفضل المنتجات ذات شهادات السلامة (CE, FCC, ESPR)',
      'تأكد من أن المنتج غير مخالف لأنظمة الجمارك السعودية',
    ],
    color: 'teal',
  },
  {
    id: 7,
    category: 'المبيعات',
    icon: '📊',
    title: 'حجم المبيعات والطلب',
    rules: [
      'عدد الطلبات أكثر من 500 طلب (يدل على منتج مجرب)',
      'المنتج في ترند صاعد وليس منتج موسمي منتهي',
      'تحقق من Google Trends لمعرفة الاهتمام بالمنتج في السعودية',
      'تجنب المنتجات ذات المنافسة العالية جداً على أمازون السعودية',
      'ركز على منتجات "مشاكل يومية" يبحث عنها الناس',
      'يفضل المنتجات التي يمكن بيعها طوال السنة',
    ],
    color: 'indigo',
  },
];

const colorMap = {
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', header: 'bg-yellow-100 text-yellow-800', check: 'text-yellow-600', dot: 'bg-yellow-500' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-100 text-blue-800', check: 'text-blue-600', dot: 'bg-blue-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', header: 'bg-purple-100 text-purple-800', check: 'text-purple-600', dot: 'bg-purple-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', header: 'bg-green-100 text-green-800', check: 'text-green-600', dot: 'bg-green-500' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', header: 'bg-emerald-100 text-emerald-800', check: 'text-emerald-600', dot: 'bg-emerald-500' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', header: 'bg-teal-100 text-teal-800', check: 'text-teal-600', dot: 'bg-teal-500' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', header: 'bg-indigo-100 text-indigo-800', check: 'text-indigo-600', dot: 'bg-indigo-500' },
};

export default function AdminGuidelines() {
  const { products, getProductProfit } = useAdmin();
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (ruleId, ruleIndex) => {
    const key = `${ruleId}-${ruleIndex}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Evaluate current products against rules
  const lowRatedProducts = products.filter(p => p.rating < 4.5);
  const lowMarginProducts = products.filter(p => {
    const { margin } = getProductProfit(p);
    return margin < 40;
  });
  const noShippingProducts = products.filter(p => !p.freeShipping);

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const totalRules = defaultRules.reduce((sum, r) => sum + r.rules.length, 0);
  const progress = Math.round((totalChecked / totalRules) * 100);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-800">📋 قواعد اختيار المنتجات</h1>
        <p className="text-gray-500 mt-1">معايير ثابتة لاختيار المنتجات المعروضة في متجر TechBox</p>
      </div>

      {/* Progress & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Checklist Progress */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-sm mb-3">تقدم التحقق من القواعد</h3>
          <div className="relative w-full h-3 bg-gray-200 rounded-full mb-2">
            <div
              className="absolute top-0 right-0 h-3 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{totalChecked} من {totalRules} قاعدة ({progress}%)</p>
        </div>

        {/* Product Alerts */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-sm mb-3">تنبيهات المنتجات</h3>
          <div className="space-y-2 text-sm">
            {lowRatedProducts.length > 0 && (
              <div className="flex items-center gap-2 text-yellow-600">
                <span>⚠️</span>
                <span>{lowRatedProducts.length} منتج تقييمه أقل من 4.5</span>
              </div>
            )}
            {lowMarginProducts.length > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <span>⚠️</span>
                <span>{lowMarginProducts.length} منتج هامش ربحه أقل من 40%</span>
              </div>
            )}
            {noShippingProducts.length > 0 && (
              <div className="flex items-center gap-2 text-blue-600">
                <span>ℹ️</span>
                <span>{noShippingProducts.length} منتج بدون شحن مجاني</span>
              </div>
            )}
            {lowRatedProducts.length === 0 && lowMarginProducts.length === 0 && noShippingProducts.length === 0 && (
              <div className="text-green-600 font-semibold">✅ جميع المنتجات تطابق القواعد</div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-sm mb-3">إحصائيات سريعة</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">متوسط التقييم:</span>
              <span className="font-bold">
                {(products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1)} ⭐
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">متوسط هامش الربح:</span>
              <span className="font-bold">
                {Math.round(products.reduce((s, p) => s + getProductProfit(p).margin, 0) / products.length)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">منتجات بشحن مجاني:</span>
              <span className="font-bold">{products.filter(p => p.freeShipping).length}/{products.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {defaultRules.map((rule) => {
          const colors = colorMap[rule.color] || colorMap.blue;
          const ruleChecked = rule.rules.filter((_, i) => checkedItems[`${rule.id}-${i}`]).length;

          return (
            <div key={rule.id} className={`${colors.bg} border ${colors.border} rounded-2xl overflow-hidden`}>
              {/* Card Header */}
              <div className={`${colors.header} p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{rule.icon}</span>
                  <div>
                    <h3 className="font-extrabold">{rule.title}</h3>
                    <p className="text-xs opacity-70">{rule.category}</p>
                  </div>
                </div>
                <span className="text-sm font-bold">{ruleChecked}/{rule.rules.length}</span>
              </div>

              {/* Checklist */}
              <div className="p-4 space-y-2">
                {rule.rules.map((ruleText, i) => {
                  const key = `${rule.id}-${i}`;
                  const isChecked = checkedItems[key];
                  return (
                    <label
                      key={i}
                      className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                        isChecked ? 'bg-white/80' : 'hover:bg-white/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked || false}
                        onChange={() => toggleCheck(rule.id, i)}
                        className={`w-4 h-4 mt-0.5 accent-current ${colors.check} shrink-0`}
                      />
                      <span className={`text-sm ${isChecked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {ruleText}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Reference */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-lg mb-4">📌 ملخص سريع - قبل إضافة أي منتج</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-3xl mb-2">⭐</p>
            <p className="font-bold text-sm">تقييم 4.5+</p>
            <p className="text-xs text-gray-400">و 1000+ تقييم</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-3xl mb-2">🚚</p>
            <p className="font-bold text-sm">توصيل 15 يوم</p>
            <p className="text-xs text-gray-400">أو أقل للسعودية</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-3xl mb-2">💰</p>
            <p className="font-bold text-sm">هامش 40%+</p>
            <p className="text-xs text-gray-400">الحد الأدنى للربح</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-3xl mb-2">📸</p>
            <p className="font-bold text-sm">5+ صور</p>
            <p className="text-xs text-gray-400">حقيقية واحترافية</p>
          </div>
        </div>
      </div>
    </div>
  );
}
