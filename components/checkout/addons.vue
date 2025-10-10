<template>
  <section ref="extraConnect" id="addExtraConnect" v-if="hasAddons">
    <Label
      :number="2"
      :label="$t('checkout.optionalAddons')"
      :optional="true"
    ></Label>

    <div class="extra">
      <ConnectionSelector v-if="hasExtraConnections"></ConnectionSelector>
      <ProxyProtection v-if="hasProxyProtections"></ProxyProtection>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import Label from '../addons/label'
import ConnectionSelector from '../addons/connectionSelector'
import ProxyProtection from '../addons/proxyProtection'
export default {
  components: {
    Label,
    ConnectionSelector,
    ProxyProtection,
  },
  computed: {
    ...mapState(['products', 'pid', 'defaultPid', 'product']),
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
}
</script>
