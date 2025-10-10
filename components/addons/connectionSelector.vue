<template>
  <div id="connectionSelector" :class="{ pid: pid }">
    <div class="content">
      <img src="@/assets/img/order/tv.svg" alt="connection selector" />
      <div class="info">
        <p class="title">{{ $t('checkout.connectionSelector.title') }}</p>
        <p class="description">
          {{ $t('checkout.connectionSelector.description') }}
        </p>
      </div>
    </div>
    
    <client-only>
      <div class="selector-container">
        <div class="connection-buttons">
          <button
            v-for="count in 5"
            :key="count"
            :class="{ active: selectedConnections === count }"
            @click="setConnections(count)"
            class="connection-btn"
          >
            {{ count }}
          </button>
        </div>
        <div class="connection-display">
          <span class="current-count">{{ selectedConnections }}</span>
          <span class="total-label">{{ $t('checkout.connectionSelector.connections') }}</span>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import smoothscroll from 'smoothscroll-polyfill'

export default {
  computed: {
    ...mapState(['products', 'defaultPid', 'pid']),
    computedPid() {
      return this.pid || this.products.selectedPid || this.defaultPid
    },

    extraConnect() {
      const pid = this.computedPid
      if (this.products.products[pid])
        if (Object.keys(this.products.products[pid].configoptions).length)
          return this.products.products[pid].configoptions.configoption[0]
      return false
    },
    
    connectionPrice() {
      if (this.extraConnect && this.selectedConnections > 1) {
        const basePrice = this.extraConnect.options.option[0].pricing[
          this.$t('currency.currency')
        ][this.products.billingcycle]
        let div
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
        const singleConnectionPrice = Number(basePrice / div).toFixed(2)
        return Number(singleConnectionPrice * (this.selectedConnections - 1)).toFixed(2)
      }
      return 0
    },
    
    totalPrice: {
      cache: false,
      get() {
        const pid = this.computedPid
        if (this.products.discount.type && this.products.discount.value) {
          if (this.products.discount.appliesto.includes(pid)) {
            if (this.products.discount.type === 'Percentage') {
              return (
                (this.connectionPrice *
                  (100 - Number(this.products.discount.value))) /
                100
              ).toFixed(2)
            }
          }
        }
      },
    },
  },
  
  data() {
    return {
      width: false,
      selectedConnections: 1,
    }
  },
  
  methods: {
    ...mapActions({
      updateConnectionCount: 'products/updateConnectionCount',
      editExtraConnect: 'products/editExtraConnect',
      updatePrice: 'products/updatePrice',
    }),
    
    setConnections(count) {
      console.log('setConnections called with count:', count)
      this.selectedConnections = count
      this.updateConnections()
    },
    
    updateConnections() {
      console.log('updateConnections called with selectedConnections:', this.selectedConnections)
      
      // Update connection count in store
      this.updateConnectionCount(this.selectedConnections)
      
      // Reset all extra connections first
      this.$store.commit('products/updateProducts', { 
        extraConnection: false,
        extraConnection2: false,
        extraConnection3: false,
        extraConnection4: false
      })
      
      console.log('After reset - all extra connections should be false')
      
      // Add extra connections based on selected count
      // For 2 connections: add 1 extra connection
      // For 3 connections: add 2 extra connections
      // For 4 connections: add 3 extra connections
      // For 5 connections: add 4 extra connections
      const additionalConnections = this.selectedConnections - 1
      
      console.log('Additional connections needed:', additionalConnections)
      
      if (additionalConnections >= 1) {
        this.$store.commit('products/updateProducts', { extraConnection: true })
        console.log('Set extraConnection: true')
      }
      if (additionalConnections >= 2) {
        this.$store.commit('products/updateProducts', { extraConnection2: true })
        console.log('Set extraConnection2: true')
      }
      if (additionalConnections >= 3) {
        this.$store.commit('products/updateProducts', { extraConnection3: true })
        console.log('Set extraConnection3: true')
      }
      if (additionalConnections >= 4) {
        this.$store.commit('products/updateProducts', { extraConnection4: true })
        console.log('Set extraConnection4: true')
      }
      
      console.log('Final state after updateConnections:', {
        selectedConnections: this.selectedConnections,
        additionalConnections,
        extraConnection: this.products.extraConnection,
        extraConnection2: this.products.extraConnection2,
        extraConnection3: this.products.extraConnection3,
        extraConnection4: this.products.extraConnection4
      })
      
      if (!this.pid)
        window.scrollTo({
          top:
            this.$parent.$parent.$children[2].$refs.paymentMethod.offsetTop -
            60,
          behavior: 'smooth',
        })
    },
  },
  
  watch: {
    'products.connectionCount': {
      handler(newCount) {
        this.selectedConnections = newCount || 1
      },
      immediate: true
    }
  },
  
  mounted() {
    smoothscroll.polyfill()
    this.width = window.innerWidth <= 700
    
    // Initialize with current connection count from store
    this.selectedConnections = this.products.connectionCount || 1
  },
}
</script>
