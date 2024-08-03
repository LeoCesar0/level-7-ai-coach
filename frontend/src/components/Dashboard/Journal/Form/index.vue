<script setup lang="ts" generic="T extends IUpdateJournal">
import { useForm, type FormContext } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  zUpdateJournal,
  type IUpdateJournal,
} from "@common/schemas/journal/updateJournal";
import {
  zCreateJournal,
  type ICreateJournal,
} from "@common/schemas/journal/createJournal";
import { format } from "date-fns";

type Props = {
  edit: boolean;
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  isLoading: boolean;
  formattedNow?: string;
};

const props = defineProps<Props>();

const formattedNowRef = ref(props.formattedNow);

const schema = props.edit ? zUpdateJournal : zCreateJournal;

// --------------------------
// COMPOSABLES
// --------------------------

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

// --------------------------
// FORM
// --------------------------

const form = useForm<IUpdateJournal | ICreateJournal>({
  validationSchema: toTypedSchema(schema),
  // @ts-ignore
  initialValues: props.initialValues,
});
watch(
  () => props.initialValues,
  (newValue) => {
    form.setValues(newValue);
  },
  {
    deep: true,
    immediate: true,
  }
);

const dateValue = computed(() => form.values.date);

watch(
  dateValue,
  (date) => {
    // --------------------------
    // UPDATE TITLE DATE
    // --------------------------
    if (
      formattedNowRef.value &&
      form.values.title &&
      form.values.title.includes(formattedNowRef.value) &&
      date
    ) {
      const newFormattedDate = format(date, "MM/dd/yyyy");
      form.setFieldValue(
        "title",
        form.values.title.replace(formattedNowRef.value, newFormattedDate)
      );
      formattedNowRef.value = newFormattedDate;
    }
  },
  {
    deep: true,
  }
);

const formIsValid = computed(() => {
  return !props.isLoading && form.meta.value.valid;
});

// --------------------------
// HANDLERS
// --------------------------

const handleSubmitDraft = async () => {
  form.setFieldValue("draft", true);
  const values = form.values;
  await props.onSubmit(values as unknown as T);
};
const handleSubmitFinished = async () => {
  const values = form.values;
  await props.onSubmit(values as unknown as T);
};
const handleSubmit = form.handleSubmit(async (values) => {
  await props.onSubmit(values as unknown as T);
});
</script>

<template>
  <Form @submit="handleSubmit" :full-width="true">
    <DashboardJournalSection :title="form.values.title || ''">
      <template v-slot:actions-right>
        <FormField :name="'draft'" input-variant="switch" label="Draft" />
        <FormField
          :name="'date'"
          input-variant="date"
          label="Date"
          :inLineInput="true"
        />
      </template>
      <template v-slot:title-input>
        <FormField
          :name="'title'"
          :input-variant="'custom'"
          :inputProps="{
            class:
              'text-2xl font-semibold bg-transparent border-0 focus:outline-none',
          }"
        />
      </template>
      <FormField
        :name="'text'"
        input-variant="textarea"
        :required="true"
        :input-props="{
          rows: 20,
        }"
      />
      <FormActions>
        <UiButton
          @click="handleSubmitDraft"
          type="button"
          :disabled="!formIsValid"
          variant="outline"
          >Save as draft</UiButton
        >
        <UiButton @click="handleSubmit" type="submit" :disabled="!formIsValid"
          >Save</UiButton
        >
      </FormActions>
    </DashboardJournalSection>
  </Form>
</template>
