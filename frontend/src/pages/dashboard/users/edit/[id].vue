<script setup lang="ts">
import {
  zUpdateUser,
  type IUpdateUser,
} from "@common/schemas/user/updateUserRoute";
import type { IUserFull } from "@common/schemas/user/user";
import { makeUpdateToastOptions } from "~/helpers/fetch/toastOptions";
import { getSingleParams } from "~/helpers/getSingleParams";
import { ROUTE } from "~/static/routes";

const { fetchApi } = useFetchApi();

const id = getSingleParams("id");

const isLoading = ref(false);

const initialValues = ref<IUpdateUser | null>(null);

const { status, data } = await useGetApi<IUserFull>({
  id,
  url: `/users`,
  loadingRefs: [isLoading],
});

if (!id) {
  navigateTo(ROUTE.users.href);
}
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
  console.log("❗ values -->", values);
  return;
  await fetchApi({
    method: "PUT",
    url: `/users/${id}`,
    body: values,
    toastOptions: makeUpdateToastOptions({ label: "User" }),
    loadingRefs: [isLoading],
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
