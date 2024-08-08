<script setup lang="ts">
import { ROUTE } from "@static/routes";

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const { fetchApi } = useFetchApi();
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection title="Assessments">
      <template v-slot:actions-right>
        <NuxtLink :to="ROUTE.createOrganization.href">
          <UiButton>Something</UiButton>
        </NuxtLink>
      </template>
    </DashboardSection>
  </NuxtLayout>
</template>
