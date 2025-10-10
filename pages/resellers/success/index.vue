<template>
  <div>
    <div id="reseller_success">
      <div class="ccc_section">
        <div class="ccc_title">{{ $t('resellers.success.titles.1') }}</div>
        <Info
          :copied="false"
          :openUrl="true"
          :data="$config.resellerDashboard"
        ></Info>
      </div>
      <div class="ccc_section">
        <div class="ccc_title">{{ $t('resellers.success.titles.2') }}</div>
        <Info :copied="false" :openUrl="true" :data="route"></Info>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Info from '../../../components/addons/info.vue'
export default {
  middleware: ['resellerSuccess'],
  components: {
    Info,
  },
  computed: {
    ...mapState(['user', 'resellers', 'defaultReselPid', 'currency']),
    route() {
      return (
        window.location.origin +
        this.$nuxt.$router.options.base +
        'resellers?email=' +
        this.user.email
      )
    },
    data() {
      const pid = this.resellers.selectedPid || this.defaultReselPid
      let price, name
      if (this.resellers.products[pid]) {
        price = this.resellers.products[pid].pricing[
          this.$t('currency.currency')
        ]['monthly']
        name = this.resellers.products[pid].name
      }
      return { price, name }
    },
  },

  mounted() {
    this.$gtag('event', 'conversion', {
      send_to: process.env.RESELLER_CONVERSION_ID || '',
      value: Number(this.data.price),
      currency: this.currency.currency,
    })
  },
}
</script>

<style></style>
