<script setup lang="ts">
type Props = {};

const props = defineProps<Props>();
</script>

<template>
  <header class="debug">
    <h1>Header</h1>
  </header>
  <div class="layout-container debug-1">
    <slot />
  </div>
  <footer class="debug-2">footer</footer>
</template>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
}
</style>
