<template>
  <div class="lang-select">
    <div class="lang-selector" @click="toggleDropdown" :class="{ 'open': isOpen }">
      <div class="current-lang">
        <span class="flag">{{ getFlag($i18n.locale) }}</span>
        <span class="lang-name">{{ getLanguageName($i18n.locale) }}</span>
        <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <div v-if="isOpen" class="dropdown" @click.stop>
        <div 
          v-for="option in options" 
          :key="option.code"
          class="dropdown-item"
          :class="{ 'active': option.code === $i18n.locale }"
          @click="onChange(option.code)"
        >
          <span class="flag">{{ getFlag(option.code) }}</span>
          <span class="lang-name">{{ option.name }}</span>
          <span v-if="option.code === $i18n.locale" class="check">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
    
    <!-- Backdrop for mobile -->
    <div v-if="isOpen" class="backdrop" @click="closeDropdown"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    options() {
      // Filter out duplicate English variants, keep only en-en
      const allLocales = (this.$i18n.locales || []).map(l =>
        typeof l === 'string' ? { code: l, name: l } : l
      );
      
      // Remove en-us and en-gb from the selector, keep only en-en
      return allLocales.filter(locale => 
        locale.code !== 'en-us' && locale.code !== 'en-gb'
      );
    }
  },
  methods: {
    async onChange(code) {
      if (!code || code === this.$i18n.locale) {
        this.closeDropdown();
        return;
      }
      
      try {
        // Set the locale without navigation to preserve animations
        await this.$i18n.setLocale(code);
        
        // Only navigate if we're not already on the correct locale path
        const currentPath = this.$route.path;
        const targetPath = this.localePath(
          { name: this.$route.name, params: this.$route.params, query: this.$route.query },
          code
        );
        
        // Check if we need to navigate (only if path actually changes)
        if (currentPath !== targetPath) {
          // Use replace instead of push to avoid adding to history
          await this.$router.replace(targetPath);
        }
        
        this.closeDropdown();
      } catch (error) {
        console.error('Language change failed:', error);
        this.closeDropdown();
      }
    },
    
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    
    closeDropdown() {
      this.isOpen = false;
    },
    
    getFlag(locale) {
      const flagMap = {
        'en-en': '🇺🇸',
        'en-us': '🇺🇸',  // Backend still supports this
        'en-gb': '🇬🇧',  // Backend still supports this
        'es-es': '🇪🇸',
        'de-de': '🇩🇪',
        'pt-pt': '🇵🇹',
        'nl-nl': '🇳🇱'
      };
      return flagMap[locale] || '🌍';
    },
    
    getLanguageName(locale) {
      const nameMap = {
        'en-en': 'English',
        'en-us': 'English',  // Backend still supports this
        'en-gb': 'English',  // Backend still supports this
        'es-es': 'Español',
        'de-de': 'Deutsch',
        'pt-pt': 'Português',
        'nl-nl': 'Nederlands'
      };
      return nameMap[locale] || locale;
    }
  },
  
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.closeDropdown();
      }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown();
      }
    });
  }
}
</script>

<style scoped>
.lang-select {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.lang-selector {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.current-lang {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-width: 120px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.current-lang:hover {
  border-color: #cbd5e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.lang-selector.open .current-lang {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.flag {
  font-size: 16px;
  line-height: 1;
}

.lang-name {
  flex: 1;
  text-align: left;
}

.chevron {
  color: #6b7280;
  transition: transform 0.2s ease;
}

.lang-selector.open .chevron {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
  overflow: hidden;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #374151;
}

.dropdown-item:hover {
  background-color: #f7fafc;
}

.dropdown-item.active {
  background-color: #ebf8ff;
  color: #2b6cb0;
  font-weight: 500;
}

.dropdown-item .flag {
  font-size: 16px;
  line-height: 1;
  width: 20px;
  text-align: center;
}

.dropdown-item .lang-name {
  flex: 1;
  text-align: left;
}

.dropdown-item .check {
  color: #4299e1;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .current-lang {
    padding: 10px 12px;
    min-width: 100px;
    font-size: 13px;
  }
  
  .flag {
    font-size: 14px;
  }
  
  .dropdown {
    left: -20px;
    right: -20px;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  .dropdown-item {
    padding: 14px 16px;
    font-size: 15px;
  }
  
  .dropdown-item .flag {
    font-size: 18px;
    width: 24px;
  }
}

@media (max-width: 480px) {
  .current-lang {
    min-width: 80px;
    padding: 8px 10px;
  }
  
  .lang-name {
    display: none;
  }
  
  .dropdown-item .lang-name {
    display: block;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .current-lang {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }
  
  .current-lang:hover {
    border-color: #4b5563;
    background: #111827;
  }
  
  .lang-selector.open .current-lang {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }
  
  .dropdown {
    background: #1f2937;
    border-color: #374151;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
  
  .dropdown-item {
    color: #f9fafb;
  }
  
  .dropdown-item:hover {
    background-color: #374151;
  }
  
  .dropdown-item.active {
    background-color: #1e3a8a;
    color: #93c5fd;
  }
  
  .chevron {
    color: #9ca3af;
  }
}
</style>
