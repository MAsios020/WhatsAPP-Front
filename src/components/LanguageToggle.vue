<template>
  <div class="relative language-dropdown">
    <button
      @click.stop="toggleLanguage"
      class="language-toggle"
      :class="isRTL ? 'lang-active' : 'lang-inactive'"
    >
      <font-awesome-icon
        icon="globe"
        class="toggle-icon"
      />
      <span class="lang-text">{{ currentLanguage }}</span>
      <font-awesome-icon
        icon="chevron-down"
        class="arrow-icon"
        :class="{ 'rotate-180': showDropdown }"
      />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="showDropdown"
      class="lang-dropdown"
    >
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        class="lang-option"
        :class="{ 'selected': currentLanguage === lang.name }"
      >
        <font-awesome-icon
          icon="globe"
          class="lang-icon"
        />
        <span>{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const showDropdown = ref(false)

const languages = [
  { code: 'en', name: 'English', icon: 'globe' },
  { code: 'ar', name: 'العربية', icon: 'globe' }
]

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === locale.value)?.name || 'English'
})

const isRTL = computed(() => locale.value === 'ar')

const toggleLanguage = () => {
  showDropdown.value = !showDropdown.value
}

const changeLanguage = (langCode: string) => {
  locale.value = langCode
  document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr'
  localStorage.setItem('language', langCode)
  showDropdown.value = false
}

// Close dropdown when clicking outside
const closeDropdown = (event: MouseEvent) => {
  if (showDropdown.value) {
    showDropdown.value = false
  }
}

onMounted(() => {
  // Initialize language from localStorage or browser preference
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    locale.value = savedLanguage
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr'
  }
  
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.language-dropdown {
  position: relative;
  z-index: 50;
}

.language-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.lang-active {
  background-color: var(--color-primary, #25D366);
  color: #ffffff;
}

.lang-inactive {
  background-color: var(--bg-color, #ffffff);
  color: var(--text-color, #333333);
  border-color: var(--border-color, #e5e7eb);
}

.toggle-icon {
  font-size: 16px;
}

.lang-text {
  display: none;
}

@media (min-width: 640px) {
  .lang-text {
    display: inline-block;
  }
}

.arrow-icon {
  font-size: 10px;
  transition: transform 0.2s ease;
}

.language-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.language-toggle:active {
  transform: translateY(0);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 160px;
  background-color: var(--bg-color, #ffffff);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 100;
  border: 1px solid var(--border-color, #e5e7eb);
  animation: dropdown 0.2s ease;
}

/* Dark theme improvements */
body.dark-theme .lang-dropdown {
  background-color: var(--dropdown-bg, #2A3441);
  border-color: var(--dropdown-border, #4A5568);
  box-shadow: 0 4px 12px var(--dropdown-shadow, rgba(0, 0, 0, 0.25));
}

html[dir="rtl"] .lang-dropdown {
  right: auto;
  left: 0;
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: var(--text-color);
}

body.dark-theme .lang-option {
  color: var(--dropdown-text, #E2E8F0);
}

html[dir="rtl"] .lang-option {
  text-align: right;
  flex-direction: row-reverse;
}

.lang-option:hover {
  background-color: var(--hover-bg, #f3f4f6);
}

body.dark-theme .lang-option:hover {
  background-color: var(--dropdown-hover, #3A4556);
}

.lang-option.selected {
  background-color: var(--color-primary, #25D366);
  color: #ffffff;
}

/* Non-selected language option in dark mode should be more visible */
body.dark-theme .lang-option:not(.selected) {
  color: var(--dropdown-text, #E2E8F0);
}

.lang-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .language-dropdown {
    position: static;
  }
  
  .lang-dropdown {
    position: fixed;
    top: 60px;
    right: 10px;
    left: auto;
    width: 160px;
  }
  
  html[dir="rtl"] .lang-dropdown {
    right: auto;
    left: 10px;
  }
}
</style> 