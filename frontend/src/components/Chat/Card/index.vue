<script setup lang="ts">
type Props = {
  title: string;
};

const props = defineProps<Props>();
</script>

<template>
  <UiCard
    class="size-[250px] p-8 flex-center pointer accent-hover transition-all"
  >
    <h1 class="text-2xl">{{ title }}</h1>
  </UiCard>
</template>
