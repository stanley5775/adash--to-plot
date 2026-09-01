export const WHATSAPP_NUMBER = "2347084038831";
export const WHATSAPP_DISPLAY_NUMBER = "+234 708 403 8821";

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
