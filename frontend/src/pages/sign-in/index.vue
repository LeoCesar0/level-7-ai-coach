<script setup lang="ts">
import { zSignIn, type ISignIn } from "@/@schemas/auth";

const userStore = useUserStore();
const { currentUser, loading } = storeToRefs(userStore);
const { login } = userStore;

const token = useAuthToken();

type Props = {};

const props = defineProps<Props>();

const onSubmit = async (values: ISignIn) => {
  await login(values);
};
</script>
<template>
  <NuxtLayout name="home-layout">
    <div class="mx-auto w-full max-w-[630px]" >
      <h2 class="text-2xl font-medium mb-6">Sign In</h2>
      <UiAutoForm
        :field-config="{
          email: {
            label: 'Email',
          },
          password: {
            label: 'Password',
            inputProps: {
              type: 'password',
            },
          },
        }"
        :schema="zSignIn"
        @submit="
      (values) => {
        onSubmit(values as ISignIn);
      }
    "
      >
        <div class="mt-4">
          <UiButton type="submit"> Submit </UiButton>
        </div>
      </UiAutoForm>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
}
</style>
