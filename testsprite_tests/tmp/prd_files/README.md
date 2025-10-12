# XAPTV Checkout

A modern, responsive IPTV checkout system built with Nuxt.js and integrated with WHMCS for seamless subscription management.

## 🌟 Features

- **Modern UI/UX**: Beautiful, responsive design with animated backgrounds
- **Multi-Currency Support**: Real-time currency conversion (EUR, GBP, USD)
- **WHMCS Integration**: Full integration with WHMCS 8.x for billing and subscriptions
- **Connection Management**: Flexible connection count selection (1-5 connections)
- **Payment Gateway Support**: Multiple payment methods including Stripe, cryptocurrency, and more
- **Mobile Responsive**: Optimized for all devices with Safari performance enhancements
- **Real-time Pricing**: Dynamic pricing with live currency conversion
- **Fraud Protection**: Built-in fraud detection and prevention
- **Promotional Codes**: Support for discount codes and promotions

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ or Bun
- WHMCS 8.x installation
- Redis (for caching)
- PM2 (for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/UnityDesk/MX-CHECKOUT.git

# Navigate to project directory
cd MX-CHECKOUT

# Install dependencies
bun install

# Build the project
bun run build

# Start with PM2
pm2 start ecosystem.config.js
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# WHMCS API Configuration
API_URL_WHMCS=https://your-whmcs-domain.com
API_IDENTIFIER=your_api_identifier
API_SECRET=your_api_secret
API_ACCESS=your_api_access_key

# Default Product IDs
defaultPid=1
defaultReselPid=2
newResellerPid=3

# Payment Gateway Configuration
gateway=stripe-cryptomus-offshore
fraudCheck=true

# IP Detection
ipapikey=your_ip_api_key

# Server Configuration
PORT=8888
HOST=0.0.0.0
NODE_ENV=production
```

### WHMCS Setup

1. **Configure Currencies**: Set up EUR, GBP, and USD in WHMCS Admin
2. **Set Exchange Rates**: Configure exchange rates for real-time conversion
3. **Payment Gateways**: Enable and configure payment gateways
4. **Products**: Create IPTV products with proper pricing tiers

## 🌍 Multi-Currency Support

The system supports real-time currency conversion using WHMCS exchange rates:

- **EUR (Euro)** - Default currency
- **GBP (British Pound)** - UK market
- **USD (US Dollar)** - US market

### Currency Features

- Real-time conversion using WHMCS rates
- Dynamic pricing updates
- Currency selector in header
- Original and converted price display

## 📱 URL Parameters

### Auto Redirection

```bash
# Complete checkout with pre-filled data
https://web.xaptv.com/checkout/?email=customer@example.com&pid=1&auto_redirect=true&promocode=WELCOME10&extraconnect=true&proxyprotect=true
```

### Auto Login

```bash
# Pre-fill email for existing customers
https://web.xaptv.com/checkout/?email=customer@example.com
```

### Product Selection

```bash
# Pre-select specific product
https://web.xaptv.com/checkout/?pid=1
```

### Promotional Codes

```bash
# Apply promotional code
https://web.xaptv.com/checkout/?pid=1&promocode=WELCOME10
```

### Connection Management

```bash
# Pre-select extra connections
https://web.xaptv.com/checkout/?extraconnect=true

# Pre-select proxy protection
https://web.xaptv.com/checkout/?proxyprotect=true
```

## 🎨 Customization

### Branding

- **Logo**: Replace `/static/xap.png` with your logo
- **Favicon**: Update favicon in `nuxt.config.js`
- **Colors**: Modify SCSS variables in `assets/scss/`
- **Fonts**: Update font families in `nuxt.config.js`

### Styling

The project uses SCSS with a modular structure:

```
assets/scss/
├── default.scss          # Base styles and animations
├── header.scss          # Header component styles
├── checkout.scss        # Checkout page styles
├── animation.scss       # Background animations
└── addons/              # Component-specific styles
    ├── product.scss     # Product card styles
    ├── total.scss       # Total price styles
    └── ...
```

## 🔌 API Endpoints

### Currency API

```bash
# Get all currencies
GET /checkout/api/currencies

# Convert currency
GET /checkout/api/convert?amount=10.99&from=EUR&to=USD
```

### Order API

```bash
# Create order
GET /checkout/api/order?userid=123&pid=1&currency=EUR&amount=10.99&paymentmethod=stripe
```

## 🧪 Testing

### Currency Conversion Test

```bash
# Run currency API tests
node test-currency.js
```

### Manual Testing

1. **Currency Switching**: Test all three currencies (EUR, GBP, USD)
2. **Connection Count**: Test 1-5 connection selection
3. **Payment Flow**: Test complete checkout process
4. **Mobile Responsive**: Test on various screen sizes
5. **Safari Performance**: Test on iOS Safari

## 📦 Deployment

### Production Build

```bash
# Clean build
rm -rf .nuxt dist node_modules/.cache

# Install dependencies
bun install

# Build for production
bun run build

# Start with PM2
pm2 restart ecosystem.config.js
```

### PM2 Configuration

The project includes `ecosystem.config.js` for PM2 deployment:

```javascript
module.exports = {
  apps: [{
    name: 'xaptv-checkout',
    script: './server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8888,
      HOST: '0.0.0.0'
    }
  }]
}
```

## 🔒 Security Features

- **Fraud Detection**: Built-in fraud checking
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting
- **HTTPS Support**: SSL/TLS encryption
- **CORS Protection**: Cross-origin request protection

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile**: iOS 14+, Android 8+

## 📊 Performance

- **Lighthouse Score**: 95+ Performance
- **Safari Optimized**: Enhanced performance for iOS Safari
- **Lazy Loading**: Optimized image and component loading
- **Caching**: Redis-based caching for API responses
- **CDN Ready**: Static asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:

- **Email**: support@xaptv.com
- **Documentation**: [Internal Wiki]
- **Issues**: [GitHub Issues](https://github.com/UnityDesk/MX-CHECKOUT/issues)

## 🔄 Changelog

### v2.0.0 (Current)
- ✅ Real-time currency conversion
- ✅ WHMCS 8.x integration
- ✅ Modern UI redesign
- ✅ Mobile optimization
- ✅ Safari performance enhancements
- ✅ Connection count management
- ✅ Multi-payment gateway support

### v1.0.0
- ✅ Basic checkout functionality
- ✅ WHMCS integration
- ✅ Payment processing
- ✅ Responsive design

---

**XAPTV Checkout** - Professional IPTV subscription management system
