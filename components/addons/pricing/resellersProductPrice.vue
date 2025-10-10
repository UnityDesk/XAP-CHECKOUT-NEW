<template>
  <Pricing
    :src="require('@/assets/img/order/credits.svg')"
    :title="data.name"
    :price="Number(data.price).toFixed(0) + $t('currency.symbole')"
  ></Pricing>
</template>

<script>
import { mapState } from 'vuex'
import Pricing from '../pricing'
export default {
  components: {
    Pricing,
  },
  computed: {
    ...mapState(['resellers', 'defaultReselPid']),
    data() {
      const pid = this.resellers.selectedPid || this.defaultReselPid
      let price, name
      if (this.resellers.products[pid]) {
        price = this.resellers.products[pid].pricing[
          this.$t('currency.currency')
        ]['monthly']
        name = this.resellers.products[pid].name
      }
      return { price, name }
    },
  },
}
</script>
