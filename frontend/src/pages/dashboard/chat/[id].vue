<script setup lang="ts">
import { getSingleParams } from "~/helpers/getSingleParams";

const route = useRoute();

// let id = route.params.id ?? "";
// if (Array.isArray(id)) {
//   id = id[0] ?? "";
// }
const id = getSingleParams("id");
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <ChatPage :chatId="id" />
  </NuxtLayout>
</template>
