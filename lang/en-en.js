const brunch = {
  withTv: 'XAPTV',
  without: 'XAPTV',
  attach: 'XAPTV',
  attachNoMaj: 'XAPTV',
}

export default {
  resellers: {
    existing: 'Existing Reseller',
    resellerEmail: 'RESELLER EMAIL ADDRESS',
    confirmPass: 'CONFIRM PASSWORD',
    newReseller: 'New Reseller Setup',
    free: 'FREE',
    product: {
      bonus: 'Bonus',
    },
    includes: {
      list: {
        1: 'Reseller Dashboard',
        2: 'API Access',
        3: 'Custom DNS',
        4: '24/7 VIP Support',
        5: 'Free  Trial Accounts',
        6: 'Data Privacy',
      },
    },
    changeEmail: 'Update',
    success: {
      titles: {
        1: 'Your Reseller Dashboard URL',
        2: 'Your reseller TOP-UP Checkout',
      },
      button: 'OPEN URL',
    },
    error: {
      notExisting: 'This account is not linked to any reseller account.',
      existing: 'This account is already linked to a reseller account.',
    },
  },
  currency: {
    id: '2',
    style: 'currency',
    currency: 'EUR',
    symbole: '€',
  },
  title: {
    home: 'XAPTV IPTV Trial 2025 - Free HD Streaming | Best IPTV Service',
    checkout: 'XAPTV IPTV Trial 2025 - Free HD Streaming | Best IPTV Service',
    payment: 'XAPTV IPTV Payment - Secure Checkout | Best IPTV Service 2025',
    success: 'XAPTV IPTV Success - Welcome to Premium Streaming | Best IPTV 2025',
  },
  seo: {
    description: 'Try XAPTV IPTV service free! Get instant access to 10,000+ TV channels, movies & series in HD. No credit card required. Best IPTV trial 2025 with 24/7 support.',
    keywords: 'IPTV trial, IPTV free trial, best IPTV 2025, IPTV service, streaming TV, HD channels, IPTV Europe, IPTV USA, IPTV UK, IPTV Germany, IPTV Spain, IPTV Netherlands, IPTV Portugal, IPTV streaming, live TV, premium IPTV, IPTV subscription',
    ogTitle: 'XAPTV IPTV Trial 2025 - Free HD Streaming | Best IPTV Service',
    ogDescription: 'Try XAPTV IPTV service free! Get instant access to 10,000+ TV channels, movies & series in HD. No credit card required. Best IPTV trial 2025.',
    twitterTitle: 'XAPTV IPTV Trial 2025 - Free HD Streaming',
    twitterDescription: 'Try XAPTV IPTV service free! 10,000+ TV channels, movies & series in HD. No credit card required.',
  },
  success: {
    welcome: 'Welcome to ' + brunch.withTv + ' Family 🎉',
    description:
      'Below your find your IPTV login information, please insert them in your favorite IPTV app, or use them to connect our Web TV Player, if you need any support, just send us an email at',
    label: {
      server: 'SERVER HOSTNAME',
      username: 'USERNAME',
      password: 'PASSWORD',
      url: 'M3U URL',
      hostname: 'SERVER HOSTNAME',
      macaddress: 'MAC ADDRESS',
    },
    button: {
      download: 'DOWNLOAD M3U',
      login: 'Login to your Customer Dashboard',
      add: 'ADD MAC',
      update: 'UPDATE MAC',
      success: 'SUCCESS!',
      failed: 'FAILED!',
    },
    setup: 'MAG Device Setup',
    recommanded: 'Our Recommended Apps ❤️',
    manage:
      'To manage your subscription you can log in to our customers dashboard by clicking to button below',
    notice:
      'You gonna need your email address and the password you choose during signup to login.',
    m3u: 'M3U URL',
    xtream: 'XTREAM API LOGIN DETAILS',
    mag: 'MAG Device Setup',
    utilite: {
      openTicket: 'Open Ticket',
      reportChannel: 'Report Channel',
      membersArea: 'Members Area',
      extraConnection: 'Extra Device',
    },
  },
  checkout: {
    optional: 'Optional',
    monthPass: 'Month Pass',
    monthsPass: 'Months Pass',
    choose: 'Choose Your Plan',
    off: 'OFF TODAY',
    lastSold: 'Last Sold',
    ago: 'ago',
    perMonth: 'per month',
    save: 'Save',
    optionalAddons: 'Select Addons',
    guaranteeBack: '-day money-back guarantee',
    extraConnection: {
      title: 'Extra Device',
      description: {
        pid: 'Multiple devices at the same time',
        noPid: 'Use your IPTV on multiple devices at the same time',
      },
    },
    connectionSelector: {
      title: 'Connection Count',
      description: 'Choose how many simultaneous connections you need',
      connections: 'Connections',
    },
    proxyProtection: {
      title: 'Proxy Protection',
      description: {
        pid: 'Protect your privacy',
        noPid:
          'Built-in proxy to hide your internet traffic and ensure privacy',
      },
    },
    promoCode: 'Have Promo Code? Click Here',
    month: 'month',
    selectPayment: 'Select Payment Method',
    emailAddress: {
      label: 'EMAIL ADDRESS',
      placeholder: 'Your email address',
    },
    password: {
      label: 'PASSWORD',
      placeholder: 'Must be have more than 8 characters',
    },
    moneyBack: "You're 100% backed by our 30-day money-back guarantee.",
    total: 'Total',
    continue: 'CONTINUE',
    discount: {
      placeholder: 'Promotional Code',
    },
    gateway: {
      credit: 'Credit Card | Credit Card #{count}',
      crypto: 'Cryptocurrency',
    },
    apply: 'Apply',
    includes: {
      title: 'Your Plan Includes:',
      list: {
        1: '+10,000 TV Channels',
        2: '+10,000 Movies & Series',
        3: '24/7 Customer Support',
        4: 'Management Dashboard',
        5: 'Anti-Buffering V4',
        6: 'Multi-Devices Support',
        7: 'Money-Back Guarantee',
      },
    },
  },
  waiting: {
    awaiting: 'Awaiting for payment…',
    orderFraud:
      'Your order has been flagged as fraud. Please try again or contact us!',
    orderid: 'Order ID',
    package: 'Package',
    price: 'Price',
    cancelOrder: 'Cancel order',
  },
}
