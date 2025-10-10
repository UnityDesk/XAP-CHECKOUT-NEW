<template>
  <div id="extraPrice">
    <Pricing
      :src="require('@/assets/img/order/extraConnect.svg')"
      :title="sliderValue + ' x Extra Connection'"
      :price="price"
    ></Pricing>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Pricing from '../pricing'

export default {
  props: ['price', 'sliderValue'],
  components: {
    Pricing,
  },
  computed: {
    ...mapState(['products', 'pid', 'defaultPid', 'upsell']),
    extraQuantity: {
      cache: false,
      get() {
        return this.upsell.extraQuantity
      },
    },
  },
}
</script>
