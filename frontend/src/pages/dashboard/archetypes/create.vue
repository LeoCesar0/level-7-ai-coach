<script setup lang="ts">
import { makeCreateToastOptions } from "~/helpers/fetch/toastOptions";
import { getCurrentRouteBackToHref } from "~/helpers/routing/getRouteBackToHref";
import { API_ROUTE } from "@common/static/routes";
import type { ICreateArchetype } from "@common/schemas/archetype/createArchetype";

const initialValues: ICreateArchetype = {
  name: "",
  description: "",
};

const isLoading = ref(false);

const { fetchApi } = useFetchApi();

const onSubmit = async (values: ICreateArchetype) => {
  await fetchApi<ICreateArchetype>({
    method: "POST",
    url: API_ROUTE.archetypes.create.url,
    body: values,
    toastOptions: makeCreateToastOptions({ label: "Archetype" }),
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
    <DashboardSection title="Create Archetype">
      <DashboardArchetypeForm
        :initialValues="initialValues"
        :edit="false"
        :onSubmit="onSubmit"
        :isLoading="isLoading"
      />
    </DashboardSection>
  </NuxtLayout>
</template>
