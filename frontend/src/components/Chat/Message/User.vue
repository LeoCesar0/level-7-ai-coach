<script setup lang="ts">
import { cn } from "@lib/utils";
type Props = {
  userName: string;
  date: string;
  right?: boolean;
};

const props = defineProps<Props>();
</script>

<template>
  <div
    class="flex items-center gap-2"
    :class="cn({ 'flex-row-reverse': right })"
  >
    <div class="w-8 h-8 bg-muted rounded-full"></div>
    <div class="flex flex-col">
      <span class="text-sm font-semibold">{{ userName }}</span>
      <span class="text-xs text-muted-foreground">{{ date }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
