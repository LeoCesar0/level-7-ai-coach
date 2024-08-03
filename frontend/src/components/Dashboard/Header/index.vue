<script setup lang="ts">
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
</script>

<template>
  <header class="w-full border-border border-b py-4 px-6 mb-10">
    <div class="mx-auto flex items-center justify-between">
      <div>
        <DashboardHeaderProfile />
      </div>
      <div>
        <GlobalThemeSwitcher />
      </div>
    </div>
  </header>
</template>
