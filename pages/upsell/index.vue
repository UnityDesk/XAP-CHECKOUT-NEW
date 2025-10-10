<template>
  <div id="upsell">
    <Upsell v-if="$auth.loggedIn && user.email"></Upsell>
    <Login v-else></Login>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Login from '@/components/login/index'
import Upsell from '@/components/upsell/index'
export default {
  components: {
    Login,
    Upsell,
  },
  methods: {
    ...mapActions({
      getActiveProducts: 'upsell/getActiveProducts',
      getExtraProduct: 'upsell/getExtraProduct',
      auth: 'user/auth',
    }),
  },
  computed: {
    ...mapState(['user', 'upsell']),
  },
  async mounted() {
    if (this.$auth.loggedIn && this.user.email) {
      if (!this.$auth.user.userid) await this.auth()
      await this.getActiveProducts()
      if (
        Object.keys(this.upsell.activeProducts).length &&
        this.upsell.selectedId
      )
        await this.getExtraProduct()
    }
  },
  async updated() {
    if (this.$auth.loggedIn && this.user.email) {
      await this.getActiveProducts()
      if (
        Object.keys(this.upsell.activeProducts).length &&
        this.upsell.selectedId
      )
        await this.getExtraProduct()
    }
  },
}
</script>
