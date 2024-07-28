<script setup lang="ts">
import {
  zUpdateUser,
  type IUpdateUser,
} from "@common/schemas/user/updateUserRoute";
import type { IUserFull } from "@common/schemas/user/user";
import { API_ROUTE } from "@common/static/routes";
import { makeUpdateToastOptions } from "~/helpers/fetch/toastOptions";
import { getSingleParams } from "~/helpers/getSingleParams";
import { getCurrentRouteBackToHref } from "~/helpers/routing/getRouteBackToHref";
import { ROUTE } from "~/static/routes";

const { fetchApi } = useFetchApi();

const id = getSingleParams("id");

const isLoading = ref(false);

const initialValues = ref<IUpdateUser | null>(null);

if (!id) {
  await navigateTo(ROUTE.users.href);
}

const { status, data } = await useGetApi<IUserFull>({
  url: API_ROUTE.users.get.url(id),
  loadingRefs: [isLoading],
});

const user = computed(() => data.value?.data);

watchEffect(() => {
  if (user.value && !initialValues.value) {
    initialValues.value = {
      name: user.value?.name,
      email: user.value?.email,
      organization: user.value?.organization._id,
      imageUrl: user.value?.imageUrl,
      role: user.value?.role,
      active: user.value?.active,
      phone: user.value?.phone,
      address: user.value?.address,
      phoneCode: user.value?.phoneCode,
      birthDate: user.value?.birthDate,
    };
  }
});

const onSubmit = async (values: IUpdateUser) => {
  // console.log("❗ values -->", values);
  await fetchApi({
    method: "PUT",
    url: API_ROUTE.users.update.url(id),
    body: values,
    toastOptions: makeUpdateToastOptions({ label: "User" }),
    loadingRefs: [isLoading],
    onSuccess: async (data) => {
      const backToHref = getCurrentRouteBackToHref();
      if (backToHref) {
        navigateTo(backToHref);
      }
    },
  });
};
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection :title="`Editing ${user?.name ?? ''}`">
      <DashboardUserForm
        v-if="initialValues"
        :initialValues="initialValues"
        :edit="true"
        :onSubmit="onSubmit"
        :isLoading="isLoading"
      />
    </DashboardSection>
  </NuxtLayout>
</template>
