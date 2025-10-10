<template>
  <a :href="link" target="_blank">
    <div class="utilitie">
      <div class="info">
        <img :src="img" alt="Email" class="email" />
        <p class="title">{{ name }}</p>
      </div>
      <img
        src="@/assets/img/externalBlue.svg"
        alt="External"
        v-if="$colorMode.value === 'white'"
      />
      <img src="@/assets/img/externalWhite.svg" alt="External" v-else />
    </div>
  </a>
</template>

<script>
export default {
  props: ['img', 'name', 'link'],
}
</script>
