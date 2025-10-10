export const state = () => ({
  currency: '',
})

export const actions = {
  getCurrency(context, currency) {
    context.commit('getCurrency', currency)
  },
}

export const mutations = {
  getCurrency(state, currency) {
    state.currency = currency
  },
}
