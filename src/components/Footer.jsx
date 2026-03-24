import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-orange-500 font-bold text-lg mb-4">TechBox</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              وجهتك الأولى للإلكترونيات الأصلية بأسعار مميزة بالريال السعودي. نوفر لك أفضل المنتجات من علي إكسبريس مع شحن سريع ودعم محلي.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-orange-500 font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {['الرئيسية', 'العروض', 'الأكثر مبيعاً', 'جديدنا'].map((link) => (
                <li key={link}>
                  <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-orange-500 font-bold text-lg mb-4">خدمة العملاء</h3>
            <ul className="space-y-2">
              {['تتبع الطلب', 'سياسة الإرجاع', 'الأسئلة الشائعة', 'تواصل معنا'].map((link) => (
                <li key={link}>
                  <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-orange-500 font-bold text-lg mb-4">تواصل معنا</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><span dir="ltr">📧 nutarr@hotmail.com</span></li>
              <li><span dir="ltr">📱 +966558118653</span></li>
              <li>📍 الرياض، المملكة العربية السعودية</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} TechBox - جميع الحقوق محفوظة | المنتجات من علي إكسبريس</p>
        </div>
      </div>
    </footer>
  );
}
