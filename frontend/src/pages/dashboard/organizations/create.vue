<script setup lang="ts">
import { makeCreateToastOptions } from "~/helpers/fetch/toastOptions";
import { getCurrentRouteBackToHref } from "~/helpers/routing/getRouteBackToHref";
import type { ICreateOrganization } from "@common/schemas/organization/createOrganization";
import { API_ROUTE } from "@common/static/routes";

const initialValues: ICreateOrganization = {
  name: "",
  imageUrl: "",
  users: [],
};

const isLoading = ref(false);

const { fetchApi } = useFetchApi();

const onSubmit = async (values: ICreateOrganization) => {
  await fetchApi<ICreateOrganization>({
    method: "POST",
    url: API_ROUTE.organizations.create.url,
    body: values,
    toastOptions: makeCreateToastOptions({ label: "Team" }),
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
    <DashboardSection title="Create Team">
      <DashboardOrganizationForm
        :initialValues="initialValues"
        :edit="false"
        :onSubmit="onSubmit"
        :isLoading="isLoading"
      />
    </DashboardSection>
  </NuxtLayout>
</template>
