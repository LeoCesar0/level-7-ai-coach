<script setup lang="ts">
import type { IUserFull } from "@common/schemas/user/user";
import { getSingleParams } from "~/helpers/getSingleParams";
import { ROUTE } from "~/static/routes";

const id = getSingleParams("id");

const { data } = await useGetApi<IUserFull>({
  id,
  url: `/users`,
});

if (!id) {
  navigateTo(ROUTE.dashboard.href);
}
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection :title="`Editing ${data?.data?.name ?? ''}`">
      <DashboardUserForm :edit="true" />
    </DashboardSection>
  </NuxtLayout>
</template>
