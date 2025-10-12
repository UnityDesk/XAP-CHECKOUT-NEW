// server-middleware/geo-locale.js
// Fallback redirect for first visit to /checkout or /checkout/ only.
// Does NOT touch other modules. Preserves query. Avoids loops. Respects i18n cookie.
module.exports = (req, res, next) => {
  try {
    const originalUrl = req.url || '/';

    // Only handle the non-prefixed checkout root: /checkout or /checkout/
    const isCheckoutRoot = originalUrl === '/checkout' || originalUrl === '/checkout/';

    // If not at the checkout root, pass through (do not affect other modules or deep routes)
    if (!isCheckoutRoot) return next();

    // If already locale-prefixed (not the case at root) or has i18n cookie, skip
    const cookies = req.headers.cookie || '';
    const hasLangCookie = /\bbrowserLang=([^;]+)/.test(cookies);
    if (hasLangCookie) return next();

    // Upstream geo headers (may be absent locally; CF handles mapping at edge)
    const country = String(
      req.headers['cf-ipcountry'] ||
      req.headers['x-vercel-ip-country'] ||
      req.headers['x-country-code'] || ''
    ).toUpperCase();

    // Country -> locale map (must exist in i18n locales)
    const map = {
      ES: 'es-es',
      PT: 'pt-pt',
      NL: 'nl-nl',
      BE: 'nl-nl',
      DE: 'de-de',
      AT: 'de-de',
      CH: 'de-de',
      US: 'en-us',
      GB: 'en-gb',
      IE: 'en-gb'
    };
    const fallback = 'en-en';
    const target = map[country] || fallback;

    // Preserve querystring, redirect to /checkout/<locale>/
    const qsIndex = originalUrl.indexOf('?');
    const qs = qsIndex >= 0 ? originalUrl.slice(qsIndex) : '';
    res.statusCode = 302;
    res.setHeader('Location', `/checkout/${target}/${qs}`);
    res.setHeader('Vary', 'Cookie, CF-IPCountry');
    return res.end();
  } catch (e) {
    return next();
  }
};
