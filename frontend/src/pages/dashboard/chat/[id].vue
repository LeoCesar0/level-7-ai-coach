<script setup lang="ts">
const route = useRoute();

let id = route.params.id ?? "";

if (Array.isArray(id)) {
  id = id[0] ?? "";
}
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <ChatPage :chatId="id" />
  </NuxtLayout>
</template>
