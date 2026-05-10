import { useEffect } from 'react';

/**
 * Force <html dir="ltr"> while the calling component is mounted.
 *
 * The public site's language toggle sets document.documentElement.dir = 'rtl'
 * when Arabic is active. That attribute persists across Inertia navigations,
 * so an admin/auth page entered after viewing the site in Arabic would
 * inherit the rtl direction and mirror its layout. Admin chrome is LTR-only.
 *
 * On unmount the previous direction is restored based on the current `lang`
 * attribute so navigating back to the public site keeps the user's locale.
 */
export function useForceLtr(): void {
  useEffect(() => {
    const html = document.documentElement;
    html.dir = 'ltr';
    return () => {
      html.dir = html.lang === 'ar' ? 'rtl' : 'ltr';
    };
  }, []);
}
