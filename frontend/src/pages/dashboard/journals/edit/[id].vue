<script setup lang="ts">
import type { IJournal } from "@common/schemas/journal/journal";
import type { IUpdateJournal } from "@common/schemas/journal/updateJournal";
import { API_ROUTE } from "@common/static/routes";
import { makeUpdateToastOptions } from "~/helpers/fetch/toastOptions";
import { getSingleParams } from "~/helpers/getSingleParams";
import { getCurrentRouteBackToHref } from "~/helpers/routing/getRouteBackToHref";
import { ROUTE } from "~/static/routes";

const { fetchApi } = useFetchApi();

const id = getSingleParams("id");

const isLoading = ref(false);

const initialValues = ref<IUpdateJournal | null>(null);

if (!id) {
  await navigateTo(ROUTE.journals.href);
}

const { data } = await useGetApi<IJournal>({
  url: API_ROUTE.journals.get.url(id),
  loadingRefs: [isLoading],
});

const item = computed(() => data.value?.data);

watchEffect(() => {
  if (item.value) {
    initialValues.value = {
      title: item.value?.title,
      text: item.value?.text,
      date: item.value?.date,
      images: item.value?.images,
      draft: item.value?.draft,
    };
  }
});

const onSubmit = async (values: IUpdateJournal) => {
  await fetchApi({
    method: "PUT",
    url: API_ROUTE.journals.update.url(id),
    body: values,
    toastOptions: makeUpdateToastOptions({ label: "Journal" }),
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
    <DashboardSection :title="`Editing ${item?.title ?? ''}`">
      <DashboardJournalForm
        v-if="initialValues"
        :initialValues="initialValues"
        :edit="true"
        :onSubmit="onSubmit"
        :isLoading="isLoading"
      />
    </DashboardSection>
  </NuxtLayout>
</template>
