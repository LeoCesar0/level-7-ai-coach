<script setup lang="ts">
import { ROUTE } from "~/static/routes";
import { type IChatHistoryMessage } from "@common/schemas/chatHistory";
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
  sendChatMessage,
  createNewChat,
  getChat,
  getChatHistory,
} = useChat();

const { toast } = useToast();

const currentPrompt = ref<string>("");
const messages = ref<IChatHistoryMessage[]>([]);

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
  if (disabledChat.value) return;
  const chatId = currentChat.value?._id;
  if (!chatId) return;
  const mes: IChatHistoryMessage = {
    chat: chatId,
    message: currentPrompt.value,
    role: "human",
  };
  messages.value.push(mes);
  const response = await sendChatMessage({ message: currentPrompt.value });
  if (response?.data?.chatClosed && currentChat.value) {
    currentChat.value.closed = true;
  }
  if (response?.data) {
    const reply = response.data.reply;
    messages.value.push(reply);
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
    class="flex-1 flex flex-col gap-4 container p-4 rounded-2xl items-center max-w-[890px]"
  >
    <div class="flex-1 flex flex-col w-full p-8 space-y-4">
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
        @keyup.enter="
          () => {
            console.log('❗❗❗ Here ENTER');
            handleSendMessage();
          }
        "
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
