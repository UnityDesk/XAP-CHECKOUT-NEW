export const state = () => ({
  username: '',
  password: '',
  status: '',
  name: '',
  serverhostname: '',
  macAddress: {
    id: '',
    value: '',
  },
  extraConnect: {
    id: '',
    value: '',
  },
  reseller: {
    name: '',
    status: '',
  },
})

export const actions = {
  async getClientProduct(context) {
    try {
      let response = await this.$axios.$get('/checkout/api/getClientProducts', {
        params: {
          clientid: context.rootState.auth.user.userid,
          serviceid: context.rootState.order.serviceid,
        },
      })
      // Always update the state if we have a valid response
      if (response && !response.error) {
        const { username, password, serverhostname, status, name } = response,
          macAddress = {
            id: response.customfields?.customfield?.[0]?.id || '',
            value: response.customfields?.customfield?.[0]?.value || '',
          },
          extraConnect = {
            id: response.configoptions?.configoption?.length
              ? response.configoptions.configoption[0].id
              : '',
            value: response.configoptions?.configoption?.length
              ? response.configoptions.configoption[0].value
              : '',
          }
        context.commit('getClientProduct', {
          username,
          password,
          serverhostname,
          macAddress,
          extraConnect,
          status,
          name,
        })
      }
      return response
    } catch (err) {
      console.log(err)
    }
  },

  async getResellerProduct(context, serviceid) {
    try {
      console.log({ serviceid, clientid: context.rootState.auth.user.userid })
      let response = await this.$axios.$get(
        '/checkout/api/getResellerProducts',
        {
          params: {
            clientid: context.rootState.auth.user.userid,
            serviceid: serviceid || context.rootState.order.serviceid,
          },
        }
      )
      // Always update the state if we have a valid response
      if (response && !response.error) {
        const { name, status } = response
        context.commit('getClientProduct', {
          reseller: { name, status },
        })
      }
      return response
    } catch (err) {
      console.log(err)
    }
  },

  async moduleTerminate(context) {
    const response = await this.$axios.$get('/checkout/api/moduleTerminate', {
      params: {
        serviceid: context.rootState.order.serviceid,
      },
    })

    return response
  },

  async moduleCreate(context) {
    const response = await this.$axios.$get('/checkout/api/moduleCreate', {
      params: {
        serviceid: context.rootState.order.serviceid,
      },
    })

    return response
  },

  async restartService(context) {
    const response = await this.$axios.$get('/checkout/api/restartService', {
      params: {
        serviceid: context.rootState.order.serviceid,
      },
    })

    return response
  },

  async updateClientsProducts(context, data) {
    const response = await this.$axios.$get('/checkout/api/updateMacAddress', {
      params: {
        serviceid: context.rootState.order.serviceid,
        macAddress: data,
        id: context.state.macAddress.id,
      },
    })

    if (response.result === 'success') context.commit('updateMacAddress', data)
    return response
  },

  removeClientProduct(context) {
    context.commit('removeClientProduct')
  },
}

export const mutations = {
  updateMacAddress: (state, macAddress) => {
    state.macAddress.value = macAddress
  },

  getClientProduct: (state, data) => {
    Object.assign(state, data)
  },

  removeClientProduct: (state) => {
    Object.assign(state, {
      username: '',
      password: '',
      status: '',
      name: '',
      serverhostname: '',
      macAddress: {
        id: '',
        value: '',
      },
      extraConnect: {
        id: '',
        value: '',
      },
    })
  },
}
