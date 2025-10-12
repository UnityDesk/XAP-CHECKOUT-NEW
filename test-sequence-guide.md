# Test Sequence Guide - Cloudflare Worker Implementation

## 🎯 **Test Sequence Overview**

This guide provides the exact test sequence to validate the Cloudflare Worker implementation with geolocation priority and cookie normalization.

## 📋 **Prerequisites**

- Cloudflare Worker deployed with updated code
- Nuxt.js application built and deployed
- Access to `https://web.xaptv.com` domain
- Incognito/private browsing mode for clean testing

## 🧪 **Test Sequence**

### **Step 1: Verify Geolocation Detection**
```bash
# Test Cloudflare geolocation detection
curl https://web.xaptv.com/cdn-cgi/trace
```
**Expected Result**: Should show `loc=DE` (or your current country code)

### **Step 2: Clear All Cookies (Nuke Helper)**
```bash
# Clear all browserLang cookie variants
curl https://web.xaptv.com/checkout/?_nukeLang=1
```
**Expected Result**: 
- Status: `204 No Content`
- Multiple `Set-Cookie` headers to clear all cookie variants
- All `browserLang` cookies should be cleared

### **Step 3: Verify Cookie is Cleared**
```bash
# Check debug info after nuking cookies
curl https://web.xaptv.com/checkout/?_debug=1
```
**Expected Result**:
```json
{
  "path": "/checkout/",
  "country": "DE",
  "cookieLocale": "",
  "currentLocaleInPath": null
}
```
- `cookieLocale` should be empty string `""`
- `country` should match your location (e.g., "DE")

### **Step 4: Test First Visit Redirect**
```bash
# Visit checkout root - should redirect to geolocation-based locale
curl -L https://web.xaptv.com/checkout/
```
**Expected Result**:
- Status: `302 Found` (redirect)
- Location: `/checkout/de-de/` (or appropriate locale for your country)
- Multiple `Set-Cookie` headers setting `browserLang` to target locale

### **Step 5: Verify Locale Path Stability**
```bash
# Visit locale path directly - should not redirect
curl https://web.xaptv.com/checkout/de-de/
```
**Expected Result**:
- Status: `200 OK` (no redirect)
- Page loads normally in German locale
- Cookie should be aligned to `de-de` if different

### **Step 6: Verify Cookie Persistence**
```bash
# Check debug info with cookie set
curl https://web.xaptv.com/checkout/?_debug=1
```
**Expected Result**:
```json
{
  "path": "/checkout/",
  "country": "DE",
  "cookieLocale": "de-de",
  "currentLocaleInPath": null
}
```
- `cookieLocale` should be `"de-de"` (or your locale)
- Cookie should persist from previous visit

### **Step 7: Test Stale Cookie Override**
```bash
# Set a different cookie and test geolocation priority
curl -H "Cookie: browserLang=es-es" https://web.xaptv.com/checkout/?_debug=1
```
**Expected Result**:
```json
{
  "path": "/checkout/",
  "country": "DE",
  "cookieLocale": "es-es",
  "currentLocaleInPath": null
}
```

```bash
# Now visit root - should override stale cookie with geolocation
curl -H "Cookie: browserLang=es-es" https://web.xaptv.com/checkout/
```
**Expected Result**:
- Status: `302 Found` (redirect)
- Location: `/checkout/de-de/` (geolocation takes precedence)
- Cookie updated to `browserLang=de-de`

## 🔍 **Debug Endpoints**

### **Debug Information**
```bash
# Get current state
curl https://web.xaptv.com/checkout/?_debug=1
```

### **Nuke Cookies**
```bash
# Clear all cookie variants
curl https://web.xaptv.com/checkout/?_nukeLang=1
```

## 📊 **Expected Behaviors**

### **Root Path (`/checkout` or `/checkout/`)**
- **No Cookie**: Redirect to geolocation-based locale
- **Stale Cookie**: Override with geolocation-based locale
- **Matching Cookie**: Pass through (no redirect)

### **Locale Path (`/checkout/de-de/`)**
- **Never Redirects**: Always pass through
- **Cookie Alignment**: Update cookie to match path locale
- **Stable Navigation**: Users stay on chosen locale

### **Cookie Normalization**
- **Multiple Variants**: Sets cookies with different paths and domains
- **Domain Support**: `.xaptv.com` and no domain variants
- **Path Support**: `/` and `/checkout` path variants
- **Secure Settings**: HttpOnly, Secure, SameSite=Lax

## ⚠️ **Troubleshooting**

### **Common Issues**

#### **1. No Redirect on Root**
- **Cause**: Cookie already matches geolocation
- **Solution**: Use `_nukeLang=1` to clear cookies first
- **Check**: Debug endpoint to verify cookie vs country

#### **2. Wrong Locale Redirect**
- **Cause**: Country detection incorrect
- **Solution**: Check `cdn-cgi/trace` for actual country
- **Fix**: Verify country mapping in Worker code

#### **3. Cookie Not Set**
- **Cause**: Multiple Set-Cookie headers not working
- **Solution**: Check browser developer tools for cookies
- **Fix**: Verify cookie syntax and headers

#### **4. Locale Path Redirects**
- **Cause**: Worker logic incorrect
- **Solution**: Check that locale paths never redirect
- **Fix**: Verify `currentLocaleInPath` logic

### **Debug Steps**

1. **Check Geolocation**
   ```bash
   curl https://web.xaptv.com/cdn-cgi/trace | grep loc
   ```

2. **Clear Cookies**
   ```bash
   curl https://web.xaptv.com/checkout/?_nukeLang=1
   ```

3. **Verify State**
   ```bash
   curl https://web.xaptv.com/checkout/?_debug=1
   ```

4. **Test Redirect**
   ```bash
   curl -I https://web.xaptv.com/checkout/
   ```

5. **Check Cookie**
   ```bash
   curl -H "Cookie: browserLang=de-de" https://web.xaptv.com/checkout/?_debug=1
   ```

## 🎯 **Success Criteria**

### **Functional Requirements**
- ✅ Geolocation takes precedence over stale cookies at root
- ✅ Locale paths never redirect (guarantee maintained)
- ✅ Cookie normalization works across variants
- ✅ Nuke helper clears all cookie variants
- ✅ Debug endpoint provides accurate information

### **Performance Requirements**
- ✅ Fast response times (< 100ms)
- ✅ Efficient cookie handling
- ✅ Proper caching headers
- ✅ Minimal processing overhead

### **Security Requirements**
- ✅ Secure cookie settings maintained
- ✅ Input validation improved
- ✅ No XSS vulnerabilities
- ✅ CSRF protection maintained

## 📝 **Test Checklist**

- [ ] **Step 1**: Verify geolocation detection (`cdn-cgi/trace`)
- [ ] **Step 2**: Clear cookies with nuke helper (`_nukeLang=1`)
- [ ] **Step 3**: Verify cookie cleared (`_debug=1`)
- [ ] **Step 4**: Test first visit redirect (`/checkout/`)
- [ ] **Step 5**: Verify locale path stability (`/checkout/de-de/`)
- [ ] **Step 6**: Check cookie persistence (`_debug=1`)
- [ ] **Step 7**: Test stale cookie override (different cookie)

## 🚀 **Deployment Verification**

After deploying the updated Worker and Nuxt.js application:

1. **Clear Browser Cache**: Use incognito mode
2. **Run Test Sequence**: Follow steps 1-7 above
3. **Verify Results**: Check all expected behaviors
4. **Monitor Logs**: Check Cloudflare Worker logs for errors
5. **Test Edge Cases**: Try different countries and cookie scenarios

---

*Test Sequence Guide for Cloudflare Worker Implementation*
*Status: Ready for testing*
*Key Features: Geolocation priority, cookie normalization, debug helpers*
