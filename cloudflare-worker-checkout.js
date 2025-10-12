export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cookieHeader = request.headers.get('Cookie') || '';

    const getCookie = (name) => {
      const parts = (cookieHeader || '').split(/;\s*/).filter(Boolean);
      const hits = parts.filter(p => p.toLowerCase().startsWith(name.toLowerCase() + '='));
      if (!hits.length) return null;
      return decodeURIComponent(hits[hits.length - 1].split('=').slice(1).join('='));
    };

    const cookieLocale = (getCookie('browserLang') || '').toLowerCase();
    const prefixMatch = path.match(/^\/checkout\/([a-z]{2}-[a-z]{2})(\/|$)/i);
    const currentLocaleInPath = prefixMatch ? prefixMatch[1].toLowerCase() : null;

    // Config
    const DEFAULT_LOCALE = 'en-en';
    const map = {
      DE: 'de-de', AT: 'de-de', CH: 'de-de',
      ES: 'es-es', PT: 'pt-pt',
      NL: 'nl-nl', BE: 'nl-nl',
      US: 'en-us', GB: 'en-gb', IE: 'en-gb'
    };

    // Country → locale (fallback to default)
    const cfCountry = (request.cf && request.cf.country) || request.headers.get('cf-ipcountry') || '';
    const target = (map[String(cfCountry).toUpperCase()] || DEFAULT_LOCALE).toLowerCase();

    const isCheckoutRoot = path === '/checkout' || path === '/checkout/';

    // Debug
    if (url.searchParams.get('_debug') === '1') {
      return new Response(JSON.stringify({
        path, cfCountry: cfCountry || null, target, cookieLocale, currentLocaleInPath
      }, null, 2), { headers: { 'content-type': 'application/json' }});
    }

    // Nuke cookie for testing
    if (url.searchParams.get('_nukeLang') === '1') {
      return new Response(null, {
        status: 204,
        headers: {
          'Set-Cookie': 'browserLang=; Path=/; Max-Age=0; SameSite=Lax; Secure',
          'Cache-Control': 'no-store'
        }
      });
    }

    // 1) Root handling
    if (isCheckoutRoot) {
      // If cookie differs from geo target, fix it
      if (cookieLocale !== target) {
        const headers = {
          'Cache-Control': 'no-store',
          'Vary': 'Cookie, CF-IPCountry',
          'Set-Cookie': `browserLang=${target}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`
        };

        // For non-default locales, redirect to prefixed URL once
        if (target !== DEFAULT_LOCALE) {
          headers['Location'] = `/checkout/${target}/${url.search}`;
          return new Response(null, { status: 302, headers });
        }

        // For default locale, stay on /checkout (no prefix) and just set cookie
        // No redirect: pass through to origin
        const resp = await fetch(request);
        const h = new Headers(resp.headers);
        h.append('Set-Cookie', `browserLang=${target}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`);
        return new Response(resp.body, { status: resp.status, headers: h });
      }

      // Cookie already matches target → just pass through
      return fetch(request);
    }

    // 2) Locale-prefixed paths: never redirect; align cookie if needed
    if (currentLocaleInPath && cookieLocale !== currentLocaleInPath) {
      const resp = await fetch(request);
      const h = new Headers(resp.headers);
      h.append('Set-Cookie', `browserLang=${currentLocaleInPath}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`);
      return new Response(resp.body, { status: resp.status, headers: h });
    }

    // 3) Everything else
    return fetch(request);
  }
}
