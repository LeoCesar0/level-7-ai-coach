<script setup lang="ts">
import {
  zCreateUserRoute,
  type ICreateUserRoute,
} from "@common/schemas/user/createUserRoute";

const initialValues: ICreateUserRoute = {
  user: {
    organization: "",
    email: "",
    name: "",
    imageUrl: "",
    role: "user",
  },
  password: "",
};
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection title="Create User">
      <DashboardUserForm :initialValues="initialValues" :edit="false" />
    </DashboardSection>
  </NuxtLayout>
</template>
