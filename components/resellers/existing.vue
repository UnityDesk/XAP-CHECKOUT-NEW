<template>
  <div id="ccc_existing">
    <Label :number="2" :label="$t('resellers.existing')"></Label>

    <div class="ccc_yesno" :class="{ disabled: trueLog }">
      <button
        :class="{ active: resellers.existingReseller }"
        @click="toggle(true)"
      >
        Yes
      </button>
      <button
        :class="{ active: !resellers.existingReseller }"
        @click="toggle(false)"
      >
        No
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Label from '../addons/label'
export default {
  computed: {
    ...mapState(['resellers', 'auth', 'user']),
    trueLog() {
      return this.auth.loggedIn && this.user.email && this.auth.user.userid
    },
  },
  components: {
    Label,
  },
  methods: {
    ...mapActions({
      existing: 'resellers/existing',
    }),
    scroll() {
      setTimeout(() => {
        window.scrollTo({
          top:
            document.querySelector('#paymentMethod').getBoundingClientRect()
              .top +
            window.scrollY -
            50,
          behavior: 'smooth',
        })
      }, 10)
    },
    toggle(boolean) {
      if (!this.trueLog) {
        this.existing(boolean)
        this.scroll()
      }
    },
  },
}
</script>

<style></style>
