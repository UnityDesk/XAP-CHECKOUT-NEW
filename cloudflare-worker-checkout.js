export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cookieHeader = request.headers.get('Cookie') || '';
    const getCookie = (name) => {
      const m = cookieHeader.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
      return m ? decodeURIComponent(m[1]) : null;
    };

    const hasLangCookie = !!getCookie('browserLang');
    const localePrefixMatch = path.match(/^\/checkout\/([a-z]{2}-[a-z]{2})(\/|$)/i);
    const currentLocaleInPath = localePrefixMatch ? localePrefixMatch[1].toLowerCase() : null;

    // Debug endpoint
    if (url.searchParams.get('_debug') === '1') {
      return new Response(JSON.stringify({
        path,
        country: request.cf?.country || null,
        hasLangCookie,
        cookieLocale: getCookie('browserLang'),
        currentLocaleInPath,
      }, null, 2), { headers: { 'content-type': 'application/json' }});
    }

    // Country → locale map
    const map = {
      ES: 'es-es', PT: 'pt-pt', NL: 'nl-nl', BE: 'nl-nl',
      DE: 'de-de', AT: 'de-de', CH: 'de-de',
      US: 'en-us', GB: 'en-gb', IE: 'en-gb'
    };
    const fallback = 'en-en';
    const country = (request.cf && request.cf.country || '').toUpperCase();
    const target = map[country] || fallback;

    // Redirect from /checkout if no cookie
    const isCheckoutRoot = path === '/checkout' || path === '/checkout/';
    if (isCheckoutRoot && !hasLangCookie) {
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

    // Align cookie if on locale path
    if (currentLocaleInPath && getCookie('browserLang') !== currentLocaleInPath) {
      const resp = await fetch(request);
      const newHeaders = new Headers(resp.headers);
      newHeaders.append('Set-Cookie', `browserLang=${currentLocaleInPath}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`);
      return new Response(resp.body, { status: resp.status, headers: newHeaders });
    }

    return fetch(request);
  }
}
