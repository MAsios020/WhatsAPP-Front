<template>
  <div class="relative">
    <button
      @click="toggleLanguage"
      class="language-toggle flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300"
      :class="isRTL ? 'bg-whatsapp-green text-white' : 'bg-white text-whatsapp-dark'"
    >
      <font-awesome-icon
        :icon="isRTL ? 'language' : 'language'"
        class="text-lg"
      />
      <span class="font-medium">{{ currentLanguage }}</span>
      <font-awesome-icon
        icon="chevron-down"
        class="text-sm transition-transform duration-300"
        :class="{ 'rotate-180': showDropdown }"
      />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="showDropdown"
      class="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg overflow-hidden z-50"
      :class="{ 'text-right': isRTL }"
    >
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        class="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
        :class="{ 'bg-whatsapp-green text-white hover:bg-whatsapp-light': currentLanguage === lang.name }"
      >
        <font-awesome-icon
          :icon="lang.icon"
          class="text-lg"
        />
        <span>{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

// Initialize language from localStorage or browser preference
const savedLanguage = localStorage.getItem('language')
if (savedLanguage) {
  locale.value = savedLanguage
  document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr'
}
</script>

<style scoped>
.language-toggle {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.language-toggle:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.language-toggle:active {
  transform: translateY(0);
}
</style> 