<script setup lang="ts">
import type { AppIcon } from "~/static/routes";

type Props = {
  title: string;
  description: string;
  icon?: AppIcon;
};

const props = defineProps<Props>();
</script>

<template>
  <UiCard
    class="w-[230px] p-6 flex flex-col gap-4 pointer accent-hover transition-all"
  >
    <div class="flex items-center justify-center gap-3">
      <slot name="icon" />
      <component :is="icon" v-if="icon" />
      <h1 class="text-2xl font-medium">{{ title }}</h1>
    </div>
    <div>
      <p class="text-muted-foreground text-center text-sm">
        {{ description }}
      </p>
    </div>
  </UiCard>
</template>
