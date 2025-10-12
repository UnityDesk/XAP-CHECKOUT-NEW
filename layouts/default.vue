<template>
  <div class="layout-container">
    <!-- Persistent Background Animation -->
    <client-only>
      <BackgroundAnimation />
    </client-only>
    
    <div class="content-wrapper">
      <client-only>
        <Header></Header>
        <Nuxt id="UI" />
      </client-only>
    </div>
    
    <client-only>
      <Footer></Footer>
    </client-only>
  </div>
</template>

<style>
html {
  font-family: 'Inter', 'Geist Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 8px;
  border: 1px solid #4ECDC4;
  color: #0a1929;
  background-color: #4ECDC4;
  text-decoration: none;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.button--green:hover {
  color: #0a1929;
  background-color: #3bb5ad;
  transform: scale(1.02);
}

.button--grey {
  display: inline-block;
  border-radius: 8px;
  border: 1px solid rgba(78, 205, 196, 0.3);
  color: #ffffff;
  background-color: rgba(15, 23, 42, 0.6);
  text-decoration: none;
  padding: 12px 24px;
  margin-left: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.button--grey:hover {
  color: #ffffff;
  background-color: rgba(78, 205, 196, 0.2);
  border-color: #4ECDC4;
}
</style>

<script>
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import BackgroundAnimation from '../components/BackgroundAnimation'
import { mapActions } from 'vuex'

export default {
  components: {
    Header,
    Footer,
    BackgroundAnimation,
  },
  mounted() {
    this.getCurrency(this.$t('currency.currency'))
    this.fetchCurrencies()
  },
  methods: {
    ...mapActions({
      getCurrency: 'userCurrency/getCurrency',
      fetchCurrencies: 'currency/fetchCurrencies',
    }),
  },
}
</script>
