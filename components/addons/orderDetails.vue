<template>
  <div id="orderDetails">
    <div v-if="pid && !freeOrder && hasAddons" class="options">
      <div class="label">
        <div>
          <img src="@/assets/img/plus-white.svg" alt="plus" />
        </div>

        <p>
          {{ $t('checkout.optionalAddons') }}
          <span>({{ $t('checkout.optional') }})</span>
        </p>
      </div>

      <div class="wrapper">
        <ExtraConnect v-if="hasExtraConnections" />
        <ProxyProtection v-if="hasProxyProtections" />
      </div>
    </div>
    <Discount v-if="!freeOrder"></Discount>
    <Includes v-if="!width"></Includes>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Discount from './orderDetails/discount'
import Includes from './orderDetails/includes'
import ExtraConnect from './extraConnect'
import ProxyProtection from './proxyProtection'
export default {
  computed: {
    ...mapState(['pid', 'products', 'defaultPid']),
    freeOrder: {
      cache: false,
      get: function () {
        const pid = this.pid || this.products.selectedPid || this.defaultPid
        if (this.products.products[pid])
          return this.products.products[pid].paytype === 'free'
      },
    },
    hasAddons: {
      cache: false,
      get() {
        const pid = this.pid || this.products.selectedPid || this.defaultPid
        if (this.products.products[pid])
          return !!this.products.products[pid].configoptions.configoption.length
      },
    },
    hasExtraConnections: {
      cache: false,
      get() {
        const pid = this.pid || this.products.selectedPid || this.defaultPid
        if (this.products.products[pid] && this.hasAddons)
          return !!this.products.products[pid].configoptions.configoption.find(
            (option) => option.name == 'Extra Connections'
          )
      },
    },
    hasProxyProtections: {
      cache: false,
      get() {
        const pid = this.pid || this.products.selectedPid || this.defaultPid
        if (this.products.products[pid] && this.hasAddons)
          return !!this.products.products[pid].configoptions.configoption.find(
            (option) => option.name == 'Proxy Protection'
          )
      },
    },
  },
  data() {
    return {
      width: false,
    }
  },
  components: {
    Includes,
    Discount,
    ExtraConnect,
    ProxyProtection,
  },
  mounted() {
    this.width = window.innerWidth <= 850
  },
}
</script>
