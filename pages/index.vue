<template>
  <div>
        <div
          id="checkout"
          :class="{ pid }"
          v-if="!products.notFound && Object.keys(products.products).length"
        >
          <Plans v-if="!pid"></Plans>
          <Addons v-if="!pid"></Addons>
          <PaymentMethod></PaymentMethod>
        </div>
    <div class="alert" v-if="products.notFound">
      Sorry, this product is not available anymore, please contact us.
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Plans from '@/components/checkout/plans'
import Addons from '@/components/checkout/addons'
import PaymentMethod from '@/components/checkout/paymentMethod'
export default {
  async mounted() {
    if (
      !this.products.extraConnection &&
      !this.products.proxyProtection &&
      !Object.keys(this.products.discount).length &&
      (!this.order.orderid || !this.order.invoiceid)
    )
      this.updatePrice({ totalPrice: '' })
    this.pid
      ? await Promise.all([this.getProduct(), this.getGateway()])
      : await Promise.all([this.getProducts(), this.getGateway()])
    this.pid ? this.disableExtraConnect() : ''
    this.getCurrency(this.$t('currency'))
    const link = this.payment.coinbase_url || this.payment.offshore_url
    const duration = new Date(this.waiting.lastDate) - new Date() > 0

    if (!duration) {
      this.clearOrder()
      this.removeLastDate()
    } else if (
      this.productDetails.status != 'Active' &&
      this.order.orderid &&
      this.user.clientid
    )
      this.$router.push(this.localePath('/waiting'))
  },
  computed: {
    ...mapState([
      'pid',
      'user',
      'productDetails',
      'products',
      'waiting',
      'payment',
      'order',
    ]),
  },
  components: {
    Plans,
    Addons,
    PaymentMethod,
  },
  methods: {
    ...mapActions({
      getProduct: 'products/getProduct',
      getProducts: 'products/getProducts',
      getGateway: 'gateway/getGateway',
      getCurrency: 'getCurrency',
      clearOrder: 'order/clearData',
      removeLastDate: 'waiting/removeLastDate',
      updatePrice: 'products/updatePrice',
      disableExtraConnect: 'products/disableExtraConnect',
    }),
  },
}
</script>
