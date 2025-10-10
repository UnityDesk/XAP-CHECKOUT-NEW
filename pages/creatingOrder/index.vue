<template>
  <div>
    <div id="creatingOrder">
      <div class="secure">
        <img src="@/assets/img/secure.svg" alt="secure" /> Secure Connection
      </div>
      <div class="creating" v-if="!fraud">
        <img src="@/assets/img/icon/loadingBlack.svg" alt="loading" />
        Creating your order...
      </div>
      <div id="fraudError" v-else>
        <p class="error">
          {{ $t('waiting.orderFraud') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    fraud: {
      cache: false,
      get() {
        return this.$route.query.fraud == 'true'
      },
    },
  },
}
</script>

<style></style>
