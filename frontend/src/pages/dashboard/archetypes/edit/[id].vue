<script setup lang="ts">
import type { IArchetype } from "@common/schemas/archetype/archetype";
import type { IUpdateArchetype } from "@common/schemas/archetype/updateArchetype";
import { API_ROUTE } from "@common/static/routes";
import { makeUpdateToastOptions } from "~/helpers/fetch/toastOptions";
import { getSingleParams } from "~/helpers/getSingleParams";
import { getCurrentRouteBackToHref } from "~/helpers/routing/getRouteBackToHref";
import { ROUTE } from "~/static/routes";

const { fetchApi } = useFetchApi();

const id = getSingleParams("id");

const isLoading = ref(false);

const initialValues = ref<IUpdateArchetype | null>(null);

if (!id) {
  await navigateTo(ROUTE.archetypes.href);
}

const { data } = await useGetApi<IArchetype>({
  url: API_ROUTE.archetypes.get.url(id),
  loadingRefs: [isLoading],
});

const item = computed(() => data.value?.data);

watchEffect(() => {
  if (item.value) {
    initialValues.value = {
      name: item.value?.name,
      description: item.value?.description,
    };
  }
});

const onSubmit = async (values: IUpdateArchetype) => {
  await fetchApi({
    method: "PUT",
    url: API_ROUTE.archetypes.update.url(id),
    body: values,
    toastOptions: makeUpdateToastOptions({ label: "Archetype" }),
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
      <DashboardArchetypeForm
        v-if="initialValues"
        :initialValues="initialValues"
        :edit="true"
        :onSubmit="onSubmit"
        :isLoading="isLoading"
      />
    </DashboardSection>
  </NuxtLayout>
</template>
