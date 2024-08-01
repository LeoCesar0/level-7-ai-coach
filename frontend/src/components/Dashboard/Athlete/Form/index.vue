<script setup lang="ts" generic="T extends IUpdateUser">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { API_ROUTE } from "@common/static/routes";
import type { IUpdateUser } from "@common/schemas/user/updateUserRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IAthleteFormSection } from "@common/schemas/user/athleteInfo";
import { beautifyObjectName } from "~/components/ui/auto-form/utils";
import SectionForm from "../SectionForm.vue";

type Props = {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  isLoading: boolean;
};

const props = defineProps<Props>();
const currentTab = ref<IAthleteFormSection>("personal");
const tabOptions: IAthleteFormSection[] = [
  "personal",
  "effort",
  "emotional",
  "goals",
  "mental",
  "others",
  "progress",
];

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
  <div>Values: {{ form.values }}</div>
  <Form @submit="handleSubmit">
    <header class="">
      <h2 class="text-2xl font-medium mb-6">How would you</h2>
      <Tabs v-model="currentTab" class="w-full">
        <TabsList class="mb-4">
          <TabsTrigger
            v-for="option in tabOptions"
            :key="option"
            :value="option"
          >
            {{ beautifyObjectName(option) }}
          </TabsTrigger>
        </TabsList>
        <div class="min-h-[300px]">
          <TabsContent value="personal">
            <SectionForm section="personal" />
          </TabsContent>
        </div>
      </Tabs>
    </header>
    <div class="flex items-center gap-4">
      <UiButton type="button" :disabled="isLoading" :variant="'outline'"
        >Back</UiButton
      >
      <UiButton type="submit" :disabled="!formIsValid">Submit</UiButton>
    </div>
  </Form>
</template>
