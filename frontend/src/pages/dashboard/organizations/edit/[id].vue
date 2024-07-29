<script setup lang="ts">
import type { IOrganization } from "@common/schemas/organization/organization";
import type { IUpdateOrganization } from "@common/schemas/organization/updateOrganization";
import { API_ROUTE } from "@common/static/routes";
import { makeUpdateToastOptions } from "~/helpers/fetch/toastOptions";
import { getSingleParams } from "~/helpers/getSingleParams";
import { getCurrentRouteBackToHref } from "~/helpers/routing/getRouteBackToHref";
import { ROUTE } from "~/static/routes";

const { fetchApi } = useFetchApi();

const id = getSingleParams("id");

const isLoading = ref(false);

const initialValues = ref<IUpdateOrganization | null>(null);

if (!id) {
  await navigateTo(ROUTE.organizations.href);
}

const { status, data } = await useGetApi<IOrganization>({
  url: API_ROUTE.organizations.get.url(id),
  loadingRefs: [isLoading],
});

const item = computed(() => data.value?.data);

watchEffect(() => {
  if (item.value) {
    initialValues.value = {
      name: item.value?.name,
      imageUrl: item.value?.imageUrl,
      active: item.value?.active,
      users: item.value?.users,
    };
  }
});

const onSubmit = async (values: IUpdateOrganization) => {
  await fetchApi({
    method: "PUT",
    url: API_ROUTE.organizations.update.url(id),
    body: values,
    toastOptions: makeUpdateToastOptions({ label: "Team" }),
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
    <DashboardSection :title="`Editing ${item?.name ?? ''}`">
      <DashboardOrganizationForm
        v-if="initialValues"
        :initialValues="initialValues"
        :edit="true"
        :onSubmit="onSubmit"
        :isLoading="isLoading"
      />
    </DashboardSection>
  </NuxtLayout>
</template>
