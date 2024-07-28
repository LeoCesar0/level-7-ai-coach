<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  zUpdateUser,
  type IUpdateUser,
} from "@common/schemas/user/updateUserRoute";
import type { IArchetype } from "@common/schemas/archetype/archetype";
import { API_ROUTE } from "@common/static/routes";
import { makeUpdateToastOptions } from "~/helpers/fetch/toastOptions";
import { getCurrentRouteBackToHref } from "~/helpers/routing/getRouteBackToHref";

// --------------------------
// COMPOSABLES
// --------------------------

const userStore = useUserStore();
const { refreshCurrentUser } = userStore;
const { currentUser } = storeToRefs(userStore);

const { fetchApi } = useFetchApi();

const props = defineProps();

const isLoading = ref(false);

const schema = zUpdateUser;

// --------------------------
// FORM
// --------------------------

const form = useForm<IUpdateUser>({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    name: "",
    phone: "",
    address: {
      city: "",
      state: "",
      country: "",
      address: "",
    },
    phoneCode: "",
    birthDate: "",
  },
});

const formIsValid = computed(() => {
  return !isLoading.value && form.meta.value.valid && currentUser.value;
});

watch(
  currentUser,
  () => {
    if (currentUser.value) {
      form.setValues({
        name: currentUser.value.name,
        phone: currentUser.value.phone,
        address: currentUser.value.address,
        phoneCode: currentUser.value.phoneCode,
        birthDate: currentUser.value.birthDate,
      });
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

// --------------------------
// HANDLERS
// --------------------------

const onSubmit = async (values: IUpdateUser) => {
  if (!currentUser.value) {
    return;
  }
  await fetchApi({
    method: "PUT",
    url: API_ROUTE.users.update.url(currentUser.value._id ?? ""),
    body: values,
    toastOptions: makeUpdateToastOptions({ label: "User" }),
    loadingRefs: [isLoading],
    onSuccess: async (data) => {
      await refreshCurrentUser();
    },
  });
};

const handleSubmit = form.handleSubmit(async (values) => {
  await onSubmit(values);
});
</script>

<template>
  <Form @submit="handleSubmit">
    <FormField :name="`name`" label="Name" :required="true" />
    <div class="flex items-center gap-4">
      <FormField :name="`phoneCode`" label="Phone Code" class="max-w-[200px]" />
      <FormField :name="`phone`" label="Phone" class="flex-1" />
    </div>
    <div class="flex flex-wrap gap-4">
      <FormField
        :name="`address.city`"
        label="City"
        class="flex-grow w-full sm:flex-1"
      />
      <FormField
        :name="`address.state`"
        label="State"
        class="flex-grow w-full sm:flex-1"
      />
      <FormField
        :name="`address.country`"
        label="Country"
        class="flex-grow w-full sm:flex-1"
      />
      <FormField
        :name="`address.address`"
        label="Address"
        class="flex-grow w-full"
      />
    </div>
    <FormField :name="`birthDate`" label="Birth Date" inputVariant="date" />
    <UiButton type="submit" :disabled="!formIsValid"> Save </UiButton>
  </Form>
</template>
