<script setup lang="ts">
type Props = {};

const props = defineProps<Props>();

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
</script>

<template>
  <div class="flex flex-1 relative pl-[var(--drawer-width)]">
    <DashboardMenu />
    <div class="flex-1 flex flex-col width-full">
      <DashboardHeader />
      <div class="p-4 pb-8 pt-10 flex-1 flex flex-col animate-fade relative">
        <slot />
      </div>
      <!-- <DashboardFooter /> -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
