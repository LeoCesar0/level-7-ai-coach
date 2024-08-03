<script setup lang="ts">
import { getSingleParams } from "~/helpers/getSingleParams";

const id = getSingleParams("id");
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <ChatPage :chatId="id" />
  </NuxtLayout>
</template>
