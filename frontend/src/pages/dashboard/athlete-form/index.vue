<script setup lang="ts">
import { zSignIn, type ISignIn } from "@/@schemas/auth";

const userStore = useUserStore();
const { currentUser, loading } = storeToRefs(userStore);
const { login } = userStore;

const token = useAuthToken();

type Props = {};

const props = defineProps<Props>();

const onSubmit = async (values: ISignIn) => {};
</script>
<template>
  <div class="container p-[20px] py-[20%] flex-1 flex flex-col animate-fade">
    <h2 class="text-2xl font-medium mb-6">How would you</h2>
  </div>
</template>
