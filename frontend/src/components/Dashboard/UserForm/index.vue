<script setup lang="ts">
import { type ICreateUser } from "@common/schemas/user/createUser";
import z, { ZodSchema } from "zod";
import { zUser } from "@common/schemas/user/user";
import { type IOrganization } from "@common/schemas/organization/organization";
import UiAutoFormFieldSelect from "@components/ui/auto-form/AutoFormFieldSelect.vue";
import { type ISelectOption } from "../../../@schemas/select";
import {
  zCreateUserRoute,
  type ICreateUserRoute,
} from "@common/schemas/user/createUserRoute";
import { type IUser } from "@common/schemas/user/user";
import { useForm, type GenericObject } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { type IRole } from "@common/schemas/roles";
import {
  zUpdateUser,
  type IUpdateUser,
} from "@common/schemas/user/updateUserRoute";

type T = ICreateUserRoute | IUpdateUser;

type Props =
  | {
      edit: false;
      initialValues: ICreateUserRoute;
      onSubmit: (values: ICreateUserRoute) => Promise<void>;
      isLoading: boolean;
    }
  | {
      edit: true;
      initialValues: IUpdateUser;
      onSubmit: (values: IUpdateUser) => Promise<void>;
      isLoading: boolean;
    };

const props = defineProps<Props>();

console.log("❗ props.initialValues -->", props.initialValues);

const schema = props.edit ? zUpdateUser : zCreateUserRoute;

// --------------------------
// COMPOSABLES
// --------------------------

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const { data: orgRes } = await useListApi<IOrganization>({
  url: "/organizations",
});

const organizationOptions = computed<ISelectOption[]>(() => {
  const orgs = orgRes.value?.data ?? [];
  return orgs.map((item) => {
    return {
      label: item.name,
      value: item._id,
    };
  });
});

const form = useForm<T>({
  validationSchema: toTypedSchema(schema),
  initialValues: {},
});

const formIsValid = computed(() => {
  return !props.isLoading && form.meta.value.valid;
});

watchEffect(() => {
  form.setValues(props.initialValues);
});

const roleOptions = computed<ISelectOption<IRole>[]>(() => {
  const roles: ISelectOption<IRole>[] = [
    { label: "User", value: "user" },
    { label: "Coach", value: "coach" },
  ];
  if (currentUser.value?.role === "admin") {
    roles.push({ label: "Admin", value: "admin" });
  }
  return roles;
});

// --------------------------
// HANDLERS
// --------------------------
// const { execute: createUser } = useCreateApi<T, any>({
//   url: "/users",
//   bodyRef: formValues,
// });

const handleSubmit = form.handleSubmit(async (values) => {
  // @ts-ignore
  await props.onSubmit(values);
});

const userKey = props.edit ? "" : "user.";
</script>

<template>
  <p>initial: {{ initialValues }}</p>
  <p>currentValues: {{ form.values }}</p>
  <Form @submit="handleSubmit">
    <FormField :name="`${userKey}name`" label="Name" />
    <FormField :name="`${userKey}email`" label="Email" />
    <FormField
      :name="`${userKey}organization`"
      label="Organization"
      inputVariant="select"
      :selectOptions="organizationOptions"
    />
    <FormField
      :name="`${userKey}role`"
      label="Role"
      inputVariant="select"
      :selectOptions="roleOptions"
    />
    <div class="flex items-center gap-4">
      <FormField
        :name="`${userKey}phoneCode`"
        label="Phone Code"
        class="max-w-[200px]"
      />
      <FormField :name="`${userKey}phone`" label="Phone" class="flex-1" />
    </div>
    <FormField
      :name="`${userKey}birthDate`"
      label="Birth Date"
      inputVariant="date"
    />
    <FormField
      name="password"
      label="Password"
      :inputProps="{ type: 'password' }"
      v-if="!props.edit"
    />
    <UiButton type="submit" :disabled="!formIsValid"> Submit </UiButton>
  </Form>
</template>
