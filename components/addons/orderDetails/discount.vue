<template>
  <div>
    <div @click="discount" id="active" v-if="width && !visible">
      {{ $t('checkout.promoCode') }}
    </div>
    <div
      id="discount"
      :class="{
        valid: !!Object.keys(products.discount).length,
        error: error,
        loading: loading,
      }"
      v-else
    >
      <p class="errorMessage" v-if="error && errorMessage">
        {{ errorMessage }}
      </p>
      <div class="inputDiv">
        <input
          type="text"
          name="discount"
          id="discountCode"
          :placeholder="$t('checkout.discount.placeholder')"
          ref="discount"
          :value="code"
        />
        <button
          @click="check"
          class="apply"
          :class="{
            loading: loading,
            valid: Object.keys(products.discount).length,
            error: error,
          }"
          :disabled="loading"
        >
          {{
            !loading && !Object.keys(products.discount).length
              ? $t('checkout.apply')
              : ''
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState(['products']),
    code() {
      return Object.keys(this.products.discount).length
        ? this.products.discount.code
        : ''
    },
  },
  data() {
    return {
      loading: false,
      error: false,
      errorMessage: '',
      visible: false,
      width: false,
    }
  },
  methods: {
    ...mapActions({ checkDiscount: 'products/checkDiscount' }),
    async check() {
      this.loading = true
      const response = await this.checkDiscount(this.$refs.discount.value)
      this.error = !response.valid && !!response.errorMessage
      this.errorMessage = response.errorMessage
      this.loading = false
    },
    discount() {
      this.visible = true
    },
  },
  mounted() {
    this.width = window.innerWidth <= 850
  },
}
</script>
