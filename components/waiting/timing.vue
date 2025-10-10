<template>
  <div id="timing">
    <Status></Status>
    <Wait></Wait>
    <OrderInfo></OrderInfo>
    <Gateway></Gateway>
    <TimeScroll></TimeScroll>
  </div>
</template>

<script>
import Status from '../addons/waiting/status'
import Wait from '../addons/waiting/wait'
import OrderInfo from '../addons/waiting/orderInfo'
import TimeScroll from '../addons/waiting/timeScroll'
import Gateway from './gateway.vue'
export default {
  components: {
    Status,
    Wait,
    OrderInfo,
    TimeScroll,
    Gateway,
  },
}
</script>
