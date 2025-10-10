import fs from 'fs'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  loading: false,
  publicRuntimeConfig: {
    defaultPid: process.env.defaultPid,
    defaultReselPid: process.env.defaultReselPid,
    newResellerPid: process.env.newResellerPid,
    fraudCheck: process.env.fraudCheck,
    gateway: process.env.gateway,
  },
  server: {
    port: process.env.PORT || 8888, // Changed to 8888
    host: '0.0.0.0', // par défaut: localhost
    timing: false,
    https: {
      key: fs.readFileSync('ssl/privkey.pem'),
      cert: fs.readFileSync('ssl/cert.pem'),
    },
  },
  router: {
    base: process.env.NODE_ENV === 'production' ? '/checkout/' : '/checkout/',
    middleware: ['autoLogin', 'redirections', 'affiliates'],
  },
  head: {
    title: 'XAPTV - CHECKOUT',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      { name: 'referrer', content: 'no-referrer' },
      { hid: 'description', name: 'description', content: '' },
      {
        name: 'theme-color',
        media: '(prefers-color-scheme: light)',
        content: '#0a393a',
      },
      {
        name: 'theme-color',
        media: '(prefers-color-scheme: dark)',
        content: '#0a1929',
      },
      // Safari-specific optimizations
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-touch-fullscreen', content: 'yes' },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon-new.png' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    'assets/scss/header.scss',
    'assets/scss/default.scss',
    'assets/scss/checkout.scss',
    'assets/scss/reseller.scss',
    'assets/scss/selectProduct.scss',
    'assets/scss/animation.scss',
    'assets/scss/addExtraConnect.scss',
    'assets/scss/paymentMethod.scss',
    'assets/scss/waiting.scss',
    'assets/scss/timing.scss',
    'assets/scss/gateway.scss',
    'assets/scss/abord.scss',
    'assets/scss/editOrder.scss',
    'assets/scss/creatingOrder.scss',
    'assets/scss/productNotFound.scss',
    'assets/scss/login/login.scss',
    'assets/scss/upsell/upsell.scss',
    'assets/scss/addons/upsell/updateExtra.scss',
    'assets/scss/addons/upsell/selectProduct.scss',
    'assets/scss/success/success.scss',
    'assets/scss/resellers/success.scss',
    'assets/scss/addons/label.scss',
    'assets/scss/addons/product.scss',
    'assets/scss/addons/resellersProduct.scss',
    'assets/scss/addons/existing.scss',
    'assets/scss/addons/extraConnect.scss',
    'assets/scss/addons/connectionSelector.scss',
    'assets/scss/addons/userInfo.scss',
    'assets/scss/addons/inputData.scss',
    'assets/scss/addons/paymentMethod.scss',
    'assets/scss/addons/pricing.scss',
    'assets/scss/addons/total.scss',
    'assets/scss/addons/infoData.scss',
    'assets/scss/addons/orderDetails.scss',
    'assets/scss/addons/utilitie.scss',
    'assets/scss/addons/orderDetails/includes.scss',
    'assets/scss/addons/orderDetails/discount.scss',
    'assets/scss/addons/waiting/status.scss',
    'assets/scss/addons/waiting/wait.scss',
    'assets/scss/addons/waiting/orderInfo.scss',
    'assets/scss/addons/waiting/timeScroll.scss',
    'assets/scss/addons/waiting/info.scss',
    'assets/scss/addons/waiting/fraud.scss',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/localStorage.js', mode: 'client' },
    // { src: '~/plugins/multiTabState.client.js' },
    { src: '~/plugins/axios.js' },
    { src: '~/plugins/hotjar.client.js', mode: 'client' }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/pwa',
    // '@nuxtjs/color-mode',
    'nuxt-font-loader',
    [
      'nuxt-compress',
      {
        gzip: {
          threshold: 8192,
        },
        brotli: {
          threshold: 8192,
        },
      },
    ],
    [
      '@nuxtjs/google-analytics',
      {
        id: 'G-J05CZBM570',
      },
    ],
  ],

  fontLoader: {
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Sans:wght@400;500;600;700&display=swap',
    prefetch: true,
    preconnect: true,
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    ['@nuxtjs/pwa', { meta: false, icon: false, manifest: false }],
    '@nuxt/content',
    '@nuxtjs/auth',
    'nuxt-i18n',
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
    [
      '@nuxtjs/google-gtag',
      {
        id: 'AW-10890364464',
        // additionalAccounts: [
        //   {
        //     id: 'AW-437268160',
        //   },
        // ],
      },
    ],
  ],

  pwa: {
    icon: {
      source: '/favicon-new.png',
    },
    meta: {
      title: 'XAPTV Checkout',
      theme_color: '#405db1',
      ogType: 'product',
      ogSiteName: 'XAPTV - CHECKOUT',
      ogHost: 'https://web.xaptv.com/checkout/',
    },
  },

  auth: {
    redirect: false,
    strategies: {
      local: {
        token: {
          property: 'userid',
          type: '',
        },
        endpoints: {
          login: {
            url: '/checkout/api/auth',
            method: 'post',
          },
          logout: false,
          user: false,
        },
      },
    },
  },

  // i18n Config
  i18n: {
    seo: false,
    locales: [
      {
        code: 'en-en',
        file: 'en-en.js',
        iso: 'en-en',
        name: 'English',
      },
      {
        code: 'es-es',
        file: 'es-es.js',
        iso: 'es-es',
        name: 'Spanish',
      },
      {
        code: 'pt-pt',
        file: 'pt-pt.js',
        iso: 'pt-pt',
        name: 'Portugueuse',
      },
      {
        code: 'de-de',
        file: 'de-de.js',
        iso: 'de-de',
        name: 'German',
      },
      {
        code: 'nl-nl',
        file: 'nl-nl.js',
        iso: 'nl-nl',
        name: 'Netherlands',
      },
      {
        code: 'en-gb',
        file: 'en-gb.js',
        iso: 'en-gb',
        name: 'English - UK',
      },
      {
        code: 'en-us',
        file: 'en-us.js',
        iso: 'en-us',
        name: 'English - US',
      },
    ],
    fallbackLocale: {
      'en-en': ['en-en'],
      'en-gb': ['en', 'en-gb'],
      'en-us': ['en', 'en-us'],
      'pt-pt': ['pt', 'pt-*'],
      'es-es': ['es', 'es-*'],
      'de-de': ['de', 'de-*'],
      'nl-nl': ['nl', 'nl-*'],
    },
    defaultLocale: 'en-en',
    langDir: 'lang/',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'browserLang',
      alwaysRedirect: false,
    },
  },

  // Express server
  serverMiddleware: ['~/api/app.js', '~/api/affiliate.js'],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
    baseURL: `https://localhost:${process.env.PORT || '2053'}/`,
    browserBaseURL: '/',
  },

  // Content module configuration (https://go.nuxtjs.dev/content-config)
  // content: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    // ....
    babel: {
      plugins: ['@babel/plugin-proposal-optional-chaining'],
    },
  },
}
