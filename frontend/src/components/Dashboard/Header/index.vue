<script setup lang="ts">
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
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
