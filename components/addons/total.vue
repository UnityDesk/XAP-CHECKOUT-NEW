<template>
  <div id="total">
    <p class="title">{{ $t('checkout.total') }}</p>
    <p class="total">
      {{ convertedTotalPrice }}
      <span class="currency-symbol">{{ selectedCurrencySymbol }}</span>
    </p>
    <div class="currency-info" v-if="showConversionInfo">
      <span class="conversion-info">
        ≈ {{ originalTotalPrice }} {{ originalCurrencySymbol }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      convertedPrice: null,
      originalPrice: null,
      isConverting: false,
    }
  },
  
  computed: {
    ...mapState(['products', 'pid', 'defaultPid', 'product']),
    ...mapState('currency', ['selectedCurrency', 'exchangeRates']),
    ...mapGetters('currency', ['selectedCurrencySymbol']),
    extraConnect() {
      const pid = this.pid || this.products.selectedPid || this.defaultPid
      let price = 0
      
      console.log('extraConnect calculation for pid:', pid)
      
      if (this.products.products[pid]) {
        const configOptions = this.products.products[pid].configoptions.configoption
        
        console.log('Available config options:', {
          pid,
          configOptionsCount: configOptions.length,
          configOptions: configOptions.map((opt, index) => ({
            index,
            id: opt.id,
            name: opt.name,
            type: opt.type
          }))
        })
        
        // Find the extra connection config option
        // Look for config option with type 'extra_connection' or similar
        let extraConnectionOption = null
        
        for (let i = 0; i < configOptions.length; i++) {
          const option = configOptions[i]
          console.log(`Checking config option ${i}:`, {
            id: option.id,
            name: option.name,
            type: option.type,
            options: option.options?.option?.length || 0
          })
          
          // Check if this is the extra connection option
          // This might be identified by name, type, or position
          if (option.name && (
            option.name.toLowerCase().includes('extra') ||
            option.name.toLowerCase().includes('connection') ||
            option.name.toLowerCase().includes('device')
          )) {
            extraConnectionOption = option
            console.log('Found extra connection option by name:', option.name)
            break
          }
        }
        
        // Fallback to first option if no specific extra connection option found
        if (!extraConnectionOption && configOptions.length > 0) {
          extraConnectionOption = configOptions[0]
          console.log('Using first config option as fallback')
        }
        
        if (extraConnectionOption && extraConnectionOption.options?.option?.length) {
          const pricing = extraConnectionOption.options.option[0].pricing[this.$t('currency.currency')]
          
          console.log('Raw pricing data:', {
            pid,
            billingcycle: this.products.billingcycle,
            currency: this.$t('currency.currency'),
            pricing,
            pricingKeys: Object.keys(pricing),
            configoption: extraConnectionOption
          })
          
          price = Object.keys(pricing).length
            ? pricing[this.products.billingcycle]
            : pricing
          
          console.log('Price before division:', price)
          
          // Apply billing cycle division like proxy protection
          let div = 1
          switch (this.products.billingcycle) {
            case 'monthly':
              div = 1
              break
            case 'quarterly':
              div = 3
              break
            case 'semiannually':
              div = 6
              break
            case 'annually':
              div = 12
              break
            case 'biennially':
              div = 24
              break
            case 'triennially':
              div = 36
              break
          }
          price = Number(price) / div
          console.log('Price after division:', price, 'divisor:', div)
        } else {
          console.log('No extra connection option found or no pricing data available')
        }
      }
      
      console.log('Final Extra Connect Price:', { pid, price, billingcycle: this.products.billingcycle })
      return Number(price) || 0
    },
    proxyProtect() {
      const pid = this.pid || this.products.selectedPid || this.defaultPid
      let price = 0
      if (this.products.products[pid]) {
        if (this.products.products[pid].configoptions.configoption.length > 1) {
          const pricing = this.products.products[pid].configoptions.configoption[1].options
            .option[0].pricing[this.$t('currency.currency')]
          price = Object.keys(pricing).length
            ? pricing[this.products.billingcycle]
            : pricing
        }
      }
      return Number(price) || 0
    },
    productPrice() {
      const pid = this.pid || this.products.selectedPid || this.defaultPid
      let price
      if (this.products.products[pid]) {
        price =
          this.products.products[pid].pricing[this.$t('currency.currency')]
        for (let j in price) {
          if (price[j] > 0) {
            price = price[j]
          }
        }
      }
      return price
    },
    discount() {
      return Object.keys(this.products.discount).length
        ? {
            value: this.products.discount.value,
            type: this.products.discount.type,
          }
        : false
    },
            totalPrice() {
              // Calculate connection cost using connectionCount
              const extraConnectPrice = Number(this.extraConnect) || 0
              const connectionCount = this.products.connectionCount || 1
              
              console.log('totalPrice calculation started:', {
                extraConnectPrice,
                extraConnectPriceType: typeof extraConnectPrice,
                connectionCount,
                billingcycle: this.products.billingcycle,
                extraConnection: this.products.extraConnection,
                extraConnection2: this.products.extraConnection2,
                extraConnection3: this.products.extraConnection3,
                extraConnection4: this.products.extraConnection4
              })
              
              // Calculate connection cost: (connectionCount - 1) * extraConnectPrice
              // For 1 connection: 0 extra cost
              // For 2 connections: 1 * extraConnectPrice
              // For 3 connections: 2 * extraConnectPrice
              // For 4 connections: 3 * extraConnectPrice
              // For 5 connections: 4 * extraConnectPrice
              const additionalConnections = Math.max(0, connectionCount - 1)
              const connectionCost = additionalConnections * extraConnectPrice

              console.log('Connection cost calculation:', {
                connectionCount,
                additionalConnections,
                extraConnectPrice,
                connectionCost
              })

              let total = Number(
                Number(connectionCost) +
                  Number(this.products.proxyProtection ? this.proxyProtect : 0) +
                  Number(this.productPrice)
              ).toFixed(2)
              
              if (this.discount)
                if (this.discount.type === 'Percentage')
                  total = (total * ((100 - Number(this.discount.value)) / 100)).toFixed(
                    2
                  )
                else total = (total - Number(this.discount.value)).toFixed(2)
              
              console.log('Final Total:', total)
              return total
            },
    
    // Currency conversion computed properties
    originalCurrencySymbol() {
      return this.$t('currency.symbole')
    },
    
    originalTotalPrice() {
      return this.totalPrice
    },
    
    convertedTotalPrice() {
      if (this.convertedPrice !== null) {
        return this.convertedPrice
      }
      return this.totalPrice
    },
    
    showConversionInfo() {
      return this.convertedPrice !== null && 
             this.selectedCurrency !== this.$t('currency.currency') &&
             this.convertedPrice !== this.totalPrice
    },
  },
  methods: {
    ...mapActions({
      updatePrice: 'products/updatePrice',
      convertCurrency: 'currency/convertCurrency',
    }),
    
    async convertPrice() {
      if (this.isConverting || !this.totalPrice) return
      
      const originalCurrency = this.$t('currency.currency')
      if (originalCurrency === this.selectedCurrency) {
        this.convertedPrice = null
        return
      }
      
      try {
        this.isConverting = true
        const result = await this.convertCurrency({
          amount: this.totalPrice,
          from: originalCurrency,
          to: this.selectedCurrency
        })
        
        if (result && !result.error) {
          this.convertedPrice = result.convertedAmount.toFixed(2)
          this.originalPrice = this.totalPrice
        }
      } catch (error) {
        console.error('Currency conversion error:', error)
        this.convertedPrice = null
      } finally {
        this.isConverting = false
      }
    },
  },
  watch: {
    'products.connectionCount': {
      handler() {
        this.$nextTick(() => {
          this.updatePrice({ totalPrice: this.totalPrice })
          this.convertPrice()
        })
      },
      immediate: false
    },
    
    'products.proxyProtection': {
      handler() {
        this.$nextTick(() => {
          this.updatePrice({ totalPrice: this.totalPrice })
          this.convertPrice()
        })
      },
      immediate: false
    },
    
    'products.discount': {
      handler() {
        this.$nextTick(() => {
          this.updatePrice({ totalPrice: this.totalPrice })
          this.convertPrice()
        })
      },
      immediate: false,
      deep: true
    },
    
    selectedCurrency: {
      handler() {
        this.convertPrice()
      },
      immediate: true
    },
    
    totalPrice: {
      handler() {
        this.convertPrice()
      },
      immediate: true
    },
  },
  mounted() {
    if (this.totalPrice) {
      this.updatePrice({ totalPrice: this.totalPrice })
      this.convertPrice()
    }
  },
  updated() {
    this.updatePrice({ totalPrice: this.totalPrice })
    this.convertPrice()
  },
  destroyed() {
    if (
      this.products.connectionCount <= 1 &&
      !this.products.proxyProtection &&
      !Object.keys(this.products.discount).length
    )
      this.updatePrice({ totalPrice: '' })
  },
}
</script>
