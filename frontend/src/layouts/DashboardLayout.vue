<script setup lang="ts">
type Props = {};

const props = defineProps<Props>();

const useUserStore = useUser();
const { currentUser } = storeToRefs(useUserStore);
</script>

<template>
  <div class="flex debug-3 flex-1 relative pl-[w-[var(--drawer-width)]]">
    <DashboardMenu />
    <div class="flex-1 width-full">
      <header
        class="debug container h-[70px] flex items-center justify-between"
      >
        <div></div>
        <div>{{ currentUser?.name }}</div>
      </header>
      <div class="layout-container debug-1">
        <slot />
      </div>
      <footer class="debug-2">footer</footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
}
</style>
