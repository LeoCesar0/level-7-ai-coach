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
import type { IArchetype } from "@common/schemas/archetype/archetype";
import { API_ROUTE } from "@common/static/routes";

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

// type T = ICreateUserRoute | IUpdateUser;
type T = Props["initialValues"];

const props = defineProps<Props>();

console.log("❗ props.initialValues -->", props.initialValues);

const schema = props.edit ? zUpdateUser : zCreateUserRoute;

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

const organizationOptions = computed<ISelectOption[]>(() => {
  const orgs = orgRes.value?.data ?? [];
  return orgs.map((item) => {
    return {
      label: item.name,
      value: item._id,
    };
  });
});

// --------------------------
// GET ARCHETYPE OPTIONS
// --------------------------

const { data: archetypeRes } = await useListApi<IArchetype>({
  url: "/archetypes/list",
});

const archetypeOptions = computed<ISelectOption[]>(() => {
  const items = archetypeRes.value?.data ?? [];
  return items.map((item) => {
    return {
      label: item.name,
      value: item._id,
    };
  });
});

// --------------------------
// ROLE OPTIONS
// --------------------------

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
// FORM
// --------------------------

const form = useForm<T>({
  validationSchema: toTypedSchema(schema),
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
// const { execute: createUser } = useCreateApi<T, any>({
//   url: "/users",
//   bodyRef: formValues,
// });

const handleSubmit = form.handleSubmit(async (values) => {
  // @ts-ignore
  await props.onSubmit(values);
});

const userKey = props.edit ? "" : "user.";
const formRoleValue = ref("");
watch(
  form.values,
  (newValue) => {
    if (userKey) {
      // @ts-ignore
      formRoleValue.value = newValue?.user?.role;
      return;
    }
    // @ts-ignore
    formRoleValue.value = newValue?.role;
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<template>
  <!-- <p>initial: {{ initialValues }}</p> -->
  <!-- <p>currentValues: {{ form.values }}</p> -->
  <Form @submit="handleSubmit">
    <FormField :name="`${userKey}name`" label="Name" :required="true" />
    <FormField :name="`${userKey}email`" label="Email" :required="true" />
    <FormField
      :name="`${userKey}organization`"
      label="Organization"
      inputVariant="select"
      :selectOptions="organizationOptions"
      :required="true"
    />
    <FormField
      :name="`${userKey}archetype`"
      label="Athlete Archetype"
      inputVariant="select"
      :selectOptions="archetypeOptions"
      :required="true"
      v-if="formRoleValue === 'user' && edit"
    />
    <FormField
      :name="`${userKey}role`"
      label="Role"
      inputVariant="select"
      :selectOptions="roleOptions"
      :required="true"
    />
    <div class="flex items-center gap-4">
      <FormField
        :name="`${userKey}phoneCode`"
        label="Phone Code"
        class="max-w-[200px]"
      />
      <FormField :name="`${userKey}phone`" label="Phone" class="flex-1" />
    </div>
    <div class="flex flex-wrap gap-4">
      <FormField
        :name="`${userKey}address.city`"
        label="City"
        class="flex-grow w-full sm:flex-1"
      />
      <FormField
        :name="`${userKey}address.state`"
        label="State"
        class="flex-grow w-full sm:flex-1"
      />
      <FormField
        :name="`${userKey}address.country`"
        label="Country"
        class="flex-grow w-full sm:flex-1"
      />
      <FormField
        :name="`${userKey}address.address`"
        label="Address"
        class="flex-grow w-full"
      />
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
      :required="true"
    />
    <UiButton type="submit" :disabled="!formIsValid"> Submit </UiButton>
  </Form>
</template>
