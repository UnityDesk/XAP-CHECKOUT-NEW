<template>
  <div id="timing">
    <Status></Status>
    <Wait></Wait>
    <OrderInfo></OrderInfo>
    <TimeScroll></TimeScroll>
  </div>
</template>

<script>
import Status from '../../addons/waiting/status'
import Wait from '../../addons/waiting/reseller/wait'
import OrderInfo from '../../addons/waiting/orderInfo'
import TimeScroll from '../../addons/waiting/timeScroll'
export default {
  components: {
    Status,
    Wait,
    OrderInfo,
    TimeScroll,
  },
}
</script>
