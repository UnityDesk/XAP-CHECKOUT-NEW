export const state = () => ({
  products: {},
  selectedPid: '',
  billingcycle: '',
  extraConnection: false,
  extraConnection2: false,
  extraConnection3: false,
  extraConnection4: false,
  proxyProtection: false,
  connectionCount: 1,
  price: '',
  totalPrice: '',
  extraId: '',
  proxyId: '',
  discount: {},
  notFound: false,
})

export const actions = {
  async getProducts(context) {
    try {
      const response = await this.$axios.$get('/checkout/api/getProducts', {})
      if (!response.totalresults)
        return context.commit('updateProducts', {
          notFound: true,
        })
      context.commit('updateProducts', {
        notFound: false,
      })
      const productSlice = response.products.product.slice(0, 3)
      const products = {}
      for (let i in productSlice) {
        products[productSlice[i].pid] = productSlice[i]
      }
      context.commit('updateProducts', { products })
      const extraId = response.products.product[0].configoptions.configoption[0]
          ? response.products.product[0].configoptions.configoption[0].id
          : '',
        proxyId = response.products.product[0].configoptions.configoption[1]
          ? response.products.product[0].configoptions.configoption[1].id
          : ''
      context.commit('updateProducts', { extraId })
      context.commit('updateProducts', { proxyId })
      return response
    } catch (err) {
      context.commit('updateProducts', {
        notFound: true,
      })
    }
  },

  async getProduct(context, pid) {
    try {
      const response = await this.$axios.$get('/checkout/api/getProduct', {
        params: {
          pid: context.rootState.pid || pid,
        },
      })
      if (!response.totalresults)
        return context.commit('updateProducts', { notFound: true })
      context.commit('updateProducts', { notFound: false })
      const products = {}
      products[response.products.product[0].pid] = response.products.product[0]
      context.commit('updateProducts', { products })
      const extraId = response.products.product[0].configoptions.configoption[0]
          ? response.products.product[0].configoptions.configoption[0].id
          : '',
        proxyId = response.products.product[0].configoptions.configoption[1]
          ? response.products.product[0].configoptions.configoption[1].id
          : ''
      context.commit('updateProducts', { extraId })
      context.commit('updateProducts', { proxyId })
      return response
    } catch (err) {
      console.log(err)
      context.commit('updateProducts', { notFound: true })
    }
  },

  async checkDiscount(context, code) {
    try {
      let errorMessage = ''
      const response = await this.$axios.$get('/checkout/api/getPromotion', {
        params: {
          code,
        },
      })
      if (response.result === 'success') {
        const pid =
          context.rootState.pid ||
          context.state.selectedPid ||
          context.rootState.defaultPid
        if (
          response.promotions.promotion[0].appliesto.split(',').includes(pid)
        ) {
          const promotion = response.promotions.promotion[0]
          context.commit('updateProducts', { discount: promotion })
        } else errorMessage = 'This Coupon is not available for this product.'
      } else errorMessage = response.message

      return {
        valid: response.totalresults === 1 && !errorMessage,
        errorMessage,
      }
    } catch (err) {
      console.log(err)
    }
  },

  selectProduct(context, selectedPid) {
    context.commit('updateProducts', { selectedPid })
  },

  updateBillingCycle(context, billingcycle) {
    context.commit('updateProducts', { billingcycle })
  },

  editExtraConnect(context) {
    context.commit('updateProducts', {
      extraConnection: !context.state.extraConnection,
    })
  },

  editProxyProtection(context) {
    context.commit('updateProducts', {
      proxyProtection: !context.state.proxyProtection,
    })
  },

  updateConnectionCount(context, count) {
    context.commit('updateProducts', {
      connectionCount: parseInt(count),
    })
  },

  disableExtraConnect(context) {
    try {
      context.commit('updateProducts', { extraConnection: false })
    } catch (err) {
      console.log(err)
    }
  },

  disableProxyProtection(context) {
    try {
      context.commit('updateProducts', { proxyProtection: false })
    } catch (err) {
      console.log(err)
    }
  },

  updatePrice(context, data) {
    context.commit('updateProducts', data)
  },

  getExtraConnectId(context, extraId) {
    context.commit('updateProducts', { extraId })
  },

  getProxyProtectId(context, proxyId) {
    context.commit('updateProducts', { proxyId })
  },

  clearDiscount(context) {
    context.commit('updateProducts', { discount: {} })
  },
}

export const mutations = {
  updateProducts: (state, data) => {
    Object.assign(state, data)
  },
}
