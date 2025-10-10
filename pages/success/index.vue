<template>
  <div id="success">
    <success />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import success from '@/components/success/success.vue'
export default {
  components: {
    success,
  },
  computed: {
    ...mapState(['products', 'currency']),
  },
  head() {
    return {
      title: this.$t('title.success'),
    }
  },
  methods: {
    ...mapActions({
      clearPayment: 'payment/clearPayment',
    }),
  },
  mounted() {
    this.clearPayment()
    this.$gtag('event', 'conversion', {
      send_to: 'AW-10890364464/OPxKCIbpxLYDELCM98go',
      value: Number(this.products.totalPrice || this.products.price),
      currency: this.currency.currency,
    })
    // this.$gtag('event', 'conversion', {
    //   send_to: 'AW-437268160/DgjPCM3c7fMBEMDdwNAB',
    //   value: Number(this.products.totalPrice || this.products.price),
    //   currency: this.currency.currency,
    // })
  },
}
</script>
