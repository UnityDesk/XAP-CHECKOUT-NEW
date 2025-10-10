export const state = () => ({
  offshore_url: '',
  coinbase_url: '',
  cryptomus_url: '',
  teveio_stripe_url: '',
  offshoreUpsell_url: '',
  coinbaseUpsell_url: '',
})

export const actions = {
  async offshore(context) {
    const response = await this.$axios.$get('/checkout/api/offshore', {
      params: {
        invoice: context.rootState.order.invoiceid,
        amount:
          context.rootState.products.totalPrice ||
          context.rootState.products.price,
        currency: context.rootState.currency.currency,
      },
    })

    if (response)
      context.commit('updateUrl', {
        offshore_url: response,
      })
    return response
  },

  async coinbase(context) {
    const pid =
      context.rootState.pid ||
      context.rootState.products.selectedPid ||
      context.rootState.defaultPid

    const response = await this.$axios.$get('/checkout/api/coinbase', {
      params: {
        invoiceid: context.rootState.order.invoiceid,
        amount:
          context.rootState.products.totalPrice ||
          context.rootState.products.price,
        currency: context.rootState.currency.currency,
        clientid: context.rootState.user.clientid,
        pid,
      },
    })

    if (response)
      context.commit('updateUrl', {
        coinbase_url: response,
      })
    return response
  },

  async offshoreUpsell(context) {
    const serviceId = context.rootState.upsell.selectedId,
      selectedProduct = context.rootState.upsell.activeProducts[serviceId],
      extraQuantity = context.rootState.upsell.extraQuantity,
      billingcycle =
        selectedProduct.billingcycle === 'One Time'
          ? 'monthly'
          : selectedProduct.billingcycle.toLowerCase().replaceAll('-', ''),
      price =
        context.rootState.upsell.pricing[
          context.rootState.userCurrency.currency
        ][billingcycle],
      totalPrice = (Number(price) * extraQuantity).toFixed(2)
    const response = await this.$axios.$get('/checkout/api/offshore', {
      params: {
        invoice: context.rootState.invoice.invoiceid,
        amount: totalPrice,
        currency: context.rootState.userCurrency.currency,
      },
    })

    if (response)
      context.commit('updateUrl', {
        offshoreUpsell_url: response,
      })
    return response
  },

  async coinbaseUpsell(context) {
    const serviceId = context.rootState.upsell.selectedId,
      selectedProduct = context.rootState.upsell.activeProducts[serviceId],
      extraQuantity = context.rootState.upsell.extraQuantity,
      billingcycle =
        selectedProduct.billingcycle === 'One Time'
          ? 'monthly'
          : selectedProduct.billingcycle.toLowerCase().replaceAll('-', ''),
      price =
        context.rootState.upsell.pricing[
          context.rootState.userCurrency.currency
        ][billingcycle],
      totalPrice = (Number(price) * extraQuantity).toFixed(2),
      pid = context.rootState.defaultPid
    const response = await this.$axios.$get('/checkout/api/coinbase', {
      params: {
        invoiceid: context.rootState.invoice.invoiceid,
        amount: totalPrice,
        currency: context.rootState.userCurrency.currency,
        clientid: context.rootState.user.clientid,
        pid,
      },
    })

    if (response)
      context.commit('updateUrl', {
        coinbaseUpsell_url: response,
      })
    return response
  },

  clearPayment(context) {
    context.commit('updateUrl', {
      offshore_url: '',
      coinbase_url: '',
      cryptomus_url: '',
      teveio_stripe_url: '',
    })
  },

  clearUpsellPayment(context) {
    context.commit('updateUrl', {
      offshoreUpsell_url: '',
      coinbaseUpsell_url: '',
    })
  },
}

export const mutations = {
  updateUrl: (state, data) => {
    Object.assign(state, data)
  },
}
