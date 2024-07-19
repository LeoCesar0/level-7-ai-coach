<script setup lang="ts">
import type { IRoute } from "~/static/routes";
import { cn } from "../../../lib/utils";
import { compareRoute } from "../../../helpers/compareRoute";
const router = useRoute();

type Props = {
  route: IRoute;
  action?: () => void;
  isLast?: boolean;
};

const props = defineProps<Props>();

const isSelected = computed(() => {
  const href = props.route.href;
  console.log("❗ router.path -->", router.path);
  if (href === "/") {
    return router.path === "/";
  }
  if (href === "/dashboard") {
    return router.path === "/dashboard";
  }
  return href && router.path.includes(href);
});
</script>

<template>
  <NuxtLink :to="route.href">
    <li
      :class="
        cn(
          [
            'px-6 py-6 border-border border-b flex items-center gap-6 transition-colors pointer',
          ],
          {
            'bg-primary/60 text-primary-foreground hover:bg-primary/80':
              isSelected,
            'hover:bg-accent hover:text-accent-foreground': !isSelected,
            'border-b-0': !!isLast,
          }
        )
      "
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
