<template>
  <div class="waitcontainer">
    <div v-if="!order.fraud" id="wait">
      <div class="loader">
        <img src="@/assets/img/spinnerBlack.svg" alt="Spinner" />
      </div>

      <p v-if="hours && minutes && seconds" class="time">
        {{ hours }}:{{ minutes }}:{{ seconds }}
      </p>

      <p class="waiting">{{ $t('waiting.awaiting') }}</p>
    </div>

    <div id="fraudError" v-else>
      <p class="error">
        {{ $t('waiting.orderFraud') }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      hours: '',
      minutes: '',
      seconds: '',
    }
  },
  computed: {
    ...mapState(['waiting', 'order', 'auth', 'user', 'productDetails']),
  },
  mounted() {
    let i = 100
    const intervalClock = setInterval(() => {
      this.duration()
    }, 1000)

    const check = async () => {
      if (
        this.order.serviceid &&
        this.$auth.loggedIn &&
        !this.order.fraud &&
        this.$route.path.includes('waiting')
      ) {
        try {
          const response = await this.getClientProduct()
          if (response && response.status === 'Active') {
            clearInterval(interval)

            window.location.href = `/dashboard/subscriptions/${this.order.serviceid}?userid=${this.auth.user.userid}&email=${this.user.email}`
          }
        } catch (error) {
          console.error('Error checking product status:', error)
        }
      } else clearInterval(interval)
    }
    check()
    const interval = setInterval(async () => {
      check()
    }, 5 * 1000)
  },
  methods: {
    ...mapActions({
      updateDuration: 'waiting/updateDuration',
      getClientProduct: 'productDetails/getClientProduct',
      clearOrder: 'order/clearData',
      removeLastDate: 'waiting/removeLastDate',
    }),
    duration() {
      if (this.waiting.lastDate) {
        const date = new Date()
        const diff = new Date(this.waiting.lastDate).getTime() - date.getTime()
        if (diff > 0) {
          this.updateDuration(diff)
          const reformule = (n) => {
            return n > 9 ? n : '0' + n
          }
          this.hours = reformule(Math.floor(diff / (60 * 60 * 1000)))
          this.minutes = reformule(
            Math.floor((diff - this.hours * 60 * 60 * 1000) / (60 * 1000))
          )
          this.seconds = reformule(
            Math.floor(
              (diff - this.hours * 60 * 60 * 1000 - this.minutes * 60 * 1000) /
                1000
            )
          )
        } else {
          this.clearOrder()
          this.removeLastDate()
          this.$router.push(this.localePath('/'))
        }
      }
    },
  },
}
</script>
