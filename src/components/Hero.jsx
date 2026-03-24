export default function Hero() {
  return (
    <section className="bg-gradient-to-l from-indigo-500 via-purple-600 to-indigo-700 text-white py-12 px-4 sm:px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
          أفضل الإلكترونيات بأسعار لا تُقاوم
        </h1>
        <p className="text-lg opacity-90 mb-6">
          منتجات أصلية من علي إكسبريس بأسعار مميزة بالريال السعودي مع شحن سريع
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: '✅', text: 'منتجات أصلية' },
            { icon: '🚚', text: 'شحن سريع للسعودية' },
            { icon: '💰', text: 'أسعار بالريال' },
            { icon: '🔒', text: 'دفع آمن' },
          ].map((f) => (
            <span
              key={f.text}
              className="bg-white/15 px-4 py-2 rounded-full text-sm flex items-center gap-2"
            >
              {f.icon} {f.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
