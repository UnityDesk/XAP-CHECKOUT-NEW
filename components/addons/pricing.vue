<template>
  <div class="pricingInfo">
    <div class="data">
      <img :src="src" alt="Info" />
      <p>{{ title }}</p>
      <img
        @click="disableFunc"
        src="@/assets/img/X.svg"
        alt="abord"
        v-if="disable"
        class="abord"
      />
    </div>
    <div class="price" v-if="price">
      <p>{{ price }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['src', 'title', 'price', 'disable', 'disableFunc'],
  methods: {},
}
</script>
