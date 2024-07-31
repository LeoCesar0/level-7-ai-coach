<script setup lang="ts" generic="T extends IUpdateOrganization">
import { type IOrganization } from "@common/schemas/organization/organization";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { zCreateOrganization } from "@common/schemas/organization/createOrganization";
import {
  zUpdateOrganization,
  type IUpdateOrganization,
} from "@common/schemas/organization/updateOrganization";
import { API_ROUTE } from "@common/static/routes";

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
const { currentUser } = storeToRefs(userStore);

// --------------------------
// GET ORGANIZATION OPTIONS
// --------------------------

const { data: orgRes } = await useListApi<IOrganization>({
  url: API_ROUTE.organizations.list.url,
});

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
    <FormField :name="'name'" label="Name" :required="true" />
    <FormField :name="'active'" label="Active" v-if="edit" />
    <UiButton type="submit" :disabled="!formIsValid">Submit</UiButton>
  </Form>
</template>
