<template>
  <div id="selectProduct2">
    <div class="selectIptv">Select THE IPTV subscription</div>
    <img src="@/assets/img/chevrons-down.svg" alt="chevron" class="chevron" />
    <div class="productsDiv">
      <Spacer
        class="productSelect"
        v-for="(activeProduct, i) in upsell.activeProducts"
        :key="i"
        :class="{ selected: activeProduct.id == upsell.selectedId }"
        :pid="activeProduct.id"
        :nextduedate="
          activeProduct.nextduedate === '0000-00-00'
            ? 'All Time'
            : activeProduct.nextduedate
        "
        :name="activeProduct.name"
        :availableConnection="activeProduct.configoptions.configoption[0].value"
      ></Spacer>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Spacer from './spacer'
export default {
  components: {
    Spacer,
  },
  computed: {
    ...mapState(['upsell']),
  },
}
</script>
