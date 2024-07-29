<script setup lang="ts">
import type { ICreateUser } from "@common/schemas/user/createUser";
import { zCreateUserRoute } from "@common/schemas/user/createUserRoute";
import { makeCreateToastOptions } from "~/helpers/fetch/toastOptions";
import { type ICreateUserRoute } from "@common/schemas/user/createUserRoute";
import type { IUser, IUserFull } from "@common/schemas/user/user";
import { ROUTE } from "~/static/routes";
import {
  getCurrentRouteBackToHref,
  getRouteBackToHref,
} from "~/helpers/routing/getRouteBackToHref";
import { API_ROUTE } from "@common/static/routes";

const initialValues: ICreateUserRoute = {
  user: {
    organization: "",
    email: "",
    name: "",
    imageUrl: "",
    role: "user",
    address: {
      address: "",
      city: "",
      country: "",
      state: "",
    },
    phone: "",
    phoneCode: "",
  },
  password: "",
};

const isLoading = ref(false);

const { fetchApi } = useFetchApi();

const onSubmit = async (values: ICreateUserRoute) => {
  await fetchApi<IUser>({
    method: "POST",
    url: API_ROUTE.users.create.url,
    body: values,
    toastOptions: makeCreateToastOptions({ label: "User" }),
    loadingRefs: [isLoading],
    onSuccess: async (data) => {
      const backToHref = getCurrentRouteBackToHref();
      if (backToHref) {
        await navigateTo(backToHref);
      }
    },
  });
};
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection title="Create User">
      <DashboardUserForm
        :initialValues="initialValues"
        :edit="false"
        :onSubmit="onSubmit"
        :isLoading="isLoading"
      />
    </DashboardSection>
  </NuxtLayout>
</template>
