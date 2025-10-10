<template>
  <Pricing
    :src="require('@/assets/img/order/cccambox.svg')"
    :title="$t('resellers.newReseller')"
    :price="$t('resellers.free')"
  ></Pricing>
</template>

<script>
import Pricing from '../pricing'
export default {
  components: {
    Pricing,
  },
}
</script>
