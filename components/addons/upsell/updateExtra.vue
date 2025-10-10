<template>
  <div id="updateExtra">
    <p class="select">select number of connections to add</p>
    <no-ssr>
      <range-slider
        ref="slider"
        :min="ElementToAdd[0]"
        :max="ElementToAdd[1]"
        v-model="sliderValue"
        v-if="ElementToAdd.length"
      ></range-slider>
    </no-ssr>
    <div class="value" v-if="ElementToAdd.length">
      <p v-for="(el, key) in ElementToAdd[1] - ElementToAdd[0] + 1" :key="key">
        {{ key }}
      </p>
    </div>
    <div id="gateway" v-if="gateway.gateway.length">
      <PaymentMethod
        v-for="(method, i) in gateway.gateway"
        :key="i"
        :method="method"
        :default="method.module === gateway.defaultGateway.module"
        :selected="method.module === gateway.selectedGateway.module"
        :select="gateway.selectedGateway"
      >
      </PaymentMethod>
    </div>
    <div id="prodInfo">
      <ProductName
        v-if="Object.keys(upsell.activeProducts).length && upsell.selectedId"
      ></ProductName>
      <ExtraPrice
        v-if="sliderValue && totalPrice"
        :price="totalPrice + $t('currency.symbole')"
        :sliderValue="sliderValue"
      ></ExtraPrice>
    </div>
    <button
      :disabled="!sliderValue"
      class="upgrade"
      :class="{ loading: loading }"
      @click="upgrade"
    >
      {{ !loading ? 'UPGRADE NOW' : '' }}
    </button>
    <p class="terms">By signing up you agree to our T&C and Privacy Policy</p>
  </div>
</template>

<script>
import 'vue-range-slider/dist/vue-range-slider.css'
import { mapState, mapActions } from 'vuex'
import RangeSlider from 'vue-range-slider'
import PaymentMethod from '../paymentMethod'
import ProductName from './productName'
import ExtraPrice from './extraPrice'

export default {
  data() {
    return {
      error: false,
      loading: false,
      link: '',
    }
  },
  computed: {
    ...mapState(['gateway', 'upsell', 'user']),
    availableConnection: {
      cache: false,
      get() {
        return this.upsell.activeProducts[this.upsell.selectedId]
          ? Number(
              this.upsell.activeProducts[this.upsell.selectedId].configoptions
                .configoption[0].value
            )
          : ''
      },
    },
    ElementToAdd: {
      cache: false,
      get() {
        return [0, 5 - this.availableConnection]
      },
    },
    sliderValue: {
      cache: false,
      get() {
        return this.upsell.extraQuantity > this.ElementToAdd[1]
          ? this.ElementToAdd[1]
          : this.upsell.extraQuantity
      },
      set(val) {
        this.updateExtraQuantity(val)
      },
    },
    billingCycle: {
      cache: false,
      get() {
        return this.upsell.activeProducts[this.upsell.selectedId]
          ? this.upsell.activeProducts[
              this.upsell.selectedId
            ].billingcycle.toLowerCase()
          : ''
      },
    },
    pricing: {
      cache: false,
      get() {
        return this.upsell.pricing[this.$t('currency.currency')]
          ? this.upsell.pricing[this.$t('currency.currency')][
              this.billingCycle === 'one time'
                ? 'monthly'
                : this.billingCycle.split('-').join('')
            ]
          : ''
      },
    },
    totalPrice: {
      cache: false,
      get() {
        return (Number(this.pricing) * this.sliderValue).toFixed(2)
      },
    },
  },
  components: {
    RangeSlider,
    PaymentMethod,
    ProductName,
    ExtraPrice,
  },
  methods: {
    ...mapActions({
      updateExtraQuantity: 'upsell/updateExtraQuantity',
      updateFinalPrice: 'upsell/updateFinalPrice',
      addInvoice: 'invoice/addInvoice',
      offshoreUpsell: 'payment/offshoreUpsell',
      coinbaseUpsell: 'payment/coinbaseUpsell',
      signin: 'user/signin',
    }),

    async upgrade() {
      this.error = false
      this.loading = true
      if (!this.user.clientid) await this.signin()
      await this.addInvoice()
      const gateway =
        this.gateway.selectedGateway.module ||
        this.gateway.defaultGateway.module
      switch (gateway) {
        case 'offshore':
          this.link = await this.offshoreUpsell()
          break
        case 'coinbase':
          this.link = await this.coinbaseUpsell()
          break
        case 'teveio_stripe':
          this.link = await this.createTeveioStripeUpsell()
          break
      }
      this.loading = false
      window.location = this.link
    },

    async createTeveioStripeUpsell() {
      const response = await this.$axios.$get('/checkout/api/order', {
        params: {
          userid: this.user.clientid,
          ip: this.$store.state.ipCountry,
          country: this.$store.state.codeCountry,
          pid: this.upsell.selectedId,
          paymentmethod: 'teveio_stripe',
          amount: this.totalPrice,
          currency: this.$t('currency.currency'),
          configoptions: JSON.stringify({
            extraQuantity: this.sliderValue
          }),
        },
      })
      
      if (response.link) {
        return response.link
      } else {
        throw new Error('Failed to create Teveio Stripe upsell order')
      }
    },
  },
}
</script>
