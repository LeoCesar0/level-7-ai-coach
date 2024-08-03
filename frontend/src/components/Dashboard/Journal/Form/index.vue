<script setup lang="ts" generic="T extends IUpdateJournal">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  zUpdateJournal,
  type IUpdateJournal,
} from "@common/schemas/journal/updateJournal";
import { zCreateJournal } from "@common/schemas/journal/createJournal";

type Props = {
  edit: boolean;
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  isLoading: boolean;
};

const props = defineProps<Props>();

const schema = props.edit ? zUpdateJournal : zCreateJournal;

// --------------------------
// COMPOSABLES
// --------------------------

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

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
  <Form @submit="handleSubmit">
    <FormField
      :name="'date'"
      input-variant="date"
      label="Date"
      :required="true"
    />
    <FormField :name="'draft'" input-variant="switch" label="Draft" />
    <FormField :name="'title'" label="Title" :required="true" />
    <FormField
      :name="'text'"
      label="Text"
      input-variant="textarea"
      :required="true"
      :row="4"
    />

    <UiButton type="submit" :disabled="!formIsValid">Save</UiButton>
  </Form>
</template>
