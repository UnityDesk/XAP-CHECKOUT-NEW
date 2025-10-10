<template>
  <div @click="toggleExtra" id="extraConnect" :class="{ pid: pid }">
    <div class="content">
      <img src="@/assets/img/order/extraConnect.svg" alt="extra connect" />
      <div class="info">
        <p class="title">{{ $t('checkout.extraConnection.title') }}</p>
        <p class="description">
          {{ $t('checkout.extraConnection.description.noPid') }}
        </p>
      </div>
    </div>
    <client-only>
      <div class="pricing">
        <p class="price" v-if="extraConnectPrice && products.connectionCount > 1">
          {{ total || extraConnectPrice
          }}<span>{{ $t('currency.symbole') }}</span
          ><template
            v-if="
              products.products[computedPid] &&
              products.products[computedPid].paytype !== 'onetime'
            "
            >/{{ !pid && !width ? $t('checkout.month') : 'mo' }}
          </template>
        </p>

        <div class="check" :class="{ enabled: products.connectionCount > 1 }">
          <div class="img-wrapper">
            <img
              v-if="products.connectionCount > 1"
              src="@/assets/img/check.svg"
              alt="check"
            />

            <img v-else src="@/assets/img/plus.svg" alt="plus" />
          </div>

          <p>
            {{ products.connectionCount > 1 ? 'Added' : 'Add' }}
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
          return this.products.products[pid].configoptions.configoption[0]
      return false
    },
    extraConnectPrice() {
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
        const singleConnectionPrice = Number(price / div).toFixed(2)
        
        // Calculate total price based on connection count
        const connectionCount = this.products.connectionCount || 1
        const additionalConnections = Math.max(0, connectionCount - 1)
        const totalPrice = (additionalConnections * Number(singleConnectionPrice)).toFixed(2)
        
        console.log('ExtraConnect price calculation:', {
          singleConnectionPrice,
          connectionCount,
          additionalConnections,
          totalPrice
        })
        
        return totalPrice
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
                (this.extraConnectPrice *
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
      editExtraConnect: 'products/editExtraConnect',
    }),
    toggleExtra() {
      this.editExtraConnect()
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
