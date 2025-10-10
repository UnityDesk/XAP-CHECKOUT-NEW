<template>
  <div class="wrapper" v-if="paymentAvailable">
    <div id="gatewayEdit">
      <div ref="gateway">
        <p v-if="isNowPayments">Crypto Payment</p>
        <p v-else-if="isTeveioStripe">Apple & Google Pay</p>
        <p v-else>Payment</p>

        <img
          v-if="isNowPayments"
          src="@/assets/img/gateway/crypto.svg"
          alt="NOWPayments"
          class="card"
        />
        <img
          v-else-if="isTeveioStripe"
          src="@/assets/img/gateway/apple.svg"
          alt="Apple & Google Pay"
          class="card"
        />
        <img
          v-else
          src="@/assets/img/gateway/apple.svg"
          alt="BhariPay2"
          class="card"
        />
      </div>

      <div v-if="showPayWarning" class="text-yellow-300 text-sm mb-4">
        Apple & Google Pay is not available on this device or browser.
      </div>

      <a
        v-if="paymentUrl"
        :href="paymentUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-pay"
      >
        Pay Now
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['payment', 'order']),
    paymentUrl() {
      return this.payment?.nowpayments_url || this.payment?.bharipay2_url || this.payment?.teveio_stripe_url
    },
    isNowPayments() {
      return Boolean(this.payment?.nowpayments_url)
    },
    isTeveioStripe() {
      return Boolean(this.payment?.teveio_stripe_url)
    },
    paymentAvailable() {
      return (
        this.paymentUrl &&
        this.order &&
        typeof this.order.fraud !== 'undefined' &&
        !this.order.fraud
      )
    },
  },
}
</script>
