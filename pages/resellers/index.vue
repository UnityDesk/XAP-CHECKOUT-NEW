<template>
  <div>
    <div id="ccc_resellers">
      <Plans></Plans>
      <Existing></Existing>
      <PaymentMethod></PaymentMethod>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Plans from '../../components/resellers/plans.vue'
import Existing from '../../components/resellers/existing.vue'
import PaymentMethod from '../../components/resellers/paymentMethod.vue'
export default {
  components: {
    Plans,
    Existing,
    PaymentMethod,
  },
  computed: {
    ...mapState(['auth', 'user', 'resellers']),
  },
  methods: {
    ...mapActions({
      getProducts: 'resellers/getProducts',
      getGateway: 'gateway/getGateway',
      userType: 'resellers/userType',
      existing: 'resellers/existing',
    }),
  },
  async mounted() {
    await Promise.all([this.getProducts(), this.getGateway()])
    if (this.auth.loggedIn && this.auth.user.userid && this.user.email) {
      await this.userType()
      this.existing(this.resellers.isReseller)
    }
  },
}
</script>

<style></style>
