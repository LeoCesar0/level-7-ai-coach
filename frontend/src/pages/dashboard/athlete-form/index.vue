<script setup lang="ts">
import { zSignIn, type ISignIn } from "@/@schemas/auth";
import {
  ATHLETE_QUESTIONS,
  type IAthleteInfo,
} from "@common/schemas/user/athleteInfo";
import type { IUpdateUser } from "@common/schemas/user/updateUserRoute";

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
const { login } = userStore;

const isLoading = ref(false);

const onSubmit = async (values: IUpdateUser) => {};
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
          // ...athleteInfoInitialValues,
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
