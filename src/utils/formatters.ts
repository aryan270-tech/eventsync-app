import { EventCategory } from '../types/event';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function generateBookingId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `EVT-${randomNum}`;
}

export function generateQRCodeData(bookingId: string, eventTitle: string, name: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    JSON.stringify({ bookingId, eventTitle, attendee: name, verified: true })
  )}`;
}

export function getCategoryStyles(category: EventCategory): { bg: string; text: string; border: string } {
  switch (category) {
    case 'Tech & AI':
      return { bg: 'rgba(59, 130, 246, 0.12)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
    case 'Design & UX':
      return { bg: 'rgba(236, 72, 153, 0.12)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' };
    case 'Business':
      return { bg: 'rgba(16, 185, 129, 0.12)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
    case 'Workshops':
      return { bg: 'rgba(245, 158, 11, 0.12)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
    case 'Music & Art':
      return { bg: 'rgba(168, 85, 247, 0.12)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' };
    default:
      return { bg: 'rgba(156, 163, 175, 0.12)', text: '#9ca3af', border: 'rgba(156, 163, 175, 0.3)' };
  }
}
