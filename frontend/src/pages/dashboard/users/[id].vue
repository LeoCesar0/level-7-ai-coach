<script setup lang="ts">
import { ROUTE } from "~/static/routes";

const route = useRoute();

const id = route.params.id;

if (!id) {
  navigateTo(ROUTE.dashboard.href);
}
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardUserForm :edit="true" />
  </NuxtLayout>
</template>
