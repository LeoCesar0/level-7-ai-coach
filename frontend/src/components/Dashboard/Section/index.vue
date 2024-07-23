<script setup lang="ts">
import { ROUTE } from "@static/routes";
const route = useRoute();

type Props = {
  title: string;
};

const props = defineProps<Props>();

const goBackLink = computed(() => {
  const path = route.path.split("/");
  path.pop();
  const indexOfDashboard = path.findIndex(
    (p) => p === ROUTE.dashboard.href.replaceAll("/", "")
  );
  if (indexOfDashboard >= 0 && path[indexOfDashboard + 1]) {
    return path.join("/");
  }
  return "";
});
</script>

<template>
  <div class="container">
    <header class="border-border border-b pb-4 mb-4">
      <div v-if="goBackLink" class="flex items-center mb-2">
        <NuxtLink :to="goBackLink" class="flex items-end gap-2 py-2">
          <IconsGoBack />
          <span class="text-sm leading-none">Back</span>
        </NuxtLink>
      </div>
      <div class="flex justify-between items-center gap-4">
        <div class="flex items-center gap-6">
          <h2 class="text-2xl font-bold">{{ title }}</h2>
          <div class="flex items-center gap-4">
            <slot name="actions-left" />
          </div>
        </div>
        <div class="flex items-center gap-4">
          <slot name="actions-right" />
        </div>
      </div>
    </header>
    <div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
