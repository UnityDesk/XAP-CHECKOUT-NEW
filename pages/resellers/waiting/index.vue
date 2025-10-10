<template>
  <div>
    <div id="waiting" :class="{ fraud: fraud }">
      <Timing></Timing>
      <EditOrder></EditOrder>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Timing from '@/components/waiting/reseller/timing'
import EditOrder from '@/components/waiting/reseller/editOrder'
export default {
  computed: {
    ...mapState(['order', 'user']),
    fraud() {
      return this.order.fraud
    },
  },
  components: {
    Timing,
    EditOrder,
  },
  methods: {
    ...mapActions({
      clearDiscount: 'products/clearDiscount',
    }),
  },
  mounted() {
    this.clearDiscount()
    if (!this.order.orderid || !this.$auth.loggedIn)
      this.$router.push(this.localePath('/resellers'))
  },
}
</script>
