// Cloudflare Worker Logic Test Script
// This tests the logic of the Cloudflare Worker without actually deploying it

function simulateCloudflareWorker(request, cf) {
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
    return {
      type: 'debug',
      data: {
        path,
        country: (cf && cf.country) || null,
        cookieLocale,
        currentLocaleInPath
      }
    };
  }

  // Reset cookie (testing helper)
  if (url.searchParams.get('_resetLang') === '1') {
    return {
      type: 'reset',
      status: 204,
      cookie: 'browserLang=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0'
    };
  }

  // Map country -> locale (must match nuxt-i18n locales)
  const map = {
    ES: 'es-es', PT: 'pt-pt', NL: 'nl-nl', BE: 'nl-nl',
    DE: 'de-de', AT: 'de-de', CH: 'de-de',
    US: 'en-us', GB: 'en-gb', IE: 'en-gb'
  };
  const fallback = 'en-en';
  const country = String(cf && cf.country || '').toUpperCase();
  const target = (map[country] || fallback).toLowerCase();

  // 1) Root guard: /checkout or /checkout/
  const isCheckoutRoot = path === '/checkout' || path === '/checkout/';
  if (isCheckoutRoot) {
    // If no cookie or a different cookie, force geo locale and set cookie
    if (!cookieLocale || cookieLocale !== target) {
      const dest = `/checkout/${target}/${url.search}`;
      return {
        type: 'redirect',
        status: 302,
        location: dest,
        cookie: `browserLang=${target}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`
      };
    }
    // If cookieLocale already matches target, just pass through (no redirect)
    return {
      type: 'pass-through',
      message: 'Cookie matches target locale, no redirect needed'
    };
  }

  // 2) Locale paths: never redirect, only align cookie if needed
  if (currentLocaleInPath && cookieLocale !== currentLocaleInPath) {
    return {
      type: 'cookie-align',
      cookie: `browserLang=${currentLocaleInPath}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`
    };
  }

  // 3) Everything else → pass through
  return {
    type: 'pass-through',
    message: 'Request passed through unchanged'
  };
}

// Test cases
const TEST_CASES = [
  {
    name: 'First Visit - Spanish IP',
    request: {
      url: 'https://web.xaptv.com/checkout/',
      headers: new Map()
    },
    cf: { country: 'ES' },
    expected: {
      type: 'redirect',
      location: '/checkout/es-es/',
      cookie: 'browserLang=es-es; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000'
    }
  },
  {
    name: 'First Visit - German IP',
    request: {
      url: 'https://web.xaptv.com/checkout/',
      headers: new Map()
    },
    cf: { country: 'DE' },
    expected: {
      type: 'redirect',
      location: '/checkout/de-de/',
      cookie: 'browserLang=de-de; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000'
    }
  },
  {
    name: 'First Visit - Portuguese IP',
    request: {
      url: 'https://web.xaptv.com/checkout/',
      headers: new Map()
    },
    cf: { country: 'PT' },
    expected: {
      type: 'redirect',
      location: '/checkout/pt-pt/',
      cookie: 'browserLang=pt-pt; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000'
    }
  },
  {
    name: 'First Visit - Dutch IP',
    request: {
      url: 'https://web.xaptv.com/checkout/',
      headers: new Map()
    },
    cf: { country: 'NL' },
    expected: {
      type: 'redirect',
      location: '/checkout/nl-nl/',
      cookie: 'browserLang=nl-nl; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000'
    }
  },
  {
    name: 'First Visit - US IP',
    request: {
      url: 'https://web.xaptv.com/checkout/',
      headers: new Map()
    },
    cf: { country: 'US' },
    expected: {
      type: 'redirect',
      location: '/checkout/en-us/',
      cookie: 'browserLang=en-us; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000'
    }
  },
  {
    name: 'First Visit - UK IP',
    request: {
      url: 'https://web.xaptv.com/checkout/',
      headers: new Map()
    },
    cf: { country: 'GB' },
    expected: {
      type: 'redirect',
      location: '/checkout/en-gb/',
      cookie: 'browserLang=en-gb; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000'
    }
  },
  {
    name: 'First Visit - Unknown Country',
    request: {
      url: 'https://web.xaptv.com/checkout/',
      headers: new Map()
    },
    cf: { country: 'XX' },
    expected: {
      type: 'redirect',
      location: '/checkout/en-en/',
      cookie: 'browserLang=en-en; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000'
    }
  },
  {
    name: 'With Stale Cookie - Force Geo Redirect',
    request: {
      url: 'https://web.xaptv.com/checkout/',
      headers: new Map([['Cookie', 'browserLang=en-en']])
    },
    cf: { country: 'ES' },
    expected: {
      type: 'redirect',
      location: '/checkout/es-es/',
      cookie: 'browserLang=es-es; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000'
    }
  },
  {
    name: 'With Matching Cookie - No Redirect',
    request: {
      url: 'https://web.xaptv.com/checkout/',
      headers: new Map([['Cookie', 'browserLang=es-es']])
    },
    cf: { country: 'ES' },
    expected: {
      type: 'pass-through',
      message: 'Cookie matches target locale, no redirect needed'
    }
  },
  {
    name: 'Locale Path - No Redirect',
    request: {
      url: 'https://web.xaptv.com/checkout/es-es/',
      headers: new Map()
    },
    cf: { country: 'DE' },
    expected: {
      type: 'pass-through'
    }
  },
  {
    name: 'Locale Path - Cookie Alignment',
    request: {
      url: 'https://web.xaptv.com/checkout/de-de/',
      headers: new Map([['Cookie', 'browserLang=en-en']])
    },
    cf: { country: 'ES' },
    expected: {
      type: 'cookie-align',
      cookie: 'browserLang=de-de; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000'
    }
  },
  {
    name: 'Non-Checkout Path - Pass Through',
    request: {
      url: 'https://web.xaptv.com/dashboard',
      headers: new Map()
    },
    cf: { country: 'ES' },
    expected: {
      type: 'pass-through'
    }
  },
  {
    name: 'Debug Endpoint',
    request: {
      url: 'https://web.xaptv.com/checkout/?_debug=1',
      headers: new Map([['Cookie', 'browserLang=es-es']])
    },
    cf: { country: 'ES' },
    expected: {
      type: 'debug',
      data: {
        path: '/checkout/',
        country: 'ES',
        hasLangCookie: true,
        cookieLocale: 'es-es',
        currentLocaleInPath: null
      }
    }
  },
  {
    name: 'Query String Preservation',
    request: {
      url: 'https://web.xaptv.com/checkout/?pid=123&email=test@example.com',
      headers: new Map()
    },
    cf: { country: 'PT' },
    expected: {
      type: 'redirect',
      location: '/checkout/pt-pt/?pid=123&email=test@example.com',
      cookie: 'browserLang=pt-pt; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000'
    }
  },
  {
    name: 'Reset Cookie Helper',
    request: {
      url: 'https://web.xaptv.com/checkout/?_resetLang=1',
      headers: new Map([['Cookie', 'browserLang=es-es']])
    },
    cf: { country: 'ES' },
    expected: {
      type: 'reset',
      status: 204,
      cookie: 'browserLang=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0'
    }
  },
  {
    name: 'Reset Cookie Helper - Any Path',
    request: {
      url: 'https://web.xaptv.com/checkout/es-es/?_resetLang=1',
      headers: new Map([['Cookie', 'browserLang=es-es']])
    },
    cf: { country: 'DE' },
    expected: {
      type: 'reset',
      status: 204,
      cookie: 'browserLang=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0'
    }
  }
];

function runTests() {
  console.log('🧪 Testing Cloudflare Worker Logic...\n');
  
  const results = [];
  
  for (const testCase of TEST_CASES) {
    try {
      console.log(`Testing: ${testCase.name}`);
      
      const result = simulateCloudflareWorker(testCase.request, testCase.cf);
      const success = JSON.stringify(result) === JSON.stringify(testCase.expected);
      
      results.push({
        name: testCase.name,
        success,
        expected: testCase.expected,
        actual: result
      });
      
      if (success) {
        console.log(`✅ PASS`);
      } else {
        console.log(`❌ FAIL`);
        console.log(`Expected: ${JSON.stringify(testCase.expected, null, 2)}`);
        console.log(`Actual: ${JSON.stringify(result, null, 2)}`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${testCase.name} - ${error.message}`);
      results.push({
        name: testCase.name,
        success: false,
        error: error.message
      });
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Generate summary
  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  const passRate = (passedTests / totalTests * 100).toFixed(1);
  
  console.log('📊 Cloudflare Worker Test Summary:');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Pass Rate: ${passRate}%`);
  
  // Check specific requirements
  const redirectTests = results.filter(r => r.actual?.type === 'redirect');
  const passThroughTests = results.filter(r => r.actual?.type === 'pass-through');
  const cookieAlignTests = results.filter(r => r.actual?.type === 'cookie-align');
  const debugTests = results.filter(r => r.actual?.type === 'debug');
  
  console.log('\n🎯 Requirement Verification:');
  console.log(`Redirect logic working: ${redirectTests.every(r => r.success) ? '✅' : '❌'}`);
  console.log(`Pass-through logic working: ${passThroughTests.every(r => r.success) ? '✅' : '❌'}`);
  console.log(`Cookie alignment working: ${cookieAlignTests.every(r => r.success) ? '✅' : '❌'}`);
  console.log(`Debug endpoint working: ${debugTests.every(r => r.success) ? '✅' : '❌'}`);
  
  return results;
}

// Run the tests
if (require.main === module) {
  runTests();
}

module.exports = { simulateCloudflareWorker, runTests };

