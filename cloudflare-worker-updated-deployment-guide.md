# Updated Cloudflare Worker Deployment Guide - Geolocation Priority

## 🎯 **Overview**

This updated Cloudflare Worker handles IP-based language routing for the `/checkout` route with **geolocation taking precedence** over stale cookies, preventing redirect loops and correctly setting the `browserLang` cookie based on the user's IP country.

## 📋 **Key Changes**

### ✅ **Geolocation Priority**
- **Root Paths**: Geolocation takes precedence over stale cookies
- **Stale Cookie Override**: If cookie doesn't match geolocation, force redirect
- **Matching Cookie**: If cookie matches geolocation, no redirect needed
- **Locale Paths**: Never redirect, only align cookie if needed

### ✅ **New Features**
- **Reset Helper**: `_resetLang=1` query param to clear cookie for testing
- **Enhanced Debug**: Improved debug endpoint with cleaner JSON output
- **Better Logic**: More precise cookie handling and geolocation priority

## 🚀 **Deployment Steps**

### **1. Update Existing Worker**

1. **Login to Cloudflare Dashboard**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages**

2. **Update Worker Code**
   - Find your existing `checkout-language-router` worker
   - Click **Edit Code**
   - Replace the code with the updated version from `cloudflare-worker-checkout.js`
   - Click **Save and Deploy**

### **2. Verify Route Configuration**

1. **Check Route**
   - Go to **Workers & Pages** → **checkout-language-router**
   - Click **Settings** → **Triggers**
   - Ensure route is: `*.xaptv.com/checkout*`

## 🧪 **Testing Scenarios**

### **1. First Visit (No Cookie)**
```bash
# Spanish IP → Spanish locale
curl -H "CF-IPCountry: ES" https://web.xaptv.com/checkout/
# Expected: 302 redirect to /checkout/es-es/

# German IP → German locale
curl -H "CF-IPCountry: DE" https://web.xaptv.com/checkout/
# Expected: 302 redirect to /checkout/de-de/
```

### **2. With Stale Cookie (Force Geo Redirect)**
```bash
# Stale cookie gets overridden by geolocation
curl -H "Cookie: browserLang=en-en" -H "CF-IPCountry: ES" https://web.xaptv.com/checkout/
# Expected: 302 redirect to /checkout/es-es/ (geolocation takes precedence)

# Different country, stale cookie
curl -H "Cookie: browserLang=es-es" -H "CF-IPCountry: DE" https://web.xaptv.com/checkout/
# Expected: 302 redirect to /checkout/de-de/
```

### **3. With Matching Cookie (No Redirect)**
```bash
# Cookie matches geolocation, no redirect needed
curl -H "Cookie: browserLang=es-es" -H "CF-IPCountry: ES" https://web.xaptv.com/checkout/
# Expected: No redirect, normal response

# Cookie matches geolocation
curl -H "Cookie: browserLang=de-de" -H "CF-IPCountry: DE" https://web.xaptv.com/checkout/
# Expected: No redirect, normal response
```

### **4. Locale Path (No Redirect)**
```bash
# Already on locale path
curl https://web.xaptv.com/checkout/es-es/
# Expected: No redirect, cookie aligned if needed

# Locale path with different cookie
curl -H "Cookie: browserLang=en-en" https://web.xaptv.com/checkout/de-de/
# Expected: No redirect, cookie aligned to de-de
```

### **5. Reset Helper (Testing)**
```bash
# Clear cookie for testing
curl https://web.xaptv.com/checkout/?_resetLang=1
# Expected: 204 response, cookie cleared

# Clear cookie from any path
curl https://web.xaptv.com/checkout/es-es/?_resetLang=1
# Expected: 204 response, cookie cleared
```

### **6. Debug Endpoint**
```bash
# Diagnostic information
curl https://web.xaptv.com/checkout/?_debug=1
# Expected: JSON with path, country, cookie info

# Debug with cookie
curl -H "Cookie: browserLang=es-es" https://web.xaptv.com/checkout/?_debug=1
# Expected: JSON showing cookie and geolocation info
```

## 🔍 **Debug Information**

### **Updated Debug Response**
```json
{
  "path": "/checkout/",
  "country": "ES",
  "cookieLocale": "es-es",
  "currentLocaleInPath": null
}
```

### **Debug Scenarios**
- **First Visit**: `cookieLocale: ""`, `country: "ES"`
- **Stale Cookie**: `cookieLocale: "en-en"`, `country: "ES"` → Will redirect
- **Matching Cookie**: `cookieLocale: "es-es"`, `country: "ES"` → No redirect
- **Locale Path**: `currentLocaleInPath: "es-es"` → No redirect

## ⚠️ **Troubleshooting**

### **Common Issues**

#### **1. Stale Cookie Not Overridden**
- **Cause**: Cookie logic not updated
- **Solution**: Ensure new Worker code is deployed
- **Fix**: Check that `cookieLocale !== target` condition is working

#### **2. Unexpected Redirects**
- **Cause**: Cookie matching logic incorrect
- **Solution**: Check debug endpoint for cookie vs country mismatch
- **Fix**: Verify cookie and country values in debug output

#### **3. Reset Helper Not Working**
- **Cause**: Query param not recognized
- **Solution**: Check `_resetLang=1` parameter
- **Fix**: Ensure parameter is properly parsed

### **Debug Steps**

1. **Check Geolocation Priority**
   ```bash
   curl -H "Cookie: browserLang=en-en" -H "CF-IPCountry: ES" https://web.xaptv.com/checkout/?_debug=1
   ```

2. **Test Reset Helper**
   ```bash
   curl https://web.xaptv.com/checkout/?_resetLang=1
   ```

3. **Verify Cookie Alignment**
   ```bash
   curl -H "Cookie: browserLang=en-en" https://web.xaptv.com/checkout/es-es/?_debug=1
   ```

## 📊 **Behavior Changes**

### **Before (Old Behavior)**
- Cookie presence prevented all redirects
- Stale cookies could override geolocation
- No way to clear cookies for testing

### **After (New Behavior)**
- Geolocation takes precedence at root paths
- Stale cookies get overridden by geolocation
- Reset helper for testing
- Better debug information

### **Migration Impact**
- **Existing Users**: Will be redirected to correct locale based on geolocation
- **Stale Cookies**: Automatically updated to match geolocation
- **Testing**: Easier to test different scenarios with reset helper

## 🎯 **Success Criteria**

### **Functional Requirements**
- ✅ Geolocation takes precedence over stale cookies at root
- ✅ Matching cookies prevent unnecessary redirects
- ✅ Locale paths never redirect
- ✅ Reset helper clears cookies for testing
- ✅ Enhanced debug information

### **Performance Requirements**
- ✅ Fast response times (< 100ms)
- ✅ Efficient cookie handling
- ✅ Proper caching headers
- ✅ Minimal processing overhead

### **Security Requirements**
- ✅ Secure cookie settings
- ✅ Input validation
- ✅ No XSS vulnerabilities
- ✅ CSRF protection

## 🔧 **Integration**

### **Compatibility**
- **Server Middleware**: Still works as fallback
- **i18n System**: Compatible with existing cookie system
- **Existing Cookies**: Automatically updated to match geolocation

### **Testing**
- **Reset Helper**: Use `_resetLang=1` to clear cookies
- **Debug Endpoint**: Use `_debug=1` to see current state
- **Geolocation**: Test with different `CF-IPCountry` headers

## 📝 **Maintenance**

### **Regular Tasks**
- **Monitor Logs**: Check for geolocation vs cookie conflicts
- **Test Scenarios**: Use reset helper to test different countries
- **Debug Issues**: Use debug endpoint to troubleshoot problems
- **Update Mappings**: Add new countries as needed

### **Updates**
- **Country Mappings**: Update as business expands
- **Cookie Settings**: Adjust expiration or security as needed
- **Debug Features**: Add more diagnostic information if required

---

*Updated Deployment Guide for Geolocation Priority*
*Status: Ready for deployment*
*Key Change: Geolocation takes precedence over stale cookies*
