<template>
  <div id="login">
    <InputData
      :label="$t('checkout.emailAddress.label')"
      :type="'email'"
      :required="true"
      :placeholder="$t('checkout.emailAddress.placeholder')"
      :readOnly="$auth.loggedIn"
      :value="user.email"
      :error="error.email"
    ></InputData>
    <InputData
      :label="$t('checkout.password.label')"
      :type="'password'"
      :required="true"
      :placeholder="$t('checkout.password.placeholder')"
      :value="user.password"
      v-if="!$auth.loggedIn"
      :error="error.password"
    ></InputData>
    <button
      @click="validate"
      class="connect"
      :disabled="loading"
      :class="{ loading: loading }"
    >
      {{ loading ? '' : 'CONNECT' }}
    </button>
  </div>
</template>

<script>
import MailChecker from 'mailchecker'
import { mapState, mapActions } from 'vuex'
import InputData from '@/components/addons/input'
export default {
  computed: {
    ...mapState(['user']),
  },
  components: {
    InputData,
  },
  data() {
    return {
      loading: false,
      error: {
        email: false,
        password: false,
      },
    }
  },
  methods: {
    ...mapActions({
      auth: 'user/auth',
      getClientProduct: 'productDetails/getClientProduct',
    }),
    async validate() {
      if (this.user.valid) {
        this.loading = true
        const data = await this.auth()
        return this.$auth.setUser(data)
      } else {
        this.error.email = MailChecker.isValid(this.user.email) === false
        this.error.password = this.user.password.length < 8
      }
    },
  },
  watch: {
    '$store.state.user.email': function (newValue, oldValue) {
      this.error.email = false
    },
    '$store.state.user.password': function (newValue, oldValue) {
      this.error.password = false
    },
  },
}
</script>
