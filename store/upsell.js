export const state = () => ({
  activeProducts: {},
  selectedId: '',
  extraQuantity: 1,
  pricing: {},
  finalPrice: '',
})

export const actions = {
  async getActiveProducts(context) {
    try {
      const response = await this.$axios.$get(
        '/checkout/api/getActiveProducts',
        {
          params: {
            clientid: context.rootState.auth.user.userid,
          },
        }
      )

      context.commit('updateActiveProducts', response)
    } catch (err) {
      console.log(err)
    }
  },

  async getExtraProduct(context) {
    try {
      const response = (
        await this.$axios.$get('/checkout/api/getProduct', {
          params: {
            pid: context.state.activeProducts[context.state.selectedId].pid,
          },
        })
      ).products.product[0].configoptions.configoption[0].options.option[0]
        .pricing

      context.commit('updateExtraPricing', response)
    } catch (err) {
      console.log(err)
    }
  },

  updateSelectedId(context, id) {
    context.commit('updateSelectedId', id)
  },

  updateExtraQuantity(context, quantity) {
    context.commit('updateExtraQuantity', quantity)
  },

  updateFinalPrice(context, price) {
    context.commit('updateFinalPrice', price)
  },
}

export const mutations = {
  updateActiveProducts(state, products) {
    state.activeProducts = products
    state.selectedId = Object.keys(products)[0]
  },

  updateExtraQuantity(state, quantity) {
    state.extraQuantity = quantity
  },

  updateSelectedId(state, id) {
    state.selectedId = id
  },

  updateExtraPricing(state, pricing) {
    state.pricing = pricing
  },

  // updateFinalPrice(state, price) {
  //   state.finalPrice = price
  // },
}
