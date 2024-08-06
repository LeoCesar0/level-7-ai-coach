<script setup lang="ts">
import { makeCreateToastOptions } from "~/helpers/fetch/toastOptions";
import { getCurrentRouteBackToHref } from "~/helpers/routing/getRouteBackToHref";
import { API_ROUTE } from "@common/static/routes";
import type { ICreateJournal } from "@common/schemas/journal/createJournal";
import { format } from "date-fns";

const now = new Date();
const formattedNow = format(now, "MM/dd/yyyy");

const initialValues: ICreateJournal = {
  date: now,
  text: "",
  // title: "My Daily Journal - " + formattedNow,
  title: "",
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
    <DashboardJournalForm
      :initialValues="initialValues"
      :edit="false"
      :onSubmit="onSubmit"
      :isLoading="isLoading"
      :formattedNow="formattedNow"
    />
  </NuxtLayout>
</template>
