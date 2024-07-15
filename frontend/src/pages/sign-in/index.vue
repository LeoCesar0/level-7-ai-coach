<script setup lang="ts">
import { zSignIn, type ISignIn } from "@/@schemas/auth";

const { login, firebaseUser, logout } = useUser();

type Props = {};

const props = defineProps<Props>();

const onSubmit = async (values: ISignIn) => {
  try {
    await login(values);
  } catch (err) {
    console.log("❗ err -->", err);
  }
};
</script>
<template>
  <h2 class="text-2xl font-medium mb-6">
    Sign In firebaseUser: {{ firebaseUser?.displayName }}
  </h2>
  <UiButton
    @click="
      () => {
        logout();
      }
    "
    >test</UiButton
  >

  <UiAutoForm
    :field-config="{
      email: {
        label: 'Email',
        description: 'Enter your email address',
      },
      password: {
        label: 'Password',
        description: 'Enter your password',
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
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
}
</style>
