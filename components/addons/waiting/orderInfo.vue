<template>
  <div id="orderInfo">
    <Info
      v-if="order.orderid"
      :title="$t('waiting.orderid')"
      :info="order.orderid"
    ></Info>

    <Info
      v-if="productDetails.name"
      :title="$t('waiting.package')"
      :info="productDetails.name"
    ></Info>

    <Info
      v-if="price"
      :title="$t('waiting.price')"
      :info="price + $t('currency.symbole')"
    ></Info>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Info from './info'
export default {
  computed: {
    ...mapState(['order', 'products', 'waiting', 'productDetails', 'resellers', 'defaultReselPid']),
    price() {
      // Check if we're on a reseller page
      if (this.$route.path.includes('resellers')) {
        // For reseller orders, try to get the amount from the order state
        if (this.order.amount) {
          return Number(this.order.amount).toFixed(0)
        }
        
        // If no amount stored, try to get from resellers store
        const pid = this.resellers?.selectedPid || this.defaultReselPid
        if (this.resellers?.products?.[pid]) {
          const pricing = this.resellers.products[pid].pricing[
            this.$t('currency.currency')
          ]
          return Number(pricing['monthly']).toFixed(0)
        }
        
        // If still no price, don't show price for reseller orders
        return null
      }
      
      // For regular orders, use the products store
      return this.products.totalPrice || this.products.price
    },
  },
  components: {
    Info,
  },
}
</script>
