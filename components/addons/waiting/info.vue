<template>
  <div class="orderInfo">
    <p class="title">{{ title }}:</p>
    <p class="info">{{ info }}</p>
  </div>
</template>

<script>
export default {
  name: 'waitingInfo',
  props: ['title', 'info'],
}
</script>
