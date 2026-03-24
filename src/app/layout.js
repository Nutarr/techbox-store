import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
  title: 'TechBox | أفضل الإلكترونيات من علي إكسبريس',
  description: 'متجرك الأول للإلكترونيات الأصلية بأسعار مميزة بالريال السعودي مع شحن سريع من علي إكسبريس',
  keywords: 'إلكترونيات, علي إكسبريس, سماعات, شواحن, ساعات ذكية, هواتف, السعودية',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-tajawal bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
