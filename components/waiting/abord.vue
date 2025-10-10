<template>
  <div>
    <div id="abort" @click="cancel" v-if="!order.fraud">
      <p class="cancel">{{ $t('waiting.cancelOrder') }}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState(['waiting', 'productDetails', 'order']),
  },
  methods: {
    ...mapActions({
      cancelOrder: 'order/cancelOrder',
      removeLastDate: 'waiting/removeLastDate',
      removeClientProduct: 'productDetails/removeClientProduct',
      clearPayment: 'payment/clearPayment',
    }),
    async cancel() {
      await this.cancelOrder()
      this.removeLastDate()
      this.removeClientProduct()
      this.clearPayment()
      this.$router.push(this.localePath('/'))
    },
  },
}
</script>
