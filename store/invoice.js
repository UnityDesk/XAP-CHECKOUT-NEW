export const state = () => ({
  invoiceid: '',
})

export const actions = {
  async addInvoice(context) {
    try {
      const userid = context.rootState.auth.user.userid,
        paymentmethod =
          context.rootState.gateway.selectedGateway.module ||
          context.rootState.gateway.defaultGateway.module,
        extraQuantity = context.rootState.upsell.extraQuantity,
        serviceId = context.rootState.upsell.selectedId,
        selectedProduct = context.rootState.upsell.activeProducts[serviceId],
        billingcycle =
          selectedProduct.billingcycle === 'One Time'
            ? 'monthly'
            : selectedProduct.billingcycle.toLowerCase().replaceAll('-', ''),
        price =
          context.rootState.upsell.pricing[
            context.rootState.userCurrency.currency
          ][billingcycle],
        totalPrice = (Number(price) * extraQuantity).toFixed(2)
      console.log({ billingcycle, price, totalPrice })
      const response = await this.$axios.$get('/checkout/api/addInvoice', {
        params: {
          userid,
          paymentmethod,
          serviceId,
          extraQuantity,
          price: totalPrice,
        },
      })

      context.commit('addInvoice', response.invoiceid)
    } catch (err) {
      console.log(err)
    }
  },
}

export const mutations = {
  addInvoice(state, invoiceid) {
    state.invoiceid = invoiceid
  },
}
