'use client';

import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function WhatsAppFloat() {
  const message = encodeURIComponent('مرحباً، أريد الاستفسار عن منتج في TechBox');
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg whatsapp-pulse transition-colors"
      title="تواصل معنا عبر واتساب"
    >
      💬
    </a>
  );
}
