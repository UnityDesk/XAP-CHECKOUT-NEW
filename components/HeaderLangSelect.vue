<template>
  <div class="lang-select">
    <select :value="$i18n.locale" @change="onChange($event.target.value)">
      <option v-for="l in options" :key="l.code" :value="l.code">{{ l.name }}</option>
    </select>
  </div>
</template>

<script>
export default {
  computed: {
    options() {
      return (this.$i18n.locales || []).map(l =>
        typeof l === 'string' ? { code: l, name: l } : l
      );
    }
  },
  methods: {
    async onChange(code) {
      if (!code || code === this.$i18n.locale) return;
      await this.$i18n.setLocale(code);
      const to = this.localePath(
        { name: this.$route.name, params: this.$route.params, query: this.$route.query },
        code
      );
      this.$router.push(to);
    }
  }
}
</script>

<style scoped>
.lang-select { display: inline-flex; align-items: center; }
select { height: 32px; padding: 4px 8px; }
</style>
