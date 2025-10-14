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
- **Cloudflare Worker Integration**: Edge computing for improved performance and global distribution
- **Multi-Language Support**: 7 languages (English, German, Spanish, Dutch, Portuguese)
- **IP-Based Routing**: Intelligent routing based on user location
- **TestSprite Testing**: Comprehensive automated testing framework
- **Professional Design System**: Consistent UI components and design tokens

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

### Background Animations

The system features dynamic movie poster animations:

- **Desktop**: 60% opacity for subtle background effect
- **Tablet**: 90% opacity for enhanced visibility
- **Mobile**: 80% opacity for optimal mobile viewing
- **Animation**: 120-second horizontal scrolling with staggered delays
- **Performance**: Hardware-accelerated with reduced motion support
- **Responsive**: Automatically adjusts poster sizes and particle count

### Mobile Optimizations

- **Dark Background**: Prevents whitish appearance on mobile devices
- **Optimized Overlay**: Reduced dark overlay opacity for better poster visibility
- **Performance**: Reduced particle count and optimized animations for mobile
- **Z-Index Layering**: Proper stacking order for optimal visibility

### Design System Update

The entire codebase has been updated to use a unified design system:

- **Color Scheme**: Replaced old colors (`#0a2e2c`, `#00a99d`, `#006e66`) with modern teal gradients
- **Primary Colors**: `#4ECDC4` (Primary Teal) and `#3bb5ad` (Hover State)
- **Background Gradients**: `#1a2332` → `#0f1729` → `#1a2332` for modern depth
- **Consistent Borders**: `rgba(78, 205, 196, 0.3)` across all components
- **Glassmorphism Effects**: `backdrop-filter: blur(10px)` for modern UI
- **Components Updated**: Gateway, Success, Login, Timing, ProductNotFound, and all Addons
- **Dark Mode**: Full compatibility maintained across all updated components

### Waiting Page Design

The waiting page features modern gradient backgrounds:

- **Creating Order Block**: Modern gradient from `#1a2332` to `#0f1729` with teal borders
- **Timer Block**: Enhanced gradient background with improved border visibility
- **Visual Hierarchy**: Better contrast and definition for important elements
- **Consistent Design**: Matches overall design system with teal accent colors
- **Responsive**: Optimized for both mobile and desktop viewing

### Technical Implementation

**Design System Architecture:**
- **14 Files Updated**: Complete codebase transformation
- **Color Tokens**: Centralized color management with CSS variables
- **Gradient System**: Consistent `linear-gradient(135deg, #1a2332 0%, #0f1729 50%, #1a2332 100%)`
- **Component Library**: Unified styling across Gateway, Success, Login, Timing, and Addon components
- **Build System**: All changes compile successfully with no breaking changes
- **Performance**: Optimized CSS with modern properties and hardware acceleration

**Updated Components:**
- Core Pages: Gateway, Success, Login, Timing, ProductNotFound
- Addon Components: Utilitie, Upsell (UpdateExtra, SelectProduct), ResellersProduct, Pricing, PaymentMethod, Existing, OrderDetails
- All components maintain responsive design and dark mode compatibility

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

### TestSprite Automated Testing

The project includes comprehensive automated testing using TestSprite framework:

```bash
# Run TestSprite tests
npm run test:testsprite

# Generate test reports
npm run test:report
```

**TestSprite Features:**
- Frontend and backend test automation
- IP-based routing tests
- Language routing validation
- Checkout flow testing
- Currency conversion testing
- Cloudflare Worker integration tests

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
6. **Language Routing**: Test multi-language support
7. **IP-Based Routing**: Test geo-location routing

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

### Cloudflare Worker Deployment

The project includes Cloudflare Worker integration for edge computing and global distribution:

```bash
# Deploy to Cloudflare Workers
wrangler deploy cloudflare-worker-checkout.js

# Update worker configuration
wrangler secret put API_URL_WHMCS
wrangler secret put API_IDENTIFIER
wrangler secret put API_SECRET
```

**Cloudflare Worker Features:**
- Edge computing for reduced latency
- Global distribution
- Automatic scaling
- Built-in DDoS protection
- IP-based routing and geo-location

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

### v1.5.1 (Current)
- ✅ Cloudflare Worker integration for edge computing
- ✅ Multi-language support (7 languages)
- ✅ IP-based routing and geo-location
- ✅ TestSprite automated testing framework
- ✅ Professional design system implementation
- ✅ Enhanced security features
- ✅ Improved performance optimizations
- ✅ Background animation fixes
- ✅ Language selector enhancements
- ✅ Mobile background whitish appearance fix
- ✅ Movie poster animation restoration
- ✅ Optimized poster visibility for mobile devices
- ✅ Z-index layering improvements
- ✅ Dark overlay optimization for better poster visibility
- ✅ Modern gradient backgrounds for waiting page blocks
- ✅ Enhanced creating order and timer block styling
- ✅ Complete design system update across entire codebase
- ✅ Unified color scheme with modern teal gradients

### v1.5.0
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
