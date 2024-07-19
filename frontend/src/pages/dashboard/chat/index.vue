<script setup lang="ts">
import { type IChat } from "@/@types/chat";
import { ROUTE } from "../../../static/routes";
const { createNewChat, getOpenChats } = useChat();

const openChat = ref<IChat | null>(null);

onMounted(() => {
  getOpenChats().then((res) => {
    const chat = res.data?.list[0];
    if (chat) {
      openChat.value = chat;
    }
  });
});
const continueChat = () => {
  if (openChat.value) {
    navigateTo(ROUTE.chat.href + `/${openChat.value._id}`);
  }
};
const handleCreateNewChat = async () => {
  const response = await createNewChat();
  if (response.data) {
    navigateTo(ROUTE.chat.href + `/${response.data._id}`);
  }
};
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <main class="flex flex-1 items-center justify-center">
      <UiCard
        class="size-[250px] p-8 flex-center pointer accent-hover transition-all"
        @click="handleCreateNewChat"
        v-if="!openChat"
      >
        <h1 class="text-2xl">New Chat</h1>
      </UiCard>
      <UiCard
        class="size-[250px] p-8 flex-center pointer accent-hover transition-all"
        @click="continueChat"
        v-if="openChat"
      >
        <h1 class="text-2xl">Continue Chat</h1>
      </UiCard>
    </main>
  </NuxtLayout>
</template>
