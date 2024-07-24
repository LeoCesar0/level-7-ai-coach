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

const { data, status } = await useGetApi<IUserFull>({
  id,
  url: `/users`,
  loadingRefs: [isLoading],
});

if (!id) {
  navigateTo(ROUTE.users.href);
}
const user = computed(() => data.value?.data);

const onSubmit = async (values: IUpdateUser) => {
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
        v-if="status === 'success'"
        :initialValues="{
          name: user?.name,
          email: user?.email,
          organization: user?.organization._id,
          imageUrl: user?.imageUrl,
          role: user?.role,
        }"
        :edit="true"
        :onSubmit="onSubmit"
        :isLoading="isLoading"
      />
    </DashboardSection>
  </NuxtLayout>
</template>
