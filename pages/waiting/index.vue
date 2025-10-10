<template>
  <div>
    <div id="waiting" :class="{ fraud: fraud }">
      <Timing></Timing>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Timing from '@/components/waiting/timing'
import EditOrder from '@/components/waiting/editOrder'
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
  mounted() {
    // if (!this.order.orderid || !this.$auth.loggedIn)
    //   this.$router.push(this.localePath('/'))
  },
}
</script>
