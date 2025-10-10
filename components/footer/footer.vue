<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3 class="footer-title">Quick Links</h3>
        <ul class="footer-links">
          <li><a href="#" class="footer-link">Home</a></li>
          <li><a href="#" class="footer-link">Plans</a></li>
          <li><a href="#" class="footer-link">Features</a></li>
          <li><a href="#" class="footer-link">Support</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3 class="footer-title">Support</h3>
        <ul class="footer-links">
          <li><a href="#" class="footer-link">Help Center</a></li>
          <li><a href="#" class="footer-link">Contact Us</a></li>
          <li><a href="#" class="footer-link">FAQ</a></li>
          <li><a href="#" class="footer-link">Live Chat</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3 class="footer-title">Legal</h3>
        <ul class="footer-links">
          <li><a href="#" class="footer-link">Terms of Service</a></li>
          <li><a href="#" class="footer-link">Privacy Policy</a></li>
          <li><a href="#" class="footer-link">Refund Policy</a></li>
          <li><a href="#" class="footer-link">DMCA</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3 class="footer-title">Company</h3>
        <ul class="footer-links">
          <li><a href="#" class="footer-link">About Us</a></li>
          <li><a href="#" class="footer-link">Blog</a></li>
          <li><a href="#" class="footer-link">News</a></li>
          <li><a href="#" class="footer-link">Careers</a></li>
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
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
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

@media screen and (max-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 32px 16px 24px;
  }
  
  .footer-bottom-content {
    padding: 0 16px;
  }
}

@media screen and (max-width: 600px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 24px 12px 20px;
  }
  
  .footer-title {
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  .footer-link {
    font-size: 13px;
  }
}

@media screen and (max-width: 480px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 20px 12px 16px;
  }
  
  .footer-section {
    min-width: 0;
  }
  
  .footer-title {
    font-size: 15px;
    margin-bottom: 10px;
  }
  
  .footer-link {
    font-size: 12px;
    padding: 2px 0;
  }
  
  .footer-bottom-content {
    padding: 0 12px;
  }
  
  .footer-copyright {
    font-size: 12px;
  }
}
</style>
