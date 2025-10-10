export const state = () => ({
  lastDate: '',
  duration: '',
})

export const actions = {
  addLastDate(context) {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    const lastDate = new Date(date)
    context.commit('addLastDate', lastDate)
  },

  removeLastDate(context) {
    context.commit('removeLastDate')
  },

  updateDuration(context, duration) {
    context.commit('updateDuration', duration)
  },
}

export const mutations = {
  addLastDate: (state, date) => {
    state.lastDate = date
  },

  removeLastDate: (state) => {
    state.lastDate = ''
  },

  updateDuration: (state, duration) => {
    state.duration = duration
  },
}
