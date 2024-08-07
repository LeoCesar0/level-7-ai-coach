<script setup lang="ts" generic="T extends IUpdateOrganization">
import { type IOrganization } from "@common/schemas/organization/organization";
import { type ISelectOption } from "@/@schemas/select";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { type IRole } from "@common/schemas/roles";
import {
  zCreateOrganization,
  type ICreateOrganization,
} from "@common/schemas/organization/createOrganization";
import {
  zUpdateOrganization,
  type IUpdateOrganization,
} from "@common/schemas/organization/updateOrganization";

// type T = ICreateOrganization | IUpdateOrganization;

type Props = {
  edit: boolean;
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  isLoading: boolean;
};

const props = defineProps<Props>();

const schema = props.edit ? zUpdateOrganization : zCreateOrganization;

// --------------------------
// COMPOSABLES
// --------------------------

const userStore = useUserStore();

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
  <!-- <p>initial: {{ initialValues }}</p> -->
  <!-- <p>currentValues: {{ form.values }}</p> -->
  <Form @submit="handleSubmit">
    <FormField
      :name="'active'"
      :input-variant="'switch'"
      label="Active"
      v-if="edit"
    />
    <FormField :name="'name'" label="Name" :required="true" />
    <FormActions>
      <UiButton type="submit" :disabled="!formIsValid">Submit</UiButton>
    </FormActions>
  </Form>
</template>
