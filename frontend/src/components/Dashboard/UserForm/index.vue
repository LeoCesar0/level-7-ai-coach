<script setup lang="ts">
import { type ICreateUser } from "@common/schemas/user/createUser";
import z from "zod";
import { zUpdateUser } from "@common/schemas/user/updateUserRoute";
import { zCreateUser } from "@common/schemas/user/createUser";
import { zUser } from "@common/schemas/user/user";
import { type IOrganization } from "@common/schemas/organization/organization";
import UiAutoFormFieldSelect from "@components/ui/auto-form/AutoFormFieldSelect.vue";
import { type ISelectOption } from "../../../@schemas/select";

type Props = {
  edit: boolean;
};

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

const zTest = computed(() => {
  let schema = zUser
    .omit({
      __v: true,
      _id: true,
      birthDate: true,
      createdAt: true,
      updatedAt: true,
      firebaseId: true,
      archetype: true,
      organization: true,
    })
    .merge(
      z.object({
        birthDate: z.coerce.date(),
        // testFile: z.string(),
        // @ts-ignore
        organization: z.string(),
      })
    );
  if (!props.edit) {
    // @ts-ignore
    schema = schema.omit({
      active: true,
    });
  }
  return schema;
});

const props = defineProps<Props>();

const onSubmit = async (values: ICreateUser) => {
  console.log("❗ values -->", values);
};
</script>

<template>
  <DashboardSection title="Create User">
    <UiAutoForm
      :schema="zTest"
      class="max-w-[540px]"
      @submit="
      (values) => {
        onSubmit(values as ICreateUser);
      }
    "
      :field-config="{
        // testFile: {
        //   inputProps: {
        //     type: 'file',
        //   },
        // },
        organization: {
          component: UiAutoFormFieldSelect,
          _options: organizationOptions,
          // inputProps: {
          //   options: organizationOptions,
          // },
        },
      }"
    >
      <div class="mt-4">
        <UiButton type="submit"> Submit </UiButton>
      </div>
    </UiAutoForm>
  </DashboardSection>
</template>
