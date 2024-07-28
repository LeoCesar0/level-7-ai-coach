<script setup lang="ts">
type Props = {
  to: string;
};

const props = defineProps<Props>();
</script>

<template>
  <NuxtLink :to="props.to" class="text-primary">
    <slot></slot>
  </NuxtLink>
</template>
