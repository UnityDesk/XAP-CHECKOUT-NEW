import base64 from 'base-64'
import { serialize } from 'php-serialize'

export const state = () => ({
  products: {},
  selectedPid: '',
  notFound: false,
  existingReseller: false,
  confirmPassword: '',
  samePswrd: true,
  isReseller: undefined,
  confirmError: 'Not the same password',
})

export const actions = {
  async getProducts(context) {
    try {
      const response = await this.$axios.$get(
        '/checkout/api/getResellersProducts'
      )
      context.commit('updateProducts', {
        notFound: !response.totalresults,
      })
      if (!response.totalresults) return
      const products = {}
      for (let i in response.products.product) {
        products[response.products.product[i].pid] =
          response.products.product[i]
      }
      context.commit('updateProducts', { products })
      context.commit('updateProducts', {
        selectedPid: response.products.product[1].pid,
      })
      return response
    } catch (err) {
      context.commit('updateProducts', {
        notFound: true,
      })
    }
  },

  async userType(context) {
    try {
      const { error, reseller } = await this.$axios.$get(
        '/checkout/api/isReseller',
        {
          params: {
            email: context.rootState.user.email,
            userid: context.rootState.auth.user.userid,
          },
        }
      )
      if (error) return
      context.commit('updateProducts', {
        isReseller: reseller,
      })

      return { error, reseller }
    } catch (err) {
      console.log({ err })
    }
  },

  confirmPassword(context, pswrd) {
    context.commit('updateProducts', { confirmPassword: pswrd })
  },

  selectProduct(context, selectedPid) {
    context.commit('updateProducts', { selectedPid })
  },

  updatePrice(context, data) {
    context.commit('updateProducts', data)
  },

  existing(context, boolean) {
    context.commit('updateProducts', { existingReseller: boolean })
  },

  isSame(context, boolean) {
    context.commit('updateProducts', { samePswrd: boolean })
  },

  async auth(context) {
    try {
      const response = await this.$axios.$post('/checkout/api/resellerAuth', {
        email: context.rootState.user.email,
        password: context.rootState.user.password,
        country: context.rootState.codeCountry || 'MA',
        clientip: context.rootState.ipCountry,
        language: context.rootState.codeCountry == 'ES' ? 'spanish' : '',
        currency: context.rootState.currency.currency,
        existingReseller: context.state.existingReseller,
      })
      return response
    } catch (err) {
      console.log(err)
    }
  },

  async order(context) {
    try {
      const { existingReseller } = context.rootState.resellers
      let pid = [],
        productPid =
          context.rootState.resellers.selectedPid ||
          context.rootState.defaultReselPid,
        { newReselPid } = context.rootState
      pid.push(productPid)
      if (!existingReseller) pid.push(newReselPid)
      const { currency } = context.rootState.userCurrency
      const pswrd = {}
      pswrd[
        context.rootState.resellers.products[
          Number(newReselPid)
        ]?.customfields.customfield[0].id
      ] = context.rootState.user.password
      const customfields = [base64.encode(serialize({ ...pswrd }))]
      const paymentmethod =
        context.rootState.gateway.selectedGateway.module ||
        context.rootState.gateway.defaultGateway.module
      const response = await this.$axios.$get('/checkout/api/order', {
        params: {
          userid: context.rootState?.auth?.user?.userid,
          ip: context.rootState.ipCountry || '105.156.175.151',
          pid,
          paymentmethod,
          amount:
            context.rootState.resellers.products[productPid].pricing[currency]
              .monthly,
          currency,
          customfields,
        },
      })

      context.commit(
        'order/editOrder',
        {
          orderid: response.orderid,
          invoiceid: response.invoiceid,
          serviceid: response.serviceids,
          fraud: response.fraud,
        },
        { root: true }
      )

      if (response.link) {
        context.dispatch('waiting/addLastDate', '', { root: true })
        switch (paymentmethod) {
          case 'offshore':
            context.commit(
              'payment/updateUrl',
              {
                offshore_url: response.link,
              },
              { root: true }
            )
          case 'coinbase':
            context.commit(
              'payment/updateUrl',
              {
                coinbase_url: response.link,
              },
              { root: true }
            )
        }
      }

      return response
    } catch (err) {
      console.log({ err, file: 'resellers.js' })
    }
  },
}

export const mutations = {
  updateProducts: (state, data) => {
    Object.assign(state, data)
  },
}
