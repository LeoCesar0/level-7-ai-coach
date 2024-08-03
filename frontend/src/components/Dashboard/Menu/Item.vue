<script setup lang="ts">
import type { IRoute } from "~/static/routes";
import { cn } from "../../../lib/utils";
import { compareRoute } from "../../../helpers/compareRoute";
const router = useRoute();

type Props = {
  route:
    | {
        href: IRoute["href"];
        label: IRoute["label"];
        icon: IRoute["icon"];
      }
    | IRoute;
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
  <div class="item-wrapper">
    <NuxtLink :to="route.href">
      <li
        :data-selected="!!isSelected"
        :class="
          cn(
            [
              'menu-item relative px-6 py-4 border-border border-b flex items-center gap-6 transition-colors pointer ',
            ],
            {
              ' text-primary-foreground ': isSelected,
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
        <div class="border-effect" v-if="isSelected"></div>
        <component
          v-if="route.icon"
          :is="route.icon"
          class="text-current size-[20px]"
        />
        <span class="font-semibold"> {{ route.label }}</span>
      </li>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
$itemWrapperPaddingLeft: 8px;
$itemWrapperPaddingRight: calc($itemWrapperPaddingLeft + 4px);
$rounded: 8px;
.item-wrapper {
  padding-left: $itemWrapperPaddingLeft;
  padding-right: $itemWrapperPaddingRight;
}
.menu-item {
  border-radius: $rounded;
}
.menu-item[data-selected="true"] {
  border-radius: $rounded;
  @apply bg-primary/80 hover:bg-primary/100;
}

.border-effect {
  position: absolute;
  height: 100%;
  right: -$itemWrapperPaddingRight;
  width: 4px;
  border-radius: $rounded;
  @apply bg-primary/80 transition-colors;
}
.menu-item:hover .border-effect {
  @apply bg-primary/100;
}
</style>
