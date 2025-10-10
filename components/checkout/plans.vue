<template>
  <section id="selectProduct">
    <Label :number="1" :label="$t('checkout.choose')"></Label>
    <div id="products">
      <Product
        v-for="(product, index) in products.products"
        :key="index"
        :pid="product.pid"
        :name="
          product.name.split(' ')[0] +
          ' ' +
          (product.name.split(' ')[0] == 1
            ? $t('checkout.monthPass')
            : $t('checkout.monthsPass'))
        "
        :price="product.pricing[$t('currency.currency')]"
        :product="product"
        :description="product.description"
      ></Product>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import Label from '../addons/label'
import Product from '../addons/product'
export default {
  name: 'products',
  computed: {
    ...mapState(['pid', 'products']),
  },
  components: {
    Label,
    Product,
  },
}
</script>
