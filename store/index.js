import base64 from 'base-64'
import { serialize } from 'php-serialize'

export const state = () => ({
  ipCountry: '',
  codeCountry: '',
  pid: '',
  defaultPid: '',
  defaultReselPid: '',
  newReselPid: '',
  supportedGateway: [],
  currency: {},
  fraudCheck: '',
  env: {},
})

export const actions = {
  async nuxtServerInit(context, { req, query, store, redirect }) {
    const { promocode, email, pid, auto_redirect, extraconnect, proxyprotect } =
      query

    const ip =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.headers['x-real-ip'] ||
      req.connection?.remoteAddress?.replace(/^::ffff:/, '') ||
      '0.0.0.0'

    // Get country from Cloudflare or fallback to IP-API
    let country = req.headers['cf-ipcountry']
    if (!country && ip !== '0.0.0.0') {
      try {
        const response = await this.$axios.$get(
          `https://pro.ip-api.com/json/${ip}?fields=countryCode&key=${process.env.ipapikey}`
        )
        if (response.countryCode) {
          country = response.countryCode
        } else {
          country = 'XX'
        }
      } catch (error) {
        console.error('Country lookup failed:', error)
        country = 'XX'
      }
    } else if (!country) {
      country = 'XX'
    }

    const extraConnection = extraconnect == 'true',
      proxyProtection = proxyprotect == 'true'

    context.commit('update', {
      codeCountry: country,
      ipCountry: ip,
      defaultPid: process.env.defaultPid,
      defaultReselPid: process.env.defaultReselPid,
      newReselPid: process.env.newResellerPid,
      fraudCheck: process.env.fraudCheck,
      supportedGateway: process.env.gateway.split('-'),
      pid,
    })
    context.commit('gateway/updateGateway', {
      defaultGateway: {
        module: process.env.gateway.split('-')[0],
      },
    })
    context.commit('products/updateProducts', {
      extraConnection,
    })
    context.commit('products/updateProducts', {
      proxyProtection,
    })

    // Auto Promo Code
    if (promocode) {
      await store.dispatch('products/checkDiscount', promocode)
    }

    // Auto redirect
    if (email && Number(pid) && auto_redirect === 'true') {
      const currency = country === 'GB' ? 'GBP' : 'EUR'
      const [{ userid }, product] = await Promise.all([
        store.dispatch('user/auth', {
          email,
          country,
        }),
        store.dispatch('products/getProduct', query.pid),
      ])
      if (!userid || !product.totalresults) return
      const pricing = product.products.product[0].pricing[currency]
      let price = Number(
          pricing[Object.keys(pricing).filter((e) => Number(pricing[e]) > 0)[0]]
        ),
        billingCycle = Object.keys(pricing).filter(
          (e) => Number(pricing[e]) > 0
        )[0]
      if (!price) return
      // Add Extra Connection Price
      if (extraConnection) {
        const extraConfig =
          product.products.product[0].configoptions.configoption.filter(
            (e) => e.id === 2
          )
        if (!extraConfig.length) return
        const extraConfigPrice =
          extraConfig[0].options.option[0].pricing[currency][billingCycle]
        if (!Number(extraConfigPrice)) return
        price += Number(extraConfigPrice)
      }
      // Add Proxy Protection Price
      if (proxyProtection) {
        const proxyConfig =
          product.products.product[0].configoptions.configoption.filter(
            (e) => e.id === 4
          )
        if (!proxyConfig.length) return
        const proxyConfigPrice =
          proxyConfig[0].options.option[0].pricing[currency][billingCycle]
        if (!Number(proxyConfigPrice)) return
        price += Number(proxyConfigPrice)
      }
      // Reduce Promo Code
      if (promocode) {
        const { valid } = await store.dispatch(
          'products/checkDiscount',
          promocode
        )
        if (valid) {
          const codeInfo = store.state.products.discount
          if (
            codeInfo.appliesto.split(',').includes(pid) &&
            (codeInfo.expirationdate === '0000-00-00' ||
              new Date(codeInfo.expirationdate) > new Date()) &&
            (codeInfo.startdate === '0000-00-00' ||
              new Date(codeInfo.startdate) < new Date())
          ) {
            const { type, value } = codeInfo
            if (type === 'Percentage')
              price = (price * (100 - Number(value))) / 100
            else price -= Number(value)
          }
        }
      }
      const data = {
        pid,
        module: 'offshore',
        extraConnection,
        proxyProtection,
        userid,
        ip,
        code: promocode,
        price,
        currency,
      }
      const { link } = await store.dispatch('order', data)
      if (link) redirect(link)
      return
    }
  },

  async order(context, data) {
    try {
      context.dispatch('order/clearServiceId')
      context.dispatch('productDetails/removeClientProduct')
      const ids = await this.$axios.$get(
        '/checkout/api/getProductCustomFields',
        {
          params: {
            id:
              context.rootState.pid ||
              context.rootState.products.selectedPid ||
              context.rootState.defaultPid ||
              data?.pid,
          },
        }
      )
      const paymentmethod =
        context.rootState.gateway.selectedGateway.module ||
        context.rootState.gateway.defaultGateway.module ||
        data?.module
      const extraConnection = {},
        proxyProtection = {}
      
      // Handle connection count (extra connections beyond 1)
      const connectionCount = context.rootState.products.connectionCount || 1
      extraConnection[context.rootState.products.extraId] = connectionCount > 1 ? connectionCount : 0
      
      proxyProtection[context.rootState.products.proxyId] =
        context.rootState.products.proxyProtection ||
        Boolean(data && data?.proxyProtection)
      
      const configoptions = base64.encode(
        serialize({
          ...extraConnection,
          ...proxyProtection,
        })
      )
      const domain =
        'TV-' + Math.floor(10 * 1000 * 1000 + Math.random() * 90 * 1000 * 1000)
      const rootpw = `${Math.floor(
        100 * 1000 * 1000 * 1000 + Math.random() * 900 * 1000 * 1000 * 1000
      )}`
      const username = {},
        password = {}
      username[ids['Username']] = domain
      password[ids['Password']] = rootpw
      const customfields = base64.encode(
        serialize({
          ...username,
          ...password,
        })
      )
      const price =
        context.rootState.products.totalPrice ||
        context.rootState.products.price ||
        data?.price
      const email = context.rootState.user.email
      const response = await this.$axios.$get('/checkout/api/order', {
        params: {
          userid: context.rootState?.auth?.user?.userid || data?.userid,
          ip: context.rootState.ipCountry || data?.ip || '105.156.175.151',
          country: context.rootState.codeCountry,
          pid:
            context.rootState.pid ||
            context.rootState.products.selectedPid ||
            context.rootState.defaultPid ||
            data?.pid,
          paymentmethod,
          promocode:
            context.rootState.products.discount.code || data?.code
              ? context.rootState.products.discount.code || data?.code
              : '',
          affid: this.$cookiz.get('aff_id'),
          amount: Number(Number(price).toFixed(2)),
          currency: context.rootState.currency.currency || data?.currency,
          configoptions,
          customfields,
          email,
        },
      })
      // Commit changes
      context.commit('order/editOrder', {
        orderid: response.orderid,
        invoiceid: response.invoiceid,
        serviceid: response.serviceids,
        fraud: response.fraud,
      })
      if (response.link) {
        context.dispatch('waiting/addLastDate')
        switch (paymentmethod) {
          case 'offshore':
            context.commit('payment/updateUrl', {
              offshore_url: response.link,
            })
            break
          case 'coinbase':
            context.commit('payment/updateUrl', {
              coinbase_url: response.link,
            })
            break
          case 'cryptomusgateway':
            context.commit('payment/updateUrl', {
              cryptomus_url: response.link,
            })
            break
          case 'teveio_stripe':
            context.commit('payment/updateUrl', {
              teveio_stripe_url: response.link,
            })
            break
        }
      }

      return response
    } catch (err) {
      console.log(err)
    }
  },

  getCurrency(context, currency) {
    context.commit('getCurrency', currency)
  },
}

export const mutations = {
  update: (state, data) => {
    Object.assign(state, data)
  },

  setEnv(state, env) {
    state.env = env
  },

  updateCountry: (state, codeCountry) => {
    state.codeCountry = codeCountry
  },

  updateIpCountry: (state, ipCountry) => {
    state.ipCountry = ipCountry
  },

  updatePid: (state, pid) => {
    state.pid = pid
  },

  updateDefaultPid: (state, pid) => {
    state.defaultPid = pid
  },

  updateDefaultReselPid: (state, pid) => {
    state.defaultReselPid = pid
  },

  updateNewReselPid: (state, pid) => {
    state.newReselPid = pid
  },

  updateSupportedGateway: (state, gateway) => {
    state.supportedGateway = gateway
  },

  getCurrency: (state, currency) => {
    state.currency = currency
  },

  updateFraudCheck: (state, fraudCheck) => {
    state.fraudCheck = fraudCheck
  },
}
