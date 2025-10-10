<template>
  <div class="label">
    <label for="firstStep" v-if="!pid">
      <p class="number">{{ number }}</p>

      <span>
        {{ label }}

        <span v-if="optional" class="optional">
          ({{ $t('checkout.optional') }})
        </span>
      </span>
    </label>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['pid']),
  },
  props: ['number', 'label', 'optional'],
}
</script>
