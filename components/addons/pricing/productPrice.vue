<template>
  <Pricing
    :src="require('@/assets/img/order/cccambox.svg')"
    :title="data.name"
    :price="freeOrder ? 'FREE' : data.price + $t('currency.symbole')"
  ></Pricing>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Pricing from '../pricing'
export default {
  components: {
    Pricing,
  },
  computed: {
    ...mapState(['products', 'pid', 'defaultPid']),
    freeOrder: {
      cache: false,
      get: function () {
        const pid = this.pid || this.products.selectedPid || this.defaultPid
        if (this.products.products[pid])
          return this.products.products[pid].paytype === 'free'
      },
    },
    data() {
      const pid = this.pid || this.products.selectedPid || this.defaultPid
      let price, name, billingcycle
      if (this.products.products[pid]) {
        price = this.products.products[pid].pricing[
          this.$t('currency.currency')
        ]
        name = this.products.products[pid].name
      }
      for (let j in price) {
        if (price[j] > 0) {
          billingcycle = j
          price = price[j]
        }
      }
      return { price, name, billingcycle }
    },
  },
  methods: {
    ...mapActions({
      updatePrice: 'products/updatePrice',
      updateBillingCycle: 'products/updateBillingCycle',
    }),
  },
  mounted() {
    if (this.data.price) {
      this.updatePrice({ price: this.data.price })
      this.updateBillingCycle(this.data.billingcycle)
    }
  },
  updated() {
    this.updatePrice({ price: this.data.price })
  },
  watch: {
    data(newValue) {
      this.updateBillingCycle(newValue.billingcycle)
    },
  },
}
</script>
