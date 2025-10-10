<template>
  <div
    class="product"
    :pid="pid"
    ref="product"
    :class="{
      default: defaultProduct,
      selected: selected || (products.selectedPid === '' && defaultProduct),
    }"
    @click="selectThis"
  >
    <div class="sold">
      <p>
        {{ $t('checkout.lastSold') }}:
        <span>{{ sold }} {{ $t('checkout.ago') }}</span>
      </p>
    </div>

    <div class="productSelect">
      <div class="checkbox"></div>

      <div class="productDetails">
        <p class="name">{{ name }}</p>

        <p class="price">
          {{ finalPrice
          }}<span>{{ $t('currency.symbole') + (width ? ' /mo' : '') }}</span>
        </p>
      </div>
    </div>
    <div class="save">
      <p>
        {{
          $t('checkout.save') +
          ' ' +
          (description.split(',').length > 1 ? description.split(',')[0] : '0')
        }}%
      </p>
    </div>
    <p class="guarantee">
      {{
        (description.split(',').length > 1 ? description.split(',')[1] : '30') +
        $t('checkout.guaranteeBack')
      }}
    </p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import smoothscroll from 'smoothscroll-polyfill'
export default {
  props: ['pid', 'name', 'price', 'product', 'description'],
  data() {
    return {
      finalPrice: '',
      width: false,
    }
  },
  computed: {
    ...mapState(['products', 'defaultPid']),
    selected() {
      return this.pid == this.products.selectedPid
    },
    defaultProduct() {
      return this.pid == this.defaultPid
    },
    sold: {
      cache: 'false',
      get() {
        return Math.floor(Math.random() * (90 - 10 + 1) + 10) + 's'
      },
    },
  },
  mounted() {
    smoothscroll.polyfill()
    this.width = window.innerWidth <= 700
    if (this.defaultPid == this.$refs.product.getAttribute('pid')) {
      this.selectProduct(this.defaultPid)
    }
    if (this.pricing()) {
      const productInfo = this.pricing()
      let div
      switch (productInfo.billingcycle) {
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

      this.finalPrice = Number(productInfo.price / div).toFixed(2)
      this.getExtraConnectId(this.product.configoptions.configoption[0].id)
    }
  },
  methods: {
    ...mapActions({
      selectProduct: 'products/selectProduct',
      getExtraConnectId: 'products/getExtraConnectId',
      getProxyProtectId: 'products/getProxyProtectId',
      clearDiscount: 'products/clearDiscount',
    }),
    selectThis() {
      const pid = this.$refs.product.getAttribute('pid')
      const actuelPid = this.defaultPid || this.products.selectedPid
      if (pid != actuelPid) this.clearDiscount()
      this.selectProduct(pid)
      window.scrollTo({
        top:
          this.$parent.$parent.$children[1].$refs.extraConnect.offsetTop - 60,
        behavior: 'smooth',
      })
      this.getExtraConnectId(
        this.product.configoptions.configoption[0]
          ? this.product.configoptions.configoption[0].id
          : ''
      )
      this.getProxyProtectId(
        this.product.configoptions.configoption[1]
          ? this.product.configoptions.configoption[1].id
          : ''
      )
    },

    pricing() {
      for (let i in this.price) {
        if (this.price[i] > 0)
          return {
            billingcycle: i,
            price: this.price[i],
          }
      }
    },
  },
}
</script>
