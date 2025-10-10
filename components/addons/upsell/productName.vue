<template>
  <div id="productName">
    <Pricing
      :src="require('@/assets/img/order/cccambox.svg')"
      :title="
        selectedProduct.name +
        ' | ' +
        (selectedProduct.nextduedate === '0000-00-00'
          ? 'All Time'
          : selectedProduct.nextduedate)
      "
    ></Pricing>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Pricing from '../pricing'

export default {
  components: {
    Pricing,
  },
  computed: {
    ...mapState(['products', 'pid', 'defaultPid', 'upsell']),
    selectedProduct: {
      cache: false,
      get() {
        return this.upsell.activeProducts[this.upsell.selectedId]
      },
    },
  },
}
</script>
