<script setup lang="ts">
import type { IRoute } from "~/static/routes";

type Props = {
  route: IRoute;
  action?: () => void;
};

const props = defineProps<Props>();
</script>

<template>
  <NuxtLink :to="route.href">
    <li
      class="px-6 py-8 border-border border-b flex items-center gap-6 transition-colors accent-hover"
      @click="
        () => {
          if (action) {
            action();
          }
        }
      "
    >
      <component
        v-if="route.icon"
        :is="route.icon"
        class="text-current size-[20px]"
      />
      <span class="font-semibold"> {{ route.label }}</span>
    </li>
  </NuxtLink>
</template>

<style lang="scss" scoped></style>
