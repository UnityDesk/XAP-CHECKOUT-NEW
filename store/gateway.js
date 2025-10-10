export const state = () => ({
  gateway: [],
  defaultGateway: {},
  selectedGateway: {},
})

export const actions = {
  async getGateway(context) {
    try {
      const response = await this.$axios.$get('/checkout/api/getGateway')

      if (response.paymentmethods) {
        const gateway = response.paymentmethods.paymentmethod
        context.commit('updateGateway', {
          gateway,
        })
      }
      return response
    } catch (err) {
      console.log({ err, file: 'gateway.js' })
    }
  },

  selectGateway(context, selectedGateway) {
    try {
      context.commit('updateGateway', { selectedGateway })
    } catch (err) {
      console.log(err)
    }
  },
}
export const mutations = {
  updateGateway: (state, data) => {
    Object.assign(state, data)
  },
}
