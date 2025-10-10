<template>
  <div class="currency-selector">
    <div class="currency-dropdown" :class="{ active: isOpen }">
      <button 
        class="currency-toggle"
        @click="toggleDropdown"
        :disabled="isLoading"
      >
        <span class="currency-display">
          <span class="currency-symbol">{{ selectedCurrencySymbol }}</span>
          <span class="currency-code">{{ selectedCurrency }}</span>
        </span>
        <svg 
          class="dropdown-icon" 
          :class="{ rotated: isOpen }"
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <div class="currency-dropdown-menu" v-if="isOpen">
        <div class="currency-list">
          <button
            v-for="currency in availableCurrencies"
            :key="currency.code"
            class="currency-option"
            :class="{ active: currency.code === selectedCurrency }"
            @click="selectCurrency(currency.code)"
          >
            <span class="currency-symbol">{{ currency.suffix || currency.prefix }}</span>
            <span class="currency-code">{{ currency.code }}</span>
            <span class="currency-rate" v-if="currency.rate !== 1">
              ({{ currency.rate }})
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <div class="currency-info" v-if="exchangeRate && exchangeRate !== 1">
      <span class="exchange-rate-info">
        1 {{ baseCurrency }} = {{ exchangeRate }} {{ selectedCurrency }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'CurrencySelector',
  
  data() {
    return {
      isOpen: false,
      baseCurrency: 'EUR', // Default base currency
    }
  },
  
  computed: {
    ...mapState('currency', ['currencies', 'selectedCurrency', 'isLoading']),
    ...mapGetters('currency', ['availableCurrencies', 'selectedCurrencySymbol', 'exchangeRates']),
    
    exchangeRate() {
      if (this.selectedCurrency === this.baseCurrency) return 1
      return this.exchangeRates[this.selectedCurrency] || 1
    }
  },
  
  async mounted() {
    // Fetch currencies on component mount
    await this.fetchCurrencies()
    
    // Set initial currency from current locale
    const currentCurrency = this.$t('currency.currency')
    if (currentCurrency && this.availableCurrencies.some(c => c.code === currentCurrency)) {
      this.setCurrency(currentCurrency)
    }
  },
  
  methods: {
    ...mapActions('currency', ['fetchCurrencies', 'setCurrency']),
    
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    
    selectCurrency(currencyCode) {
      this.setCurrency(currencyCode)
      this.isOpen = false
      
      // Emit event for parent components
      this.$emit('currency-changed', {
        currency: currencyCode,
        symbol: this.availableCurrencies.find(c => c.code === currencyCode)?.suffix || 
                this.availableCurrencies.find(c => c.code === currencyCode)?.prefix || '',
        rate: this.exchangeRates[currencyCode] || 1
      })
    },
    
    closeDropdown() {
      this.isOpen = false
    }
  },
  
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.closeDropdown()
      }
    })
  },
  
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdown)
  }
}
</script>

<style scoped>
.currency-selector {
  position: relative;
  display: inline-block;
}

.currency-dropdown {
  position: relative;
}

.currency-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.currency-toggle:hover {
  border-color: #4ECDC4;
  background: rgba(78, 205, 196, 0.1);
}

.currency-toggle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.currency-display {
  display: flex;
  align-items: center;
  gap: 6px;
}

.currency-symbol {
  font-weight: 600;
  color: #4ECDC4;
}

.currency-code {
  font-weight: 500;
}

.dropdown-icon {
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.currency-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  overflow: hidden;
}

.currency-list {
  max-height: 200px;
  overflow-y: auto;
}

.currency-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
}

.currency-option:hover {
  background: rgba(78, 205, 196, 0.1);
  color: #ffffff;
}

.currency-option.active {
  background: rgba(78, 205, 196, 0.2);
  color: #4ECDC4;
}

.currency-option .currency-symbol {
  font-weight: 600;
  color: #4ECDC4;
  min-width: 20px;
}

.currency-option .currency-code {
  font-weight: 500;
  flex: 1;
}

.currency-option .currency-rate {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.currency-info {
  margin-top: 8px;
  text-align: center;
}

.exchange-rate-info {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

/* Mobile responsive */
@media screen and (max-width: 768px) {
  .currency-toggle {
    padding: 10px 12px;
    font-size: 13px;
    min-width: 100px;
  }
  
  .currency-option {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .currency-dropdown-menu {
    margin-top: 6px;
  }
}

/* Dark mode adjustments */
.dark-mode .currency-toggle {
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(78, 205, 196, 0.4);
}

.dark-mode .currency-dropdown-menu {
  background: rgba(15, 23, 42, 0.98);
  border-color: rgba(78, 205, 196, 0.4);
}
</style>
