<template>
  <div id="gatewayChange">
    <Gateway></Gateway>
    <Abord></Abord>
  </div>
</template>

<script>
import Gateway from '../gateway'
import Abord from './abord'
export default {
  components: {
    Abord,
    Gateway,
  },
}
</script>
