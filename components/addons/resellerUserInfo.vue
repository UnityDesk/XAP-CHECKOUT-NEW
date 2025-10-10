<template>
  <client-only>
    <div id="userInfo">
      <div class="typeError" v-if="error.type">
        {{
          resellers.existingReseller
            ? $t('resellers.error.notExisting')
            : $t('resellers.error.existing')
        }}
      </div>
      <form @submit.stop.prevent="validate()">
        <InputData
          :label="$t('resellers.resellerEmail')"
          :type="'email'"
          :required="true"
          :placeholder="$t('checkout.emailAddress.placeholder')"
          :readOnly="$auth.loggedIn && $auth.user.userid && !!user.email"
          :value="user.email"
          :error="error.email"
        ></InputData>
        <InputData
          :label="$t('checkout.password.label')"
          :type="'password'"
          :required="true"
          :placeholder="$t('checkout.password.placeholder')"
          :value="user.password"
          :error="error.password"
          v-if="!resellers.existingReseller"
        ></InputData>
        <InputData
          :label="$t('resellers.confirmPass')"
          :type="'password'"
          :required="true"
          :placeholder="$t('checkout.password.placeholder')"
          :value="resellers.confirmPassword"
          :error="!resellers.samePswrd"
          @confirmPass="input"
          :confirmPassword="true"
          v-if="!resellers.existingReseller"
        ></InputData>
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
        <div id="pricing">
          <ResellerPlan v-if="!resellers.existingReseller"></ResellerPlan>
          <ProductPrice></ProductPrice>
          <Total v-if="!resellers.existingReseller"></Total>
        </div>
        <button
          id="validate"
          :disabled="loading"
          type="submit"
          :class="{ loading: loading }"
        >
          {{ !loading ? $t('checkout.continue') : '' }}
          <img
            src="@/assets/img/arrowLeft.svg"
            alt="arrow left"
            v-if="!loading"
          />
        </button>
        <p id="moneyback">
          <img src="@/assets/img/moneyback.png" alt="money back" />
          {{ $t('checkout.moneyBack') }}
        </p>
      </form>
    </div>
  </client-only>
</template>

<script>
import MailChecker from 'mailchecker'
import { mapState, mapActions } from 'vuex'
import InputData from './input'
import PaymentMethod from './paymentMethod'
import ProductPrice from './pricing/resellersProductPrice'
import ResellerPlan from './pricing/resellerPlan'
import ExtraConnect from './pricing/extraConnectPrice'
import ProxyProtect from './pricing/proxyProtectPrice'
import Discount from './pricing/discountReduction'
import Total from './resellersTotal'
export default {
  data() {
    return {
      loading: false,
      link: '',
      error: {
        email: false,
        password: false,
        confirmPassword: false,
        type: false,
      },
    }
  },
  components: {
    InputData,
    PaymentMethod,
    ProductPrice,
    ExtraConnect,
    ProxyProtect,
    Discount,
    Total,
    ResellerPlan,
  },
  computed: {
    ...mapState([
      'resellers',
      'gateway',
      'defaultReselPid',
      'user',
      'order',
      'waiting',
      'productDetails',
      'fraudCheck',
    ]),
  },
  methods: {
    ...mapActions({
      auth: 'resellers/auth',
      confirmPassword: 'resellers/confirmPassword',
      isSame: 'resellers/isSame',
      orderProcess: 'resellers/order',
    }),
    input(pswrd) {
      this.confirmPassword(pswrd)
    },
    async login() {
      try {
        if (
          this.resellers.existingReseller ||
          (this.resellers.samePswrd &&
            this.resellers.confirmPassword &&
            this.user.valid)
        ) {
          const data = await this.auth()
          this.error.type = !!data.error
          if (!data.error) this.$auth.setUser(data)
          return data
        }
        this.error.email = MailChecker.isValid(this.user.email) === false
        this.error.password = this.user.password.length < 8
        return { error: true }
      } catch (err) {
        return (this.errorMessage = this.$t('login.error.emailPass'))
      }
    },
    async orderNow() {
      try {
        return await this.orderProcess()
      } catch (err) {
        console.log({ err })
      }
    },
    async validate() {
      try {
        this.loading = true
        let tab
        tab = window.open('/checkout/creatingOrder', '_black')
        let data = {}
        // console.log(!this.$auth.loggedIn || !this.$auth.user.userid)
        if (!this.$auth.loggedIn || !this.$auth.user.userid)
          data = await this.login()
        if (data.error) {
          this.loading = false
          return tab.close()
        }
        const { error, fraud, link } = await this.orderNow()
        if (!error) tab.location.assign(link)
        else if (fraud && tab)
          tab.location.assign('/checkout/creatingOrder?fraud=true')
        this.$router.push(this.localePath('/resellers/waiting'))
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log({ err })
      }
    },
  },
  watch: {
    '$store.state.user.email': function (newValue, oldValue) {
      this.error.email = false
      this.error.type = false
    },
    '$store.state.user.password': function (newValue, oldValue) {
      this.error.password = false
      if (this.resellers.samePswrd && this.resellers.confirmPassword)
        this.isSame(newValue === this.resellers.confirmPassword)
    },
    '$store.state.resellers.confirmPassword': function (newValue, oldValue) {
      this.isSame(this.user.password === newValue)
    },
    '$store.state.resellers.existingReseller': function () {
      this.error.type = false
    },
  },
}
</script>
