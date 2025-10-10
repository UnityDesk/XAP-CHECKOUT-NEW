function initialState() {
  return { email: '', password: '', valid: false, errorEmail: '' }
}
export const state = () => initialState()

export const actions = {
  userEmail(context, email) {
    context.commit('updateUser', {
      email,
    })
  },

  userPassword(context, password) {
    context.commit('updateUser', {
      password,
    })
  },

  validate(context, email) {
    if (context.state.email) {
      context.commit('updateUser', {
        valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      })
    }
  },

  displayError(context) {
    context.commit('displayError')
  },

  signOut(context) {
    context.commit('reset')
  },

  async auth(context, data) {
    try {
      const response = await this.$axios.$post('/checkout/api/auth', {
        email: context.state.email || data.email,
        password: context.state.password,
        country: context.rootState.codeCountry || data?.country || 'MA',
        clientip: context.rootState.ipCountry,
        language: context.rootState.codeCountry == 'ES' ? 'spanish' : '',
        currency: context.rootState.currency.currency,
      })
      return response
    } catch (err) {
      console.log(err)
    }
  },

  async authMiddleware(context, data) {
    try {
      const response = await this.$axios.$post('/checkout/api/authMiddleware', {
        email: context.state.email || data.email,
      })
      return response
    } catch (err) {
      console.log(err)
    }
  },

  autoAuth(context, data) {
    context.commit('updateUser', {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? data.email : '',
      valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email),
      errorEmail: '',
    })
  },
}

export const mutations = {
  updateUser(state, data) {
    Object.assign(state, data)
  },

  displayError: (state) => {
    if (!state.valid) state.errorEmail = 'Please enter a Valid Email.'
    else state.errorEmail = ''
  },

  reset: (state) => {
    const s = initialState()
    Object.keys(s).forEach((key) => {
      state[key] = s[key]
    })
  },
}
