<template>
  <div id="orderDetails">
    <Includes v-if="!width"></Includes>
  </div>
</template>

<script>
import Includes from './orderDetails/resellersIncludes'
export default {
  data() {
    return {
      width: false,
    }
  },
  components: {
    Includes,
  },
  mounted() {
    this.width = window.innerWidth <= 850
  },
}
</script>
