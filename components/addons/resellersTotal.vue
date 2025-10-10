<template>
  <div id="total">
    <p class="title">{{ $t('checkout.total') }}</p>
    <div class="hr"></div>
    <p class="total">{{ productPrice + $t('currency.symbole') }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['resellers', 'defaultReselPid']),
    productPrice() {
      const pid = this.resellers.selectedPid || this.defaultReselPid
      if (!this.resellers.products[pid]) return NaN
      const pricing = this.resellers.products[pid].pricing[
        this.$t('currency.currency')
      ]
      return Number(pricing['monthly']).toFixed(0)
    },
  },
}
</script>
