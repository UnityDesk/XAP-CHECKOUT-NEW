// import base64 from 'base-64'
// import { serialize } from 'php-serialize'

export const state = () => ({
  orderid: '',
  invoiceid: '',
  serviceid: '',
  fraud: false,
})

export const actions = {
  // async addOrder(context) {
  //   try {
  //     const ids = await this.$axios.$get(
  //       '/checkout/api/getProductCustomFields',
  //       {
  //         params: {
  //           id:
  //             context.rootState.pid ||
  //             context.rootState.products.selectedPid ||
  //             context.rootState.defaultPid,
  //         },
  //       }
  //     )
  //     const extraConnection = {},
  //       proxyProtection = {}
  //     extraConnection[context.rootState.products.extraId] = context.rootState
  //       .products.extraConnection
  //       ? 1
  //       : 0
  //     proxyProtection[context.rootState.products.proxyId] =
  //       context.rootState.products.proxyProtection
  //     const configoptions = base64.encode(
  //       serialize({
  //         ...extraConnection,
  //         ...proxyProtection,
  //       })
  //     )
  //     const domain =
  //       'TV-' + Math.floor(10 * 1000 * 1000 + Math.random() * 90 * 1000 * 1000)
  //     const rootpw = `${Math.floor(
  //       100 * 1000 * 1000 * 1000 + Math.random() * 900 * 1000 * 1000 * 1000
  //     )}`
  //     const username = {},
  //       password = {}
  //     username[ids['Username']] = domain
  //     password[ids['Password']] = rootpw
  //     const customfields = base64.encode(
  //       serialize({
  //         ...username,
  //         ...password,
  //       })
  //     )
  //     const response = await this.$axios.$get('/checkout/api/addOrder', {
  //       params: {
  //         clientid: context.rootState.user.clientid,
  //         paymentmethod:
  //           context.rootState.gateway.selectedGateway.module ||
  //           context.rootState.gateway.defaultGateway.module,
  //         pid:
  //           context.rootState.pid ||
  //           context.rootState.products.selectedPid ||
  //           context.rootState.defaultPid,
  //         configoptions,
  //         promocode: context.rootState.products.discount.code
  //           ? context.rootState.products.discount.code
  //           : '',
  //         clientip: context.rootState.ipCountry,
  //         customfields,
  //         affid: this.$cookiz.get('aff_id'),
  //       },
  //     })

  //     context.commit('editOrder', {
  //       orderid: response.orderid ? response.orderid : context.state.orderid,
  //       invoiceid: response.invoiceid
  //         ? response.invoiceid
  //         : context.state.invoiceid,
  //       serviceid: response.serviceids
  //         ? response.serviceids
  //         : context.state.serviceid,
  //     })
  //     return response
  //   } catch (err) {
  //     console.log(err)
  //   }
  // },

  async fraudCheck(context) {
    try {
      const response = await this.$axios.$get('/checkout/api/checkFraud', {
        params: {
          ip: context.rootState.ipCountry,
        },
      })

      context.commit('fraudCheck', !response.valid)
      return response
    } catch (err) {
      console.log(err)
    }
  },

  async fraudOrder(context) {
    try {
      const response = await this.$axios.$get('/checkout/api/fraudOrder', {
        params: {
          orderid: context.state.orderid,
        },
      })

      return response
    } catch (err) {
      console.log(err)
    }
  },

  async updateClientProduct(context, reason) {
    try {
      const response = await this.$axios.$get(
        '/checkout/api/updateClientProduct',
        {
          params: {
            serviceid: context.state.serviceid,
            notes: `${reason} - ${context.rootState.ipCountry} - ${context.rootState.codeCountry}`,
          },
        }
      )

      return response
    } catch (err) {
      console.log(err)
    }
  },

  async cancelOrder(context) {
    try {
      const response = await this.$axios.$get('/checkout/api/cancelOrder', {
        params: {
          orderid: context.state.orderid,
          clientid: context.rootState.auth?.user?.userid,
        },
      })

      context.commit('editOrder', {
        orderid: '',
        invoiceid: '',
        serviceid: '',
        fraud: false,
      })

      return response
    } catch (err) {
      console.log(err)
    }
  },

  clearData(context) {
    context.commit('editOrder', {
      orderid: '',
      invoiceid: '',
      serviceid: '',
      fraud: false,
    })
  },

  clearForSuccess(context) {
    context.commit('editOrder', {
      orderid: '',
      invoiceid: '',
    })
  },

  addServiceId(context, serviceid) {
    context.commit('editOrder', {
      serviceid,
    })
  },

  clearServiceId(context) {
    context.commit('editOrder', {
      serviceid: '',
    })
  },
}

export const mutations = {
  editOrder: (state, data) => {
    Object.assign(state, data)
  },

  fraudCheck: (state, fraud) => {
    state.fraud = fraud
  },
}
