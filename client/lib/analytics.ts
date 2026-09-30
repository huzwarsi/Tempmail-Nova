type ProductEvent = 'generate_email' | 'copy_email' | 'refresh_inbox' | 'receive_email' | 'create_new_address' | 'click_how_it_works' | 'click_guide' | 'faq_open';
type EventParams = { source?: 'automatic' | 'new_address' | 'custom' | 'after_delete'; faq_index?: number };

// Only allow fixed event fields. Never send addresses, message IDs, subjects or bodies.
export function trackEvent(name: ProductEvent, params: EventParams = {}) {
  if (typeof window === 'undefined') return;
  const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void };
  try { analyticsWindow.gtag?.('event', name, params); } catch { /* Analytics must never interrupt the inbox. */ }
}

