<template>
  <client-only>
    <div>
      <div class="label">
        <div>
          <img src="@/assets/img/cart.svg" alt="shopping cart" />
        </div>

        <p>
          {{ $t('checkout.selectPayment') }}
        </p>
      </div>

      <div id="userInfo">
        <form @submit.stop.prevent="validate()">
          <InputData
            :label="$t('checkout.emailAddress.label')"
            :type="'email'"
            :required="true"
            :placeholder="$t('checkout.emailAddress.placeholder')"
            :readOnly="$auth.loggedIn && $auth.user.userid && user.email"
            :value="user.email"
            :error="error.email"
          ></InputData>
          <div id="gateway" v-if="gateway.gateway.length && !freeOrder">
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
          <div id="pricing" :class="{ freeOrder: freeOrder }">
            <transition name="slide-fade" mode="out-in">
              <ProductPrice></ProductPrice>
            </transition>
            <transition name="slide-fade" mode="out-in">
              <ExtraConnect
                v-if="products.extraConnection && !freeOrder"
              ></ExtraConnect>
            </transition>
            <transition name="slide-fade" mode="out-in">
              <ProxyProtect
                v-if="products.proxyProtection && !freeOrder"
              ></ProxyProtect>
            </transition>
            <transition name="slide-fade" mode="out-in">
              <Discount
                v-if="Object.keys(products.discount).length && !freeOrder"
              ></Discount>
            </transition>
            <transition name="slide-fade" mode="out-in">
              <Total
                v-if="
                  (products.extraConnection ||
                    products.proxyProtection ||
                    Object.keys(products.discount).length) &&
                  !freeOrder
                "
              ></Total>
            </transition>
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

          <div class="notices">
            <div class="special-notice">
              <img src="@/assets/img/lock.svg" alt="money back" />

              <p>BANK-LEVEL SECURITY</p>
            </div>

            <p class="notice" v-if="!freeOrder">
              <img src="@/assets/img/moneyback-1.svg" alt="money back" />

              {{ $t('checkout.moneyBack') }}
            </p>

            <p class="notice" v-if="!freeOrder">
              <img src="@/assets/img/like.svg" alt="money back" />

              These are not memberships/subscriptions. We don't do automatic
              rebilling/renewal. When you're out of days, it's 100% up to you if
              you want to purchase more days (or not).
            </p>
          </div>

          <div
            @click="mail_check = !mail_check"
            class="email_subscription"
            :class="{ active: mail_check }"
          >
            <div class="checkbox"></div>
            I WOULD LIKE TO SUBSCRIBE TO THE NEWSLETTER TO HEAR ABOUT OFFERS AND
            SERVICES
          </div>
        </form>
      </div>

      <div class="notices">
        <div class="special-notice">
          <img src="@/assets/img/lock.svg" alt="money back" />

          <p>BANK-LEVEL SECURITY</p>
        </div>

        <p class="notice" v-if="!freeOrder">
          <img src="@/assets/img/moneyback-1.svg" alt="money back" />

          {{ $t('checkout.moneyBack') }}
        </p>

        <p class="notice" v-if="!freeOrder">
          <img src="@/assets/img/like.svg" alt="money back" />

          These are not memberships/subscriptions. We don't do automatic
          rebilling/renewal. When you're out of days, it's 100% up to you if you
          want to purchase more days (or not).
        </p>
      </div>

      <DiscountInput />
    </div>
  </client-only>
</template>

<script>
import MailChecker from 'mailchecker'
import { mapState, mapActions } from 'vuex'
import InputData from './input'
import PaymentMethod from './paymentMethod'
import ProductPrice from './pricing/productPrice'
import ExtraConnect from './pricing/extraConnectPrice'
import ProxyProtect from './pricing/proxyProtectPrice'
import Discount from './pricing/discountReduction'
import DiscountInput from './orderDetails/discount'
import Total from './total'
export default {
  data() {
    return {
      loading: false,
      link: '',
      error: {
        email: false,
        password: false,
      },
      mail_check: false,
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
    DiscountInput,
  },
  computed: {
    ...mapState([
      'products',
      'gateway',
      'pid',
      'defaultPid',
      'user',
      'order',
      'waiting',
      'productDetails',
      'fraudCheck',
    ]),
    freeOrder: {
      cache: false,
      get: function () {
        const pid = this.pid || this.products.selectedPid || this.defaultPid
        if (this.products.products[pid])
          return this.products.products[pid].paytype === 'free'
      },
    },
  },
  methods: {
    ...mapActions({
      auth: 'user/auth',
      orderProcess: 'order',
    }),
    async login() {
      try {
        if (this.user.valid) {
          const data = await this.auth()
          return this.$auth.setUser(data)
        }
        this.error.email = MailChecker.isValid(this.user.email) === false
        this.error.password = this.user.password.length < 8
      } catch (err) {
        return (this.errorMessage = this.$t('login.error.emailPass'))
      }
    },
    async orderNow() {
      try {
        if (!this.$auth.loggedIn) return
        return await this.orderProcess()
      } catch (err) {
        console.log({ err })
      }
    },
    async validate() {
      try {
        this.loading = true
        let tab
        if (!this.user.email) {
          this.loading = false
          this.error.email = true
          return
        }
        tab = window.open('/checkout/creatingOrder', '_black')
        if (!this.$auth.loggedIn || !this.$auth.user.userid) await this.login()
        const { error, fraud, link } = await this.orderNow()
        if (!error) tab.location.replace(link)
        else if (fraud && tab)
          tab.location.replace('/checkout/creatingOrder?fraud=true')
        this.$router.push(this.localePath('/waiting'))
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
    },
    '$store.state.user.password': function (newValue, oldValue) {
      this.error.password = false
    },
  },
}
</script>
