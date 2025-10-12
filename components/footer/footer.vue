<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Logo Section -->
      <div class="footer-logo-section">
        <div class="logo-container">
          <img src="/checkout/xap.png" alt="XAPTV Logo" class="footer-logo" />
        </div>
        <p class="brand-tagline">Premium IPTV Experience</p>
      </div>
      
      <div class="footer-section">
        <h3 class="footer-title">Quick Links</h3>
        <ul class="footer-links">
          <li><a href="https://xaptv.com" class="footer-link" target="_blank">Home</a></li>
          <li><a href="https://web.xaptv.com/channels" class="footer-link" target="_blank">Features</a></li>
          <li><a href="https://web.xaptv.com/contact" class="footer-link" target="_blank">Support</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3 class="footer-title">Support</h3>
        <ul class="footer-links">
          <li><a href="https://iptvkb.com" class="footer-link" target="_blank">Help Center</a></li>
          <li><a href="https://web.xaptv.com/contact" class="footer-link" target="_blank">Contact Us</a></li>
          <li><a href="https://xaptv.com" class="footer-link" target="_blank">FAQ</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3 class="footer-title">Legal</h3>
        <ul class="footer-links">
          <li><a href="https://web.xaptv.com/terms-of-service" class="footer-link" target="_blank">Terms of Service</a></li>
          <li><a href="https://web.xaptv.com/privacy-policy" class="footer-link" target="_blank">Privacy Policy</a></li>
          <li><a href="https://web.xaptv.com/contact" class="footer-link" target="_blank">DMCA</a></li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p class="footer-copyright">
          © 2025 XAPTV. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background: rgba(10, 25, 41, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(78, 205, 196, 0.2);
  margin-top: 60px;
  position: relative;
  z-index: 10;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 32px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  align-items: start;
}

/* Logo Section */
.footer-logo-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: brightness(1.1);
  transition: transform 0.3s ease;
}

.footer-logo:hover {
  transform: scale(1.05);
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}


.brand-tagline {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 12px 0 0 0;
  font-weight: 500;
}

.footer-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  max-width: 300px;
}


.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  font-family: 'Inter', 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 4px 0;
}

.footer-link:hover {
  color: #4ECDC4;
  transform: translateX(4px);
}

.footer-bottom {
  border-top: 1px solid rgba(78, 205, 196, 0.1);
  padding: 24px 0;
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin: 0;
  text-align: center;
}

/* Responsive Design */
@media screen and (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 32px;
  }
  
  .footer-logo-section {
    grid-column: 1 / -1;
    text-align: center;
    align-items: center;
  }
  
  .footer-description {
    max-width: 100%;
    text-align: center;
  }
}

@media screen and (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 32px 16px 24px;
  }
  
  .footer-logo-section {
    grid-column: 1 / -1;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 0 16px;
  }
  
  .payment-methods {
    justify-content: center;
  }
}

@media screen and (max-width: 600px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px 16px;
  }
  
  .footer-logo-section {
    text-align: center;
  }
  
  .logo-container {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .payment-methods {
    flex-direction: column;
    gap: 8px;
  }
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
  .footer {
    background: rgba(15, 23, 42, 0.95);
    border-top-color: rgba(78, 205, 196, 0.3);
  }
  
  .social-link {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .social-link:hover {
    background: rgba(78, 205, 196, 0.15);
    border-color: rgba(78, 205, 196, 0.2);
  }
  
  .payment-icon {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
}
</style>