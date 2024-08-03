<script setup lang="ts">
import { makeCreateToastOptions } from "~/helpers/fetch/toastOptions";
import { getCurrentRouteBackToHref } from "~/helpers/routing/getRouteBackToHref";
import { API_ROUTE } from "@common/static/routes";
import type { ICreateJournal } from "@common/schemas/journal/createJournal";

const initialValues: ICreateJournal = {
  date: new Date(),
  text: "",
  title: "Title",
  draft: true,
};

const isLoading = ref(false);

const { fetchApi } = useFetchApi();

const onSubmit = async (values: ICreateJournal) => {
  await fetchApi<ICreateJournal>({
    method: "POST",
    url: API_ROUTE.journals.create.url,
    body: values,
    toastOptions: makeCreateToastOptions({ label: "Journal" }),
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
    <DashboardSection title="Create Journal">
      <DashboardJournalForm
        :initialValues="initialValues"
        :edit="false"
        :onSubmit="onSubmit"
        :isLoading="isLoading"
      />
    </DashboardSection>
  </NuxtLayout>
</template>
