# Cloudflare Worker Deployment Guide for Checkout Language Routing

## 🎯 **Overview**

This Cloudflare Worker handles IP-based language routing for the `/checkout` route, preventing redirect loops and correctly setting the `browserLang` cookie based on the user's IP country.

## 📋 **Features**

### ✅ **Core Functionality**
- **Path Gating**: Only handles `/checkout` and `/checkout/` (root paths)
- **Cookie Respect**: No redirects if `browserLang` cookie exists
- **IP-based Routing**: Maps countries to appropriate locales
- **Cookie Alignment**: Ensures cookie matches current locale path
- **Debug Endpoint**: Provides diagnostics with `_debug=1` query param

### ✅ **Country Mapping**
```javascript
const map = {
  ES: 'es-es',    // Spain → Spanish
  PT: 'pt-pt',    // Portugal → Portuguese
  NL: 'nl-nl',    // Netherlands → Dutch
  BE: 'nl-nl',    // Belgium → Dutch
  DE: 'de-de',    // Germany → German
  AT: 'de-de',    // Austria → German
  CH: 'de-de',    // Switzerland → German
  US: 'en-us',    // United States → English US
  GB: 'en-gb',    // United Kingdom → English UK
  IE: 'en-gb'     // Ireland → English UK
};
const fallback = 'en-en'; // Default fallback
```

## 🚀 **Deployment Steps**

### **1. Create Cloudflare Worker**

1. **Login to Cloudflare Dashboard**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages**

2. **Create New Worker**
   - Click **Create application**
   - Select **Create Worker**
   - Name it: `checkout-language-router`

3. **Deploy the Code**
   - Copy the code from `cloudflare-worker-checkout.js`
   - Paste it into the Worker editor
   - Click **Save and Deploy**

### **2. Configure Route**

1. **Add Route**
   - Go to **Workers & Pages** → **checkout-language-router**
   - Click **Settings** → **Triggers**
   - Click **Add Route**

2. **Route Configuration**
   - **Route**: `*.xaptv.com/checkout*`
   - **Zone**: Select your domain (xaptv.com)
   - **Environment**: Production

### **3. Environment Variables (Optional)**

If you need to customize the behavior, you can add environment variables:

- `FALLBACK_LOCALE`: Default locale (default: `en-en`)
- `COOKIE_NAME`: Cookie name (default: `browserLang`)
- `COOKIE_MAX_AGE`: Cookie expiration in seconds (default: `31536000`)

## 🔧 **Configuration**

### **Route Patterns**
```
*.xaptv.com/checkout*    # Matches all checkout paths
```

### **Cookie Settings**
```javascript
`browserLang=${target}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`
```

- **Path**: `/` (available site-wide)
- **Secure**: Only sent over HTTPS
- **HttpOnly**: Not accessible via JavaScript
- **SameSite**: Lax (CSRF protection)
- **Max-Age**: 1 year (31536000 seconds)

## 🧪 **Testing**

### **1. Debug Endpoint**

Add `_debug=1` to any checkout URL to see diagnostic information:

```
https://web.xaptv.com/checkout/?_debug=1
```

**Response Example**:
```json
{
  "path": "/checkout/",
  "country": "ES",
  "hasLangCookie": false,
  "cookieLocale": null,
  "currentLocaleInPath": null
}
```

### **2. Test Scenarios**

#### **First Visit (No Cookie)**
```bash
# Clear cookies and visit from Spain
curl -H "CF-IPCountry: ES" https://web.xaptv.com/checkout/
# Expected: 302 redirect to /checkout/es-es/
```

#### **With Cookie**
```bash
# Visit with existing cookie
curl -H "Cookie: browserLang=en-en" https://web.xaptv.com/checkout/
# Expected: No redirect, normal response
```

#### **Locale Path**
```bash
# Visit existing locale path
curl https://web.xaptv.com/checkout/de-de/
# Expected: No redirect, cookie aligned if needed
```

### **3. Country Testing**

Test different countries by setting the `CF-IPCountry` header:

```bash
# Spain → Spanish
curl -H "CF-IPCountry: ES" https://web.xaptv.com/checkout/

# Germany → German  
curl -H "CF-IPCountry: DE" https://web.xaptv.com/checkout/

# Portugal → Portuguese
curl -H "CF-IPCountry: PT" https://web.xaptv.com/checkout/

# Netherlands → Dutch
curl -H "CF-IPCountry: NL" https://web.xaptv.com/checkout/

# United States → English US
curl -H "CF-IPCountry: US" https://web.xaptv.com/checkout/

# United Kingdom → English UK
curl -H "CF-IPCountry: GB" https://web.xaptv.com/checkout/

# Unknown country → English (fallback)
curl -H "CF-IPCountry: XX" https://web.xaptv.com/checkout/
```

## 🔍 **Monitoring & Debugging**

### **1. Worker Logs**

- Go to **Workers & Pages** → **checkout-language-router**
- Click **Logs** to see real-time execution logs
- Filter by `checkout` to see relevant requests

### **2. Analytics**

- **Workers & Pages** → **checkout-language-router** → **Analytics**
- Monitor request volume, response times, and errors
- Track redirect patterns and country distribution

### **3. Debug Information**

Use the `_debug=1` endpoint to troubleshoot:

```javascript
// Example debug response
{
  "path": "/checkout/",
  "country": "ES",
  "hasLangCookie": true,
  "cookieLocale": "en-en",
  "currentLocaleInPath": null
}
```

## ⚠️ **Troubleshooting**

### **Common Issues**

#### **1. Redirect Loops**
- **Cause**: Worker redirecting from locale paths
- **Solution**: Check route pattern - should be `*.xaptv.com/checkout*`
- **Fix**: Ensure `currentLocaleInPath` logic is working

#### **2. Cookie Not Set**
- **Cause**: Cookie settings too restrictive
- **Solution**: Check `SameSite`, `Secure`, and `Path` settings
- **Fix**: Ensure HTTPS is used and domain matches

#### **3. Wrong Locale**
- **Cause**: Country mapping incorrect
- **Solution**: Check `CF-IPCountry` header value
- **Fix**: Verify country codes in mapping object

#### **4. Non-Checkout Paths Affected**
- **Cause**: Route pattern too broad
- **Solution**: Ensure route is `*.xaptv.com/checkout*`
- **Fix**: Check `isCheckoutRoot` logic

### **Debug Steps**

1. **Check Route Pattern**
   ```
   *.xaptv.com/checkout*  # Should only match checkout paths
   ```

2. **Verify Country Detection**
   ```bash
   curl -H "CF-IPCountry: ES" https://web.xaptv.com/checkout/?_debug=1
   ```

3. **Test Cookie Logic**
   ```bash
   curl -H "Cookie: browserLang=es-es" https://web.xaptv.com/checkout/?_debug=1
   ```

4. **Check Locale Path Detection**
   ```bash
   curl https://web.xaptv.com/checkout/es-es/?_debug=1
   ```

## 📊 **Performance**

### **Optimizations**
- **Minimal Processing**: Only processes checkout root paths
- **Efficient Regex**: Simple pattern matching for locale detection
- **Cookie Caching**: Respects existing cookies to avoid unnecessary processing
- **Fast Redirects**: 302 redirects with proper caching headers

### **Metrics to Monitor**
- **Request Volume**: Number of checkout requests
- **Redirect Rate**: Percentage of requests that get redirected
- **Country Distribution**: Most common countries visiting checkout
- **Error Rate**: Failed requests or redirect loops

## 🔒 **Security**

### **Cookie Security**
- **HttpOnly**: Prevents XSS attacks
- **Secure**: Only sent over HTTPS
- **SameSite=Lax**: CSRF protection
- **Path=/**: Available site-wide for consistency

### **Input Validation**
- **Country Codes**: Validated against known mappings
- **Locale Paths**: Regex validation for locale format
- **Cookie Values**: URL decoded safely

## 🎯 **Success Criteria**

### **Functional Requirements**
- ✅ Redirects from `/checkout` to `/checkout/{locale}/` on first visit
- ✅ Respects existing `browserLang` cookie
- ✅ Maps countries to correct locales
- ✅ Aligns cookie with current locale path
- ✅ Provides debug information
- ✅ No redirect loops or side effects

### **Performance Requirements**
- ✅ Fast response times (< 100ms)
- ✅ Minimal processing overhead
- ✅ Efficient cookie handling
- ✅ Proper caching headers

### **Security Requirements**
- ✅ Secure cookie settings
- ✅ Input validation
- ✅ No XSS vulnerabilities
- ✅ CSRF protection

## 📝 **Maintenance**

### **Regular Tasks**
- **Monitor Logs**: Check for errors or unusual patterns
- **Update Mappings**: Add new countries as needed
- **Performance Review**: Monitor response times and error rates
- **Security Audit**: Review cookie settings and input validation

### **Updates**
- **Country Mappings**: Update as business expands to new regions
- **Cookie Settings**: Adjust expiration or security settings as needed
- **Debug Features**: Add more diagnostic information if required

---

*Deployment Guide created for Cloudflare Worker checkout language routing*
*Status: Ready for deployment*
