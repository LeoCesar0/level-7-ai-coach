<script setup lang="ts">
import { zSignIn, type ISignIn } from "@/@schemas/auth";
import {
  ATHLETE_QUESTIONS,
  zAthleteInfo,
  type IAthleteInfo,
} from "@common/schemas/user/athleteInfo";
import type { IUpdateUser } from "@common/schemas/user/updateUserRoute";
import { API_ROUTE } from "@common/static/routes";
import { makeUpdateToastOptions } from "~/helpers/fetch/toastOptions";
import { ROUTE } from "~/static/routes";

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
const { login, refreshCurrentUser } = userStore;

const isLoading = ref(false);

const { fetchApi } = useFetchApi();

const onSubmit = async (values: IUpdateUser) => {
  const id = currentUser.value?._id;
  if (!id) return;
  await fetchApi({
    method: "PUT",
    url: API_ROUTE.users.update.url(id),
    body: values,
    toastOptions: makeUpdateToastOptions({ label: "Athlete profile" }),
    loadingRefs: [isLoading],
    onSuccess: async (data) => {
      await refreshCurrentUser();
      await navigateTo(ROUTE.dashboard.href);
    },
  });
};
const initialValues = ref<IUpdateUser | null>(null);

const athleteInfoInitialValues: IAthleteInfo =
  ATHLETE_QUESTIONS.reduce<IAthleteInfo>((acc, entry) => {
    if (!acc[entry.key]) {
      acc[entry.key] = {
        answer: "",
        question: entry.question,
        section: entry.section,
      };
    }
    return acc;
  }, {});

watch(
  currentUser,
  (user) => {
    if (user && !initialValues.value) {
      initialValues.value = {
        athleteInfo: {
          ...athleteInfoInitialValues,
          ...(user.athleteInfo ?? {}),
        },
        birthDate: user.birthDate,
      };
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<template>
  <div
    class="form-container container p-[20px] flex-1 flex flex-col animate-fade"
  >
    <DashboardAthleteForm
      v-if="initialValues"
      :initialValues="initialValues"
      :onSubmit="onSubmit"
      :isLoading="isLoading"
    />
  </div>
</template>

<style lang="scss">
.form-container {
  padding-top: min(15%, 100px);
}
</style>
