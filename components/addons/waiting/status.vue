<template>
  <div>
    <div
      v-if="productDetails.status"
      :class="productDetails.status"
      id="status"
    >
      <img
        v-if="productDetails.status === 'Pending'"
        src="@/assets/img/waiting.svg"
        alt="Waiting"
      />

      <p class="status">{{ productDetails.status }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['productDetails']),
  },
}
</script>
