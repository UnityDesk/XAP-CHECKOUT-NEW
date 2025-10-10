<template>
  <div @click="toggleProxy" id="extraConnect" :class="{ pid: pid }">
    <div class="content">
      <img src="@/assets/img/order/proxy.svg" alt="proxy protection" />
      <div class="info">
        <p class="title">{{ $t('checkout.proxyProtection.title') }}</p>
        <p class="description">
          {{ $t('checkout.proxyProtection.description.noPid') }}
        </p>
      </div>
    </div>
    <client-only>
      <div class="pricing">
        <p class="price" v-if="proxyProtectionPrice">
          {{ total || proxyProtectionPrice
          }}<span>{{ $t('currency.symbole') }}</span
          ><template
            v-if="
              products.products[computedPid] &&
              products.products[computedPid].paytype !== 'onetime'
            "
            >/{{ !pid && !width ? $t('checkout.month') : 'mo' }}</template
          >
        </p>
        <div class="check" :class="{ enabled: products.proxyProtection }">
          <div class="img-wrapper">
            <img
              v-if="products.proxyProtection"
              src="@/assets/img/check.svg"
              alt="check"
            />

            <img v-else src="@/assets/img/plus.svg" alt="plus" />
          </div>

          <p>
            {{ products.proxyProtection ? 'Added' : 'Add' }}
          </p>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import smoothscroll from 'smoothscroll-polyfill'
export default {
  computed: {
    ...mapState(['products', 'defaultPid', 'pid']),
    computedPid() {
      return this.pid || this.products.selectedPid || this.defaultPid
    },
    extraConnect() {
      const pid = this.computedPid
      if (this.products.products[pid])
        if (Object.keys(this.products.products[pid].configoptions).length)
          return this.products.products[pid].configoptions.configoption[1]
    },
    proxyProtectionPrice() {
      if (this.extraConnect) {
        const price =
          this.extraConnect.options.option[0].pricing[
            this.$t('currency.currency')
          ][this.products.billingcycle]
        let div
        switch (this.products.billingcycle) {
          case 'monthly':
            div = 1
            break
          case 'quarterly':
            div = 3
            break
          case 'semiannually':
            div = 6
            break
          case 'annually':
            div = 12
            break
          case 'biennially':
            div = 24
            break
          case 'triennially':
            div = 36
            break
        }
        return Number(price / div).toFixed(2)
      }
    },
    total: {
      cache: false,
      get() {
        const pid = this.pid || this.products.selectedPid || this.defaultPid
        if (this.products.discount.type && this.products.discount.value) {
          if (this.products.discount.appliesto.includes(pid)) {
            if (this.products.discount.type === 'Percentage') {
              return (
                (this.proxyProtectionPrice *
                  (100 - Number(this.products.discount.value))) /
                100
              ).toFixed(2)
            }
          }
        }
      },
    },
  },
  data() {
    return {
      width: false,
    }
  },
  methods: {
    ...mapActions({
      editProxyProtection: 'products/editProxyProtection',
    }),
    toggleProxy() {
      this.editProxyProtection()
      if (!this.pid)
        window.scrollTo({
          top:
            this.$parent.$parent.$children[2].$refs.paymentMethod.offsetTop -
            60,
          behavior: 'smooth',
        })
    },
  },
  mounted() {
    smoothscroll.polyfill()
    this.width = window.innerWidth <= 700
  },
}
</script>
