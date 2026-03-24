const features = [
  { icon: '🚚', title: 'شحن مجاني', desc: 'للطلبات فوق 150 ر.س' },
  { icon: '🔄', title: 'إرجاع سهل', desc: 'خلال 30 يوم' },
  { icon: '🔒', title: 'دفع آمن', desc: 'حماية كاملة للمشتري' },
  { icon: '💬', title: 'دعم فني', desc: 'متاح على مدار الساعة' },
];

export default function Features() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-3 hover:shadow-lg transition-shadow"
          >
            <span className="text-3xl shrink-0">{f.icon}</span>
            <div>
              <h4 className="font-bold text-sm sm:text-base">{f.title}</h4>
              <p className="text-xs sm:text-sm text-gray-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
