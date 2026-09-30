'use client';
import { useEffect } from 'react';
import { trackEvent } from '../../lib/analytics';

export default function ProductAnalytics() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-track]') : null;
      const name = target?.dataset.track;
      if (name === 'click_guide' || name === 'click_how_it_works') trackEvent(name);
    };
    const toggle = (event: Event) => {
      const details = event.target;
      if (details instanceof HTMLDetailsElement && details.open && details.dataset.faq) {
        trackEvent('faq_open', { faq_index: Number(details.dataset.faq) });
      }
    };
    document.addEventListener('click', click);
    document.addEventListener('toggle', toggle, true);
    return () => { document.removeEventListener('click', click); document.removeEventListener('toggle', toggle, true); };
  }, []);
  return null;
}

