<script setup lang="ts" generic="T extends IUpdateUser">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { API_ROUTE } from "@common/static/routes";
import type { IUpdateUser } from "@common/schemas/user/updateUserRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ATHLETE_INFO_SECTIONS,
  type IAthleteFormSection,
} from "@common/schemas/user/athleteInfo";
import { beautifyObjectName } from "~/components/ui/auto-form/utils";
import SectionForm from "../SectionForm.vue";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-vue-next";

type Props = {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  isLoading: boolean;
};

const props = defineProps<Props>();
const currentTab = ref<IAthleteFormSection>("personal");

const prevTab = computed(() => {
  const currentIndex = ATHLETE_INFO_SECTIONS.findIndex(
    (item) => item === currentTab.value
  );
  return ATHLETE_INFO_SECTIONS[currentIndex - 1] ?? null;
});
const nextTab = computed(() => {
  const currentIndex = ATHLETE_INFO_SECTIONS.findIndex(
    (item) => item === currentTab.value
  );
  return ATHLETE_INFO_SECTIONS[currentIndex + 1] ?? null;
});
const goNext = () => {
  if (nextTab.value) {
    currentTab.value = nextTab.value;
  }
};
const goPrev = () => {
  if (prevTab.value) {
    currentTab.value = prevTab.value;
  }
};

const schema = API_ROUTE.users.update.bodySchema;

// --------------------------
// COMPOSABLES
// --------------------------

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

// --------------------------
// GET ORGANIZATION OPTIONS
// --------------------------

// --------------------------
// FORM
// --------------------------

const form = useForm<T>({
  validationSchema: toTypedSchema(schema),
  // @ts-ignore
  initialValues: props.initialValues,
  keepValuesOnUnmount: true,
});
watch(
  () => props.initialValues,
  (newValue) => {
    // @ts-ignore
    form.setValues(newValue);
  },
  {
    deep: true,
    immediate: true,
  }
);

const formIsValid = computed(() => {
  return !props.isLoading && form.meta.value.valid;
});

// --------------------------
// HANDLERS
// --------------------------

const handleSubmit = form.handleSubmit(async (values) => {
  await props.onSubmit(values as unknown as T);
});
</script>

<template>
  <Form @submit="handleSubmit" :full-width="true">
    <!-- <p>{{ JSON.stringify(form.values) }}</p> -->
    <header class="">
      <h2 class="text-4xl font-medium mb-10 border-b border-border pb-2">
        Athlete's Questionnaire
      </h2>
      <Tabs v-model="currentTab" class="w-full">
        <TabsList class="mb-10">
          <TabsTrigger
            v-for="section in ATHLETE_INFO_SECTIONS"
            :key="section"
            :value="section"
          >
            {{ beautifyObjectName(section) }}
          </TabsTrigger>
        </TabsList>
        <div class="min-h-[300px]">
          <TabsContent
            v-for="section in ATHLETE_INFO_SECTIONS"
            :value="section"
            :key="section"
          >
            <SectionForm :section="section" :form="form" />
          </TabsContent>
        </div>
      </Tabs>
    </header>
    <div class="flex items-center justify-end gap-6">
      <UiButton
        type="button"
        :disabled="isLoading || !prevTab"
        :variant="'outline'"
        @click="goPrev"
        :size="'icon'"
      >
        <ArrowLeftIcon />
      </UiButton>
      <UiButton
        type="button"
        :disabled="isLoading || !nextTab"
        :variant="'outline'"
        @click="goNext"
        :size="'icon'"
        ><ArrowRightIcon
      /></UiButton>
      <UiButton type="submit" :disabled="!formIsValid || nextTab">Save</UiButton>
    </div>
  </Form>
</template>
