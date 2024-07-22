<script setup lang="ts">
type Props = {
  title: string;
};

const props = defineProps<Props>();
</script>

<template>
  <div class="container">
    <h2 class="mb-6 text-2xl font-bold">{{ title }}</h2>
    <div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
