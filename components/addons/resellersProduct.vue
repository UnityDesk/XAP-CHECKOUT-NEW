<template>
  <div
    v-if="product.paytype !== 'free'"
    class="product"
    :pid="pid"
    ref="product"
    :class="{
      default: defaultProduct,
      selected: selected || (resellers.selectedPid === '' && defaultProduct),
      bonus,
    }"
    @click="selectThis()"
  >
    <p class="price">
      {{ Number(price.monthly).toFixed(0) + $t('currency.symbole') }}
    </p>
    <div class="ccc_bonus" v-if="bonus">
      {{ bonus + ' ' + $t('resellers.product.bonus') }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import smoothscroll from 'smoothscroll-polyfill'
export default {
  props: ['pid', 'price', 'product'],
  data() {
    return {
      width: false,
    }
  },
  computed: {
    ...mapState(['resellers', 'defaultReselPid']),
    selected() {
      return this.pid == this.resellers.selectedPid
    },
    defaultProduct() {
      return this.pid == this.defaultReselPid
    },
    bonus() {
      const bonus = this.product.customfields.customfield.find(
        (e) => e.name === 'Bonus'
      )
      return bonus ? bonus.description : undefined
    },
  },
  mounted() {
    smoothscroll.polyfill()
  },
  methods: {
    ...mapActions({
      selectProduct: 'resellers/selectProduct',
    }),
    selectThis() {
      const pid = this.$refs.product.getAttribute('pid')
      this.selectProduct(pid)
      window.scrollTo({
        top:
          document.querySelector('#ccc_existing').getBoundingClientRect().top +
          window.scrollY -
          80,
        behavior: 'smooth',
      })
    },
  },
}
</script>
