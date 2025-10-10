<template>
  <div id="timeScroll">
    <div class="progress" :style="'width: ' + (10 + width) + '%'"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['waiting']),
    width() {
      return this.waiting.duration
        ? (1 - this.waiting.duration / (24 * 60 * 60 * 1000)) * 90
        : 0
    },
  },
}
</script>
