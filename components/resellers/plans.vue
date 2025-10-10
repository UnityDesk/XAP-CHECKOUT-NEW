<template>
  <div id="selectProduct">
    <Label :number="1" :label="$t('checkout.choose')"></Label>
    <div id="products">
      <Product
        v-for="(product, index) in resellers.products"
        :key="index"
        :pid="product.pid"
        :price="product.pricing[$t('currency.currency')]"
        :product="product"
      ></Product>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Label from '../addons/label'
import Product from '../addons/resellersProduct'
export default {
  name: 'products',
  computed: {
    ...mapState(['resellers']),
  },
  components: {
    Label,
    Product,
  },
}
</script>
