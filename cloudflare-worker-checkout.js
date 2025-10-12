export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cookieHeader = request.headers.get('Cookie') || '';

    const getCookie = (name) => {
      const m = cookieHeader.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
      return m ? decodeURIComponent(m[1]) : null;
    };

    const cookieLocale = (getCookie('browserLang') || '').toLowerCase();
    const prefixMatch = path.match(/^\/checkout\/([a-z]{2}-[a-z]{2})(\/|$)/i);
    const currentLocaleInPath = prefixMatch ? prefixMatch[1].toLowerCase() : null;

    // Debug JSON
    if (url.searchParams.get('_debug') === '1') {
      return new Response(JSON.stringify({
        path,
        country: (request.cf && request.cf.country) || null,
        cookieLocale,
        currentLocaleInPath
      }, null, 2), { headers: { 'content-type': 'application/json' }});
    }

    // Reset cookie (testing helper)
    if (url.searchParams.get('_resetLang') === '1') {
      return new Response(null, {
        status: 204,
        headers: {
          'Set-Cookie': 'browserLang=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0',
          'Cache-Control': 'no-store'
        }
      });
    }

    // Map country -> locale (must match nuxt-i18n locales)
    const map = {
      ES: 'es-es', PT: 'pt-pt', NL: 'nl-nl', BE: 'nl-nl',
      DE: 'de-de', AT: 'de-de', CH: 'de-de',
      US: 'en-us', GB: 'en-gb', IE: 'en-gb'
    };
    const fallback = 'en-en';
    const country = String(request.cf && request.cf.country || '').toUpperCase();
    const target = (map[country] || fallback).toLowerCase();

    // 1) Root guard: /checkout or /checkout/
    const isCheckoutRoot = path === '/checkout' || path === '/checkout/';
    if (isCheckoutRoot) {
      // If no cookie or a different cookie, force geo locale and set cookie
      if (!cookieLocale || cookieLocale !== target) {
        const dest = `/checkout/${target}/${url.search}`;
        return new Response(null, {
          status: 302,
          headers: {
            Location: dest,
            'Set-Cookie': `browserLang=${target}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`,
            'Cache-Control': 'no-store',
            Vary: 'Cookie, CF-IPCountry'
          }
        });
      }
      // If cookieLocale already matches target, just pass through (no redirect)
      return fetch(request);
    }

    // 2) Locale paths: never redirect, only align cookie if needed
    if (currentLocaleInPath && cookieLocale !== currentLocaleInPath) {
      const resp = await fetch(request);
      const headers = new Headers(resp.headers);
      headers.append('Set-Cookie', `browserLang=${currentLocaleInPath}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`);
      return new Response(resp.body, { status: resp.status, headers });
    }

    // 3) Everything else → pass through
    return fetch(request);
  }
}
