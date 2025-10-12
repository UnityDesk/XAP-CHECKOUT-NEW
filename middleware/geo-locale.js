// middleware/geo-locale.js
export default function ({ req, app, route, redirect }) {
  if (!req) return;

  const i18n = app.i18n;
  const cookieKey =
    (i18n && i18n.options && i18n.options.detectBrowserLanguage && i18n.options.detectBrowserLanguage.cookieKey) ||
    'browserLang';

  const cookieHeader = req.headers.cookie || '';
  if (cookieHeader.includes(`${cookieKey}=`)) return;

  const locales = (i18n && i18n.locales ? i18n.locales.map(l => (typeof l === 'string' ? l : l.code)) : []);
  const path = (route && route.fullPath) || '';
  const hasPrefix = locales.some(code => path === `/${code}` || path.startsWith(`/${code}/`));
  if (hasPrefix) return;

  const country = (req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || req.headers['x-country-code'] || '').toUpperCase();

  const map = {
    ES: 'es-es',
    DE: 'de-de',
    AT: 'de-de',
    CH: 'de-de',
    NL: 'nl-nl',
    BE: 'nl-nl',
    PT: 'pt-pt',
    US: 'en-us',
    GB: 'en-gb',
    IE: 'en-gb',
    AU: 'en-en',
    NZ: 'en-en',
    CA: 'en-en'
  };

  let target = map[country];
  if (!target || !locales.includes(target)) {
    target = (i18n && i18n.defaultLocale) || 'en-en';
  }

  const dest = app.localePath({ name: route.name, params: route.params, query: route.query }, target);
  if (dest && dest !== path) {
    return redirect(dest);
  }
}
