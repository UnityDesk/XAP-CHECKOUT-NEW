<template>
  <div class="upsell">
    <UpdateExtra></UpdateExtra>
    <SelectProduct></SelectProduct>
  </div>
</template>

<script>
import UpdateExtra from '../addons/upsell/updateExtra'
import SelectProduct from '../addons/upsell/selectProduct'
export default {
  components: {
    UpdateExtra,
    SelectProduct,
  },
}
</script>
