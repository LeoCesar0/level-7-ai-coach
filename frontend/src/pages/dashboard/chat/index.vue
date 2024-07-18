import { ApiType } from '../../../../../backend/src/index';
<script setup lang="ts">
// --------------------------
// SETUP
// --------------------------
type Props = {};
const props = defineProps<Props>();

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
const {} = userStore;

const chatStore = useChatStore();
const { currentChat, isLoading, aiTyping } = storeToRefs(chatStore);
const { getOpenChats, sendChatMessage, createNewChat } = chatStore;

const { toast } = useToast();

const currentPrompt = ref<string>("");

// --------------------------
// COMPUTED
// --------------------------
const nRows = computed(() => {
  const charactersPerRow = 70;
  const rows = Math.ceil(currentPrompt.value.length / charactersPerRow);
  return Math.max(1, rows);
});

const disabledChat = computed(() => {
  return (
    isLoading.value ||
    aiTyping.value ||
    !currentChat.value ||
    currentChat.value.closed
  );
});

// --------------------------
// HANDLERS
// --------------------------

getOpenChats().then((res) => {
  if (res.data) {
    const chat = res.data.list[0];
    if (chat) {
      currentChat.value = chat;
    }
  }
});

const handleSendMessage = async () => {
  if (!currentChat.value) {
    const chatRes = await createNewChat();
    if (!chatRes.data) {
      toast.error("Failed to create chat");
      return;
    }
  }
  sendChatMessage({ message: currentPrompt.value });
};
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <main
      class="flex-1 flex flex-col gap-4 container p-4 rounded-2xl items-center"
    >
      <p>currentChat: {{ currentChat?._id }}</p>
      <div class="flex-1 flex flex-col w-full p-8">
        <ChatMessage
          :isCurrentUser="true"
          message="Hello, how can I help you today?"
          time="12:00 PM"
          user="John Doe"
        />
      </div>
      <UiCard
        class="shadow-lg py-4 px-8 w-full max-w-[800px] rounded-full flex items-center gap-4"
      >
        <UiTextarea
          class="w-full py-0 font-normal border-none shadow-none focus-visible:ring-0 text-lg resize-none max-h-[80px]"
          :rows="nRows"
          :tabindex="0"
          v-model="currentPrompt"
          :disabled="disabledChat"
        />
        <UiButton
          class=""
          variant="ghost"
          size="icon"
          @click="handleSendMessage"
          :disabled="disabledChat"
        >
          <!-- <PaperPlaneIcon /> -->
          <ChatSendIcon />
        </UiButton>
      </UiCard>
    </main>
  </NuxtLayout>
</template>
