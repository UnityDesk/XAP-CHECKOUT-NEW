<template>
  <div id="spacer" @click="selectThis">
    <div class="spacer">
      <img src="@/assets/img/order/cccambox.svg" alt="logo" />
      <div class="productInfo">
        <p class="productEndDate">{{ nextduedate }}</p>
        <p class="productName">{{ name }}</p>
        <p class="availableConnection">
          Available Connection =
          {{ availableConnection }}
        </p>
      </div>
    </div>
    <div class="checkbox"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: ['nextduedate', 'name', 'availableConnection', 'pid'],
  methods: {
    ...mapActions({
      updateSelectedId: 'upsell/updateSelectedId',
      getExtraProduct: 'upsell/getExtraProduct',
      updateExtraQuantity: 'upsell/updateExtraQuantity',
    }),
    async selectThis() {
      this.updateSelectedId(this.pid)
      this.updateExtraQuantity(1)
      await this.getExtraProduct()
    },
  },
}
</script>
