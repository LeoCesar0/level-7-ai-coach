<script setup lang="ts">
import { type ICreateUser } from "@common/schemas/user/createUser";
import z from "zod";
import { zUser } from "@common/schemas/user/user";
import { type IOrganization } from "@common/schemas/organization/organization";
import UiAutoFormFieldSelect from "@components/ui/auto-form/AutoFormFieldSelect.vue";
import { type ISelectOption } from "../../../@schemas/select";
import {
  zCreateUserRoute,
  type ICreateUserRoute,
} from "@common/schemas/user/createUserRoute";
import { type IUser } from "@common/schemas/user/user";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { type IRole } from "@common/schemas/roles";

type Props = {
  edit: boolean;
};

const props = defineProps<Props>();

const schema = zCreateUserRoute;

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

const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    user: {
      organization: "",
      email: "",
      name: "",
      imageUrl: "",
      role: "user",
    },
    password: "",
  },
});

const formValues = computed(() => {
  return form.values as ICreateUserRoute;
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
const { execute: createUser } = useCreateApi<ICreateUserRoute, IUser>({
  url: "/users",
  bodyRef: formValues,
});

const onSubmit = form.handleSubmit(async (values: ICreateUserRoute) => {
  await createUser();
});
</script>

<template>
  <DashboardSection title="Create User">
    <div>{{ formValues }}</div>
    <Form @submit="onSubmit">
      <FormField name="user.name" label="Name" />
      <FormField name="user.email" label="Email" />
      <FormField
        name="user.organization"
        label="Organization"
        inputVariant="select"
        :selectOptions="organizationOptions"
      />
      <FormField
        name="user.role"
        label="Role"
        inputVariant="select"
        :selectOptions="roleOptions"
      />
      <div class="flex items-center gap-4">
        <FormField
          name="user.phoneCode"
          label="Phone Code"
          class="max-w-[200px]"
        />
        <FormField name="user.phone" label="Phone" class="flex-1" />
      </div>
      <FormField name="user.birthDate" label="Birth Date" inputVariant="date" />
      <FormField
        name="password"
        label="Password"
        :inputProps="{ type: 'password' }"
      />
      <UiButton type="submit"> Submit </UiButton>
    </Form>
  </DashboardSection>
</template>
