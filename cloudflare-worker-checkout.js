export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cookieHeader = request.headers.get('Cookie') || '';

    // Parse cookie safely; prefer the LAST occurrence of browserLang
    const getCookie = (name) => {
      const parts = (cookieHeader || '').split(/;\s*/).filter(Boolean);
      const hits = parts.filter(p => p.toLowerCase().startsWith(name.toLowerCase() + '='));
      if (!hits.length) return null;
      const last = hits[hits.length - 1];
      return decodeURIComponent(last.split('=').slice(1).join('='));
    };

    const cookieLocale = (getCookie('browserLang') || '').toLowerCase();
    const prefixMatch = path.match(/^\/checkout\/([a-z]{2}-[a-z]{2})(\/|$)/i);
    const currentLocaleInPath = prefixMatch ? prefixMatch[1].toLowerCase() : null;

    // Helpers to set/delete cookie across variants
    const setLangCookies = (val) => ([
      `browserLang=${val}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000; Domain=.xaptv.com`,
      `browserLang=${val}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`,
      `browserLang=${val}; Path=/checkout; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000; Domain=.xaptv.com`,
      `browserLang=${val}; Path=/checkout; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`,
    ]);

    const deleteLangCookies = () => ([
      // delete all common variants
      'browserLang=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0; Domain=.xaptv.com',
      'browserLang=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0',
      'browserLang=; Path=/checkout; Secure; HttpOnly; SameSite=Lax; Max-Age=0; Domain=.xaptv.com',
      'browserLang=; Path=/checkout; Secure; HttpOnly; SameSite=Lax; Max-Age=0',
    ]);

    // Debug info
    if (url.searchParams.get('_debug') === '1') {
      return new Response(JSON.stringify({
        path,
        country: request.cf?.country || null,
        cookieLocale,
        currentLocaleInPath
      }, null, 2), { headers: { 'content-type': 'application/json' }});
    }

    // Nuke cookie for testing
    if (url.searchParams.get('_nukeLang') === '1') {
      return new Response(null, {
        status: 204,
        headers: {
          'Cache-Control': 'no-store',
          // multiple Set-Cookie headers
          ...deleteLangCookies().reduce((acc, v, i) => (acc['Set-Cookie' + (i?i:'')] = v, acc), {})
        }
      });
    }

    // Country -> locale map (must match nuxt-i18n)
    const map = {
      ES: 'es-es', PT: 'pt-pt', NL: 'nl-nl', BE: 'nl-nl',
      DE: 'de-de', AT: 'de-de', CH: 'de-de',
      US: 'en-us', GB: 'en-gb', IE: 'en-gb'
    };
    const fallback = 'en-en';
    const country = String(request.cf?.country || '').toUpperCase();
    const target = (map[country] || fallback).toLowerCase();

    const isCheckoutRoot = path === '/checkout' || path === '/checkout/';

    // 1) Root: force geo if cookie missing OR mismatched
    if (isCheckoutRoot && cookieLocale !== target) {
      const dest = `/checkout/${target}/${url.search}`;
      const headers = {
        Location: dest,
        'Cache-Control': 'no-store',
        Vary: 'Cookie, CF-IPCountry'
      };
      // Attach multiple Set-Cookie variants so the origin sees the same thing
      setLangCookies(target).forEach((v, idx) => headers[idx ? ('Set-Cookie' + idx) : 'Set-Cookie'] = v);
      return new Response(null, { status: 302, headers });
    }

    // 2) Locale paths: never redirect; if cookie differs, align cookie and pass through
    if (currentLocaleInPath && cookieLocale !== currentLocaleInPath) {
      const resp = await fetch(request);
      const headers = new Headers(resp.headers);
      setLangCookies(currentLocaleInPath).forEach(v => headers.append('Set-Cookie', v));
      return new Response(resp.body, { status: resp.status, headers });
    }

    // 3) Everything else
    return fetch(request);
  }
}
