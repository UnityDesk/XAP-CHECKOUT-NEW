<template>
  <div ref="paymentMethod" id="paymentMethod">
    <Label :number="3" :label="$t('checkout.selectPayment')"></Label>
    <div id="form">
      <UserInfo></UserInfo>
      <OrderDetails></OrderDetails>
    </div>
  </div>
</template>

<script>
import Label from '../addons/label'
import UserInfo from '../addons/resellerUserInfo'
import OrderDetails from '../addons/resellerOrderDetails'
export default {
  name: 'checkoutPaymentMethod',
  components: {
    Label,
    UserInfo,
    OrderDetails,
  },
}
</script>
