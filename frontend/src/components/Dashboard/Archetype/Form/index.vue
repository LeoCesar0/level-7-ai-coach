<script setup lang="ts" generic="T extends IUpdateArchetype">
import { type ISelectOption } from "@/@schemas/select";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  zUpdateArchetype,
  type IUpdateArchetype,
} from "@common/schemas/archetype/updateArchetype";
import { zCreateArchetype } from "@common/schemas/archetype/createArchetype";

type Props = {
  edit: boolean;
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  isLoading: boolean;
};

const props = defineProps<Props>();

const schema = props.edit ? zUpdateArchetype : zCreateArchetype;

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
  <p>initialValues: {{ initialValues }}</p>
  <Form @submit="handleSubmit">
    <FormField :name="'name'" label="Name" :required="true" />
    <FormField
      :name="'description'"
      label="Description"
      input-variant="textarea"
    />
    <UiButton type="submit" :disabled="!formIsValid">Save</UiButton>
  </Form>
</template>
