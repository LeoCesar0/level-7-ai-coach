<script setup lang="ts">
const useUserStore = useUser();
const { currentUser } = storeToRefs(useUserStore);
</script>

<template>
  <header class="w-full py-2">
    <UiCard
      class="container h-[70px] mx-auto flex items-center justify-between"
    >
      <div></div>
      <div>{{ currentUser?.name }}</div>
    </UiCard>
  </header>
</template>
