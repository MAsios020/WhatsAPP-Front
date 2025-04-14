<template>
  <router-view />
</template>

<script setup lang="ts">
// Component logic here
</script>

<style>
/* Import base styles */
@import './assets/styles/variables.css';
@import './assets/styles/dashboard.css';
@import './assets/auth.css';

/* Global styles that should always be applied */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: var(--transition);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Prevent FOUC */
[v-cloak] {
  display: none;
}
</style> 