<template>
  <div id="header">
    <NuxtLink :to="localePath('/')" class="logo-link">
      <img :src="logoUrl" alt="XAPTV" class="logo-image" />
    </NuxtLink>

    <div class="header-actions">
      <div class="currency-section">
        <client-only>
          <CurrencySelector @currency-changed="onCurrencyChanged" />
        </client-only>
      </div>

      <div class="account-section">
        <span class="account-text">Already have an account?</span>
        <a href="https://web.xaptv.com/dashboard" class="login-button" target="_blank">Login</a>
      </div>

      <client-only>
        <button
          v-if="$auth.loggedIn && $auth.user.userid && user.email"
          @click="clicked"
          class="signOut"
        >
          <img src="@/assets/img/logout.svg" alt="log out" />
        </button>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CurrencySelector from '~/components/currency/currencySelector.vue'

export default {
  components: {
    CurrencySelector,
  },
  data() {
    return {
      logoUrl: '/checkout/xap.png',
    }
  },
  computed: {
    ...mapState(['user']),
  },
  mounted() {
    const el = document.querySelector('#header')
    const observer = new IntersectionObserver(
      ([e]) => e.target.classList.toggle('is-pinned', e.intersectionRatio < 1),
      { threshold: [1] }
    )

    observer.observe(el)
  },
  methods: {
    ...mapActions({
      signOut: 'user/signOut',
      removeLastDate: 'waiting/removeLastDate',
      clearDiscount: 'products/clearDiscount',
      removeClientProduct: 'productDetails/removeClientProduct',
      clearPayment: 'payment/clearPayment',
      clearData: 'order/clearData',
    }),
    clicked() {
      this.$auth.setUser('')
      this.signOut()
      this.removeLastDate()
      this.removeClientProduct()
      this.clearPayment()
      this.clearData()
      this.$router.push(this.localePath('/'))
    },
    
    onCurrencyChanged(currencyData) {
      // Emit currency change event to parent components
      this.$emit('currency-changed', currencyData)
      
      // Update the current locale's currency
      this.$i18n.setLocale(this.$i18n.locale)
    },
  },
}
</script>
