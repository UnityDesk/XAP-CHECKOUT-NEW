<template>
  <div class="input">
    <p class="error" v-if="user.errorEmail && value && type === 'email'">
      {{ user.errorEmail }}
    </p>
    <p
      class="error padding"
      v-if="!resellers.samePswrd && value && confirmPassword"
    >
      {{ resellers.confirmError }}
    </p>
    <label>{{ label }}<span v-if="required"> *</span></label>
    <div
      class="inputData"
      :class="{
        focus: focus,
        error:
          (!user.valid && user.errorEmail && type === 'email' && value) ||
          error,
      }"
    >
      <input
        :ref="confirmPassword ? 'confirmPassword' : type"
        :type="type"
        :value="value"
        :readonly="readOnly"
        :placeholder="placeholder"
        @focus="focused"
        @blur="blured"
        @input="input"
      />
      <div
        class="signout"
        v-if="auth.loggedIn && user.email && type === 'email'"
      >
        <img
          src="@/assets/img/X.svg"
          alt="abord"
          class="abord"
          @click="clicked"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: [
    'label',
    'type',
    'value',
    'readOnly',
    'placeholder',
    'required',
    'error',
    'confirmPassword',
  ],
  data() {
    return {
      focus: false,
    }
  },
  computed: {
    ...mapState(['user', 'resellers', 'auth']),
  },
  methods: {
    ...mapActions({
      userEmail: 'user/userEmail',
      userPassword: 'user/userPassword',
      validate: 'user/validate',
      displayError: 'user/displayError',
      signOut: 'user/signOut',
      removeLastDate: 'waiting/removeLastDate',
      clearDiscount: 'products/clearDiscount',
      removeClientProduct: 'productDetails/removeClientProduct',
      clearPayment: 'payment/clearPayment',
      clearData: 'order/clearData',
    }),
    focused() {
      this.focus = true
    },
    blured() {
      this.focus = false
      this.input()
      if (this.type === 'email') this.displayError()
    },
    input() {
      if (this.confirmPassword && this.$refs.confirmPassword) {
        this.$emit('confirmPass', this.$refs.confirmPassword.value)
      } else {
        switch (this.type) {
          case 'email':
            this.validate(this.$refs[this.type].value)
            this.userEmail(this.$refs[this.type].value)
            break
          case 'password':
            this.userPassword(this.$refs[this.type].value)
            break
        }
      }
    },
    clicked() {
      this.$auth.setUser('')
      this.signOut()
      this.removeLastDate()
      this.removeClientProduct()
      this.clearPayment()
      this.clearData()
    },
  },
}
</script>
