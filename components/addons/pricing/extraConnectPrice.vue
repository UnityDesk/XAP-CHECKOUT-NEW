<template>
  <Pricing
    :src="require('@/assets/img/order/extraConnect.svg')"
    :title="data.name"
    :price="data.price + $t('currency.symbole')"
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
    ...mapState(['products', 'pid', 'defaultPid', 'product']),
    data: {
      cache: false,
      get: function () {
        const pid = this.pid || this.products.selectedPid || this.defaultPid
        let price = [],
          name = ''
        if (this.products.products[pid]) {
          if (this.products.products[pid].configoptions.configoption.length) {
            price =
              this.products.products[pid].configoptions.configoption[0].options
                .option[0].pricing[this.$t('currency.currency')]
            name =
              this.products.products[pid].configoptions.configoption[0].name
            price = Object.keys(price).length
              ? price[this.products.billingcycle]
              : price
          }
        }
        return { price, name }
      },
    },
  },
  methods: {
    ...mapActions({
      editExtraConnect: 'products/editExtraConnect',
    }),
  },
}
</script>
