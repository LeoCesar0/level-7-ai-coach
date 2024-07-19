<script setup lang="ts">
import { ROUTE } from "~/static/routes";
// --------------------------
// SETUP
// --------------------------
type Props = {
  chatId?: string;
};
const props = defineProps<Props>();

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
const {} = userStore;

// const chatStore = useChatStore();
// const { currentChat, isLoading, aiTyping } = storeToRefs(chatStore);
// const { getOpenChats, sendChatMessage, createNewChat } = chatStore;

const {
  currentChat,
  isLoading,
  aiTyping,
  messages,
  sendChatMessage,
  createNewChat,
  getChat,
  getChatHistory,
} = useChat();

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
  const hasCurrentChatButIsDisabled =
    currentChat.value && currentChat.value.closed;

  return isLoading.value || aiTyping.value || hasCurrentChatButIsDisabled;
});

// --------------------------
// HANDLERS
// --------------------------

const handleGetHistory = async () => {
  const chatId = currentChat.value?._id;
  if (!chatId) return;
  const response = await getChatHistory({ chatId: chatId });

  if (response.data) {
    messages.value = response.data;
  }
};

const handleSendMessage = async () => {
  if (disabledChat) return;

  if (!currentChat.value) {
    const chatRes = await createNewChat();
    if (!chatRes.data) {
      toast.error("Failed to create chat");
      return;
    }
  }
  const response = await sendChatMessage({ message: currentPrompt.value });
  if (response?.data?.chatClosed && currentChat.value) {
    currentChat.value.closed = true;
  }
  currentPrompt.value = "";
};

// --------------------------
// ON MOUNTED
// --------------------------

onMounted(async () => {
  if (!props.chatId) {
    toast.error("Chat not found");
    navigateTo(ROUTE["chat"].href);
    return;
  }

  const { data } = await getChat({ chatId: props.chatId });

  if (data) {
    currentChat.value = data;
    handleGetHistory();
  } else {
    navigateTo(ROUTE.chat.href);
  }
});
</script>

<template>
  <main
    class="flex-1 flex flex-col gap-4 container p-4 rounded-2xl items-center"
  >
    <p>chatId: {{ chatId }}</p>
    <p>currentChat: {{ currentChat?._id }}</p>
    <div class="flex-1 flex flex-col w-full p-8">
      <ChatMessage
        v-for="(message, index) in messages"
        :key="`${index}-${message.role}-${message.message.slice(0, 10)}`"
        :message="message"
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
</template>
