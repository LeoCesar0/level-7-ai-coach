<script setup lang="ts">
import { type ICreateUser, zCreateUser } from "@common/schemas/user/createUser";
import z, { ZodSchema } from "zod";
import { type IArchetype } from "@common/schemas/archetype/archetype";
import { type IUser } from "@common/schemas/user/user";
import {
  type IUpdateUser,
  zUpdateUser,
} from "@common/schemas/user/updateUserRoute";

type Props = {
  edit: boolean;
};

const { data: archetypes } = await useListApi<IArchetype>({
  url: "/archetypes",
});

const zTest = computed(() => {
  return zUpdateUser
    .omit({
      __v: true,
      _id: true,
      birthDate: true,
      createdAt: true,
      updatedAt: true,
      firebaseId: true,
    })
    .merge(
      z.object({
        birthDate: z.coerce.date(),
      })
    );
});

const props = defineProps<Props>();

const onSubmit = async (values: ICreateUser) => {};
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
    >
      <div class="mt-4">
        <UiButton type="submit"> Submit </UiButton>
      </div>
    </UiAutoForm>
  </DashboardSection>
</template>
