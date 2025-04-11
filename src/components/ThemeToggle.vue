<template>
  <button
    @click="toggleTheme"
    class="theme-toggle relative w-16 h-8 rounded-full p-1 transition-all duration-500 focus:outline-none overflow-hidden"
    :class="isDark ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-yellow-300 to-yellow-500'"
  >
    <!-- Sun/Moon Icons -->
    <div
      class="absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-500"
      :class="isDark ? 'opacity-0' : 'opacity-100'"
    >
      <font-awesome-icon
        icon="sun"
        class="text-yellow-500 text-lg animate-pulse"
      />
      <font-awesome-icon
        icon="sun"
        class="text-yellow-500 text-lg animate-pulse"
      />
    </div>
    
    <div
      class="absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-500"
      :class="isDark ? 'opacity-100' : 'opacity-0'"
    >
      <font-awesome-icon
        icon="moon"
        class="text-blue-300 text-lg"
      />
      <font-awesome-icon
        icon="star"
        class="text-blue-300 text-sm animate-pulse"
      />
    </div>

    <!-- Toggle Circle -->
    <div
      class="absolute left-0 top-0 w-8 h-8 rounded-full bg-white shadow-lg transform transition-transform duration-500 flex items-center justify-center"
      :class="isDark ? 'translate-x-9' : 'translate-x-0'"
    >
      <font-awesome-icon
        :icon="isDark ? 'moon' : 'sun'"
        class="text-sm transition-colors duration-500"
        :class="isDark ? 'text-gray-800' : 'text-yellow-500'"
      />
    </div>

    <!-- Stars Animation -->
    <div
      v-if="isDark"
      class="absolute inset-0 overflow-hidden"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="absolute text-blue-300 text-xs animate-pulse"
        :style="{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`
        }"
      >
        <font-awesome-icon icon="star" />
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<style scoped>
.theme-toggle {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.theme-toggle:hover {
  transform: scale(1.05);
}

.theme-toggle:active {
  transform: scale(0.95);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 