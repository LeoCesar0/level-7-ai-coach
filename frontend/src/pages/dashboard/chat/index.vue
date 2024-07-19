<script setup lang="ts">
import { type IChat } from "@common/schemas/chat";
import { ROUTE } from "../../../static/routes";
import { stringToDate } from "@common/helpers/stringToDate";
const { createNewChat, getOpenChats, getChats } = useChat();

const openChat = ref<IChat | null>(null);
const closedChats = ref<IChat[]>([]);

onMounted(() => {
  getChats().then((res) => {
    closedChats.value = res.data?.list.filter((chat) => chat.closed) ?? [];
    const open = res.data?.list.find((chat) => !chat.closed);
    if (open) {
      openChat.value = open;
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

const getChatTitle = (chat: IChat) => {
  const date = stringToDate(chat.date);
  return `Chat ${date.toLocaleString()}`;
};
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <main class="flex container flex-col flex-1 justify-center gap-6">
      <div class="">
        <ChatCard
          @click="handleCreateNewChat"
          v-if="!openChat"
          title="New Chat"
        />
        <ChatCard @click="continueChat" v-if="openChat" title="Continue Chat" />
      </div>
      <div class="flex items-center gap-4 flex-wrap">
        <ChatCard
          v-for="(chat, index) in closedChats"
          @click="navigateTo(ROUTE.chat.href + `/${chat._id}`)"
          :title="getChatTitle(chat)"
        />
      </div>
    </main>
  </NuxtLayout>
</template>
