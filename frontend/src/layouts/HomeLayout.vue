<script lang="ts">
import { defineProps } from "vue";
type Props = {
  title?: string;
};

const props = defineProps<Props>();
</script>

<template>
  <div
    class="container p-[20px] flex-1 flex flex-col justify-center animate-fade"
  >
    <h2 class="text-2xl font-medium mb-6" v-if="title">{{ title }}</h2>
    <slot />
  </div>
  <HomeDetails />
</template>

<style lang="scss" scoped></style>
