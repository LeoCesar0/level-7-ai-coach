<script setup lang="ts">
import {
  zUpdateUser,
  type IUpdateUser,
} from "@common/schemas/user/updateUserRoute";
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
const user = computed(() => data.value?.data);
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection :title="`Editing ${user?.name ?? ''}`">
      <DashboardUserForm
        v-if="user"
        :initialValues="{
          name: user.name,
          email: user.email,
          organization: user.organization._id,
          imageUrl: user.imageUrl,
          role: user.role,
        }"
        :edit="true"
      />
    </DashboardSection>
  </NuxtLayout>
</template>
