<template>
  <div
    v-if="supportedGateway.some((el) => method.module.includes(el))"
    class="paymentMethod"
    :class="{ checked: check }"
    :displayname="method.module"
    :type="method.displayname"
    ref="gateway"
    @click="selectThis"
  >
    <div>
      <div class="checkbox"></div>

      <p class="type">
        <template v-if="method.displayname.toLowerCase().includes('card')">{{
          $tc(
            'checkout.gateway.credit',
            Number(method.displayname.split('#').at(-1)) || 1
          )
        }}</template>
        <template
          v-else-if="method.displayname.toLowerCase().includes('crypto')"
        >
          {{ $t('checkout.gateway.crypto') }}
        </template>
        <template v-else-if="method.module.includes('teveio_stripe')">
          Apple & Google Pay
        </template>
        <template v-else>{{ method.displayname }}</template>
      </p>
    </div>

    <img
      v-if="method.displayname.toLowerCase().includes('card')"
      src="@/assets/img/gateway/card.svg"
    />

    <img
      v-else-if="
        method.displayname.toLowerCase().includes('crypto') ||
        method.module.includes('crypto')
      "
      src="@/assets/img/gateway/coin.svg"
    />

    <img
      v-else-if="method.module.includes('revolut')"
      src="@/assets/img/gateway/revolut.svg"
    />
    <img
      v-else-if="method.module.includes('bharipay2')"
      src="@/assets/img/gateway/apple.svg"
    />
    <img
      v-else-if="method.module.includes('teveio_stripe')"
      src="@/assets/img/gateway/apple.svg"
    />
    <img
      v-else-if="method.module.includes('nowpayments')"
      src="@/assets/img/gateway/coin.svg"
    />

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: ['method', 'default', 'select', 'selected'],
  computed: {
    ...mapState(['supportedGateway']),
    check() {
      return this.selected || (!Object.keys(this.select).length && this.default)
    },
  },
  methods: {
    ...mapActions({
      selectGateway: 'gateway/selectGateway',
    }),
    selectThis() {
      this.selectGateway(this.method)
    },
  },
}
</script>
