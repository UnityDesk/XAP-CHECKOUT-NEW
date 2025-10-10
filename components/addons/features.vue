<template>
  <div class="features-section">
    <h3 class="features-title">This IPTV Plan Includes</h3>
    <div class="features-list">
      <div class="feature-item" v-for="feature in features" :key="feature">
        <div class="feature-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="feature-text">{{ feature }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeaturesList',
  data() {
    return {
      features: [
        '+10,000 TV Channels',
        '+10,000 Movies & Series',
        '24/7 Customer Support',
        'Management Dashboard',
        'Anti-Buffering V4',
        'Multi-Devices Support',
        'Money Back Guarantee'
      ]
    }
  }
}
</script>

<style scoped>
.features-section {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 24px;
  margin: 32px 0;
  border: 1px solid rgba(78, 205, 196, 0.2);
}

.features-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 20px 0;
  text-align: center;
}

.features-list {
  display: grid;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.feature-text {
  font-size: 16px;
  color: #ffffff;
  font-weight: 500;
}

@media screen and (max-width: 768px) {
  .features-section {
    padding: 20px;
    margin: 24px 0;
  }
  
  .features-title {
    font-size: 18px;
    margin-bottom: 16px;
  }
  
  .feature-item {
    gap: 10px;
    padding: 6px 0;
  }
  
  .feature-text {
    font-size: 14px;
  }
}
</style>
