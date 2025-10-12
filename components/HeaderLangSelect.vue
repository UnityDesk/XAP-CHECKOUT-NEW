<template>
  <div class="lang-select">
    <select :value="current" @change="onChange($event.target.value)" class="lang-selector">
      <option v-for="l in localeOptions" :key="l.code" :value="l.code">
        {{ l.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'HeaderLangSelect',
  computed: {
    current() {
      return this.$i18n.locale;
    },
    localeOptions() {
      return (this.$i18n.locales || []).map(l =>
        typeof l === 'string' ? { code: l, name: l } : l
      );
    }
  },
  methods: {
    async onChange(code) {
      if (!code || code === this.$i18n.locale) return;
      
      try {
        await this.$i18n.setLocale(code);
        const to = this.localePath({ 
          name: this.$route.name, 
          params: this.$route.params, 
          query: this.$route.query 
        }, code);
        
        if (to && to !== this.$route.fullPath) {
          this.$router.push(to);
        }
      } catch (error) {
        console.error('Language change failed:', error);
      }
    }
  }
}
</script>

<style scoped>
.lang-select {
  display: inline-flex;
  align-items: center;
  margin-right: 1rem;
}

.lang-selector {
  height: 32px;
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.lang-selector:hover {
  border-color: #cbd5e0;
}

.lang-selector:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}
</style>
