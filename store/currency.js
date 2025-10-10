export const state = () => ({
  currencies: [],
  exchangeRates: {},
  selectedCurrency: 'EUR',
  isLoading: false,
  error: null,
})

export const mutations = {
  SET_CURRENCIES(state, currencies) {
    state.currencies = currencies
  },
  
  SET_EXCHANGE_RATES(state, rates) {
    state.exchangeRates = rates
  },
  
  SET_SELECTED_CURRENCY(state, currency) {
    state.selectedCurrency = currency
  },
  
  SET_LOADING(state, loading) {
    state.isLoading = loading
  },
  
  SET_ERROR(state, error) {
    state.error = error
  },
}

export const actions = {
  async fetchCurrencies({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await this.$axios.$get('/checkout/api/currencies')
      
      if (response.success) {
        commit('SET_CURRENCIES', response.currencies)
        
        // Build exchange rates object for quick lookup
        const rates = {}
        response.currencies.forEach(currency => {
          rates[currency.code] = currency.rate
        })
        commit('SET_EXCHANGE_RATES', rates)
      } else {
        throw new Error(response.message || 'Failed to fetch currencies')
      }
    } catch (error) {
      console.error('Currency fetch error:', error)
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async convertCurrency({ commit }, { amount, from, to }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await this.$axios.$get('/checkout/api/convert', {
        params: { amount, from, to }
      })
      
      if (response.success) {
        return response
      } else {
        throw new Error(response.message || 'Currency conversion failed')
      }
    } catch (error) {
      console.error('Currency conversion error:', error)
      commit('SET_ERROR', error.message)
      return { error: true, message: error.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  setCurrency({ commit }, currency) {
    commit('SET_SELECTED_CURRENCY', currency)
  },
}

export const getters = {
  availableCurrencies: (state) => state.currencies,
  
  selectedCurrency: (state) => state.selectedCurrency,
  
  exchangeRates: (state) => state.exchangeRates,
  
  isLoading: (state) => state.isLoading,
  
  error: (state) => state.error,
  
  // Get currency symbol for selected currency
  selectedCurrencySymbol: (state) => {
    const currency = state.currencies.find(c => c.code === state.selectedCurrency)
    return currency ? currency.suffix || currency.prefix : ''
  },
  
  // Get currency prefix for selected currency
  selectedCurrencyPrefix: (state) => {
    const currency = state.currencies.find(c => c.code === state.selectedCurrency)
    return currency ? currency.prefix : ''
  },
  
  // Get currency suffix for selected currency
  selectedCurrencySuffix: (state) => {
    const currency = state.currencies.find(c => c.code === state.selectedCurrency)
    return currency ? currency.suffix : ''
  },
}
