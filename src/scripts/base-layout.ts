/// Base layout scriptes
import { fetchAndShow } from '@/utils/vercount';

// Install service worker
document.addEventListener('DOMContentLoaded', async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration: ServiceWorkerRegistration =
        await navigator.serviceWorker.register('/sw.js', { scope: '/' });

      await registration.update();

      registration.addEventListener('updatefound', (): void => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        console.debug('[SW Cache] Updated');
      });
    } catch (err: unknown) {
      console.error(err);
    }
  }
});

// On page load
document.addEventListener('astro:page-load', (): void => {
  // Add smooth scrolling for article anchors
  document
    .querySelectorAll<HTMLAnchorElement>(
      'article a:not([data-smooth-scrolling])'
    )
    .forEach((el: HTMLAnchorElement): void => {
      // If not an anchor
      if (!el.getAttribute('href')?.startsWith('#')) {
        return;
      }

      // Add listener
      el.addEventListener('click', (ev: MouseEvent): void => {
        ev.preventDefault();

        // Get target element
        const target: HTMLElement | null = document.querySelector(
          el.getAttribute('href')!
        );
        if (target === null) {
          return;
        }

        // Scroll to element
        window.scrollTo({
          top: window.scrollY + target.getBoundingClientRect().top - 80,
          behavior: 'smooth'
        });
      });

      // Update attribute
      el.setAttribute('data-smooth-scrolling', '');
    });

  // Show site count
  fetchAndShow();
});
