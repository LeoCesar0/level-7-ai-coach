<script setup lang="ts">
type Props = {
  title: string;
};

const props = defineProps<Props>();
</script>

<template>
  <div class="container">
    <header class="flex justify-between items-center gap-4">
      <div class="flex items-center gap-6">
        <h2 class="mb-6 text-2xl font-bold">{{ title }}</h2>
        <div class="flex items-center gap-4">
          <slot name="actions-left" />
        </div>
      </div>
      <div class="flex items-center gap-4">
        <slot name="actions-right" />
      </div>
    </header>
    <div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
