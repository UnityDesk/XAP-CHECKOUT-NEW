<template>
  <Pricing
    :src="require('@/assets/img/order/discount.svg')"
    :title="data.name"
    :price="'-' + data.price + $t('currency.symbole')"
    class="discount"
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
    ...mapState(['products', 'pid', 'defaultPid', 'product']),
    extraConnect() {
      const pid = this.pid || this.products.selectedPid || this.defaultPid
      let price = []
      if (
        this.products.products[pid] &&
        this.products.products[pid].configoptions.configoption[0]
      ) {
        price =
          this.products.products[pid].configoptions.configoption[0].options
            .option[0].pricing[this.$t('currency.currency')]
        price = Object.keys(price).length
          ? price[this.products.billingcycle]
          : price
      }
      return this.products.extraConnection ? price : 0
    },
    data: {
      cache: false,
      get() {
        const name = `Discount -${Number(this.products.discount.value).toFixed(
          0
        )}${
          this.products.discount.type === 'Percentage'
            ? '%'
            : this.$t('currency.symbole')
        }`
        const total = Number(this.products.price) + Number(this.extraConnect)
        let price
        if (this.products.discount.type === 'Percentage') {
          let priceNotFix = (total * Number(this.products.discount.value)) / 100
          price = priceNotFix.toFixed(2)
        } else price = Number(this.products.discount.value).toFixed(2)
        return { name, price }
      },
    },
  },
}
</script>
