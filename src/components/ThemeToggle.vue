<template>
  <button
    @click="toggleTheme"
    class="theme-toggle"
    :class="isDark ? 'theme-dark' : 'theme-light'"
    :title="isDark ? $t('common.lightMode') : $t('common.darkMode')"
    >
      <font-awesome-icon
      :icon="isDark ? 'sun' : 'moon'"
      class="theme-icon"
    />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  
  // Toggle both HTML and body classes
  document.documentElement.classList.toggle('dark')
  document.body.classList.toggle('dark-theme')
  
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
    document.body.classList.add('dark-theme')
  }
})
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-dark {
  background-color: #1e293b;
  color: #fde047;
}

.theme-light {
  background-color: var(--bg-color, #ffffff);
  color: #6366f1;
  border-color: var(--border-color, #e5e7eb);
}

.theme-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.theme-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-toggle:hover .theme-icon {
  transform: rotate(30deg);
  }

@media (max-width: 768px) {
  .theme-toggle {
    width: 36px;
    height: 36px;
}

  .theme-icon {
    font-size: 16px;
  }
}
</style> 