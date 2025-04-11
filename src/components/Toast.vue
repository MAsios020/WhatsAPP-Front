<template>
  <div class="toast-container" :class="{ 'rtl': isRTL }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isRTL = computed(() => locale.value === 'ar')

// Watch for language changes and update toast container
watch(locale, (newLocale) => {
  const container = document.querySelector('.toast-container')
  if (container) {
    container.classList.toggle('rtl', newLocale === 'ar')
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.toast-container.rtl {
  direction: rtl;
}

:deep(.Vue-Toastification__toast) {
  @apply font-sans text-base md:text-lg font-semibold;
  min-height: 50px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

:deep(.Vue-Toastification__toast--success) {
  @apply bg-[#25D366] text-white;
}

:deep(.Vue-Toastification__toast--error) {
  @apply bg-red-500 text-white;
}

:deep(.Vue-Toastification__toast--warning) {
  @apply bg-yellow-500 text-white;
}

:deep(.Vue-Toastification__toast--info) {
  @apply bg-blue-500 text-white;
}

:deep(.Vue-Toastification__toast-body) {
  @apply text-base md:text-lg font-semibold;
  margin: 0;
  flex: 1;
  transition: all 0.3s ease;
}

:deep(.Vue-Toastification__icon) {
  margin-right: 0.75rem;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

:deep(.Vue-Toastification__close-button) {
  @apply text-white opacity-75 hover:opacity-100;
  font-size: 1.25rem;
  margin-left: 0.75rem;
  transition: all 0.3s ease;
}

:deep(.Vue-Toastification__progress-bar) {
  @apply bg-white/40;
  height: 3px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
}

/* RTL Support */
:deep(.rtl .Vue-Toastification__icon) {
  margin-right: 0;
  margin-left: 0.75rem;
}

:deep(.rtl .Vue-Toastification__close-button) {
  margin-left: 0;
  margin-right: 0.75rem;
}

:deep(.rtl .Vue-Toastification__progress-bar) {
  left: auto;
  right: 0;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  :deep(.Vue-Toastification__container) {
    padding: 0.5rem;
  }

  :deep(.Vue-Toastification__toast) {
    min-height: 45px;
    padding: 10px 12px;
    margin-bottom: 0.5rem;
  }

  :deep(.Vue-Toastification__toast-body) {
    font-size: 0.875rem;
  }

  :deep(.Vue-Toastification__icon) {
    font-size: 1rem;
    margin-right: 0.5rem;
  }

  :deep(.Vue-Toastification__close-button) {
    font-size: 1rem;
    margin-left: 0.5rem;
  }
}

/* Dark mode support */
:deep(.dark .Vue-Toastification__toast) {
  @apply bg-[#1e293b] text-white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:deep(.dark .Vue-Toastification__toast--success) {
  @apply bg-[#25D366];
}

:deep(.dark .Vue-Toastification__toast--error) {
  @apply bg-red-500;
}

:deep(.dark .Vue-Toastification__toast--warning) {
  @apply bg-yellow-500;
}

:deep(.dark .Vue-Toastification__toast--info) {
  @apply bg-blue-500;
}
</style> 