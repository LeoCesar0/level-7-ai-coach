<script setup lang="ts">
type Props = {
  onSubmit: () => Promise<any>;
};

const props = defineProps<Props>();
</script>

<template>
  <form class="w-full max-w-[600px] space-y-6" @submit="onSubmit">
    <slot />
  </form>
</template>
