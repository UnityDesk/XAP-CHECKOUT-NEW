<template>
  <section ref="paymentMethod" id="paymentMethod">
    <Label
      :number="3"
      :label="$t('checkout.selectPayment')"
      v-if="!pid"
    ></Label>

    <div id="form">
      <UserInfo></UserInfo>
      <OrderDetails></OrderDetails>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import Label from '../addons/label'
import UserInfo from '../addons/userInfo'
import OrderDetails from '../addons/orderDetails'
export default {
  name: 'checkoutPaymentMethod',
  computed: {
    ...mapState(['pid']),
  },
  components: {
    Label,
    UserInfo,
    OrderDetails,
  },
}
</script>
