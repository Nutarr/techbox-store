// غيّر رقم الواتساب هنا
export const WHATSAPP_NUMBER = '966558118653';

export function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, '_blank');
}

export function formatOrderMessage(items, totalPrice) {
  if (items.length === 0) return '';

  let message = '🛒 *طلب جديد من TechBox*\n\n';

  items.forEach((item, i) => {
    message += `${i + 1}. ${item.title}\n`;
    message += `   الكمية: ${item.qty} | السعر: ${item.price * item.qty} ر.س\n`;
    if (item.aliUrl) {
      message += `   🔗 ${item.aliUrl}\n`;
    }
    message += '\n';
  });

  message += '──────────────\n';
  message += `💰 *الإجمالي: ${totalPrice.toLocaleString('ar-SA')} ر.س*\n\n`;
  message += '📱 الاسم: \n';
  message += '📍 المدينة: \n';
  message += '🏠 العنوان: \n';

  return encodeURIComponent(message);
}
