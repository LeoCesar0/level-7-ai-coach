<script setup lang="ts">
import { ROUTE } from "~/static/routes";
import { type IFormattedMessage } from "@common/schemas/chat/message";
import debounce from "lodash.debounce";
import { cn } from "~/lib/utils";

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
const messages = ref<IFormattedMessage[]>([]);
const messagesContainerRef = ref<HTMLDivElement | undefined>(undefined);
const inputRef = ref<HTMLTextAreaElement | undefined>(undefined);

// --------------------------
// COMPUTED
// --------------------------
const nRows = computed(() => {
  const charactersPerRow = 70;
  const rows = Math.ceil(currentPrompt.value.length / charactersPerRow);
  return Math.max(1, rows);
});

const closedChat = computed(() => {
  return currentChat.value && currentChat.value.closed;
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

const focusInput = () => {
  if (inputRef.value?.focus) {
    inputRef.value?.focus();
  }
};

const handleSendMessage = async () => {
  const chatId = currentChat.value?._id;
  if (!chatId || disabledChat.value || !currentPrompt.value) return;

  const mes: IFormattedMessage = {
    chat: chatId,
    message: currentPrompt.value,
    role: "human",
  };
  messages.value.push(mes);
  currentPrompt.value = "";
  const response = await sendChatMessage({ message: mes.message });
  if (response?.data?.chatClosed && currentChat.value) {
    currentChat.value.closed = true;
  }
  if (response?.data) {
    const reply = response.data.reply;
    messages.value.push(reply);
  }
  focusInput();
};

const scrollToLastMessage = () => {
  const lastMessage = messagesContainerRef.value?.lastElementChild;
  if (lastMessage) {
    lastMessage.scrollIntoView({ behavior: "smooth" });
  }
  focusInput();
};
const debouncedScrollToLastMessage = debounce(scrollToLastMessage, 50);

watch(
  messages,
  () => {
    scrollToLastMessage();
  },
  {
    immediate: true,
    deep: true,
  }
);

// --------------------------
// ON MOUNTED
// --------------------------

onMounted(async () => {
  if (!props.chatId) {
    toast.error("Chat not found");
    navigateTo(ROUTE["chats"].href);
    return;
  }

  messagesContainerRef.value?.addEventListener("DOMNodeInserted", () => {
    // scrollToLastMessage();
    debouncedScrollToLastMessage();
  });

  const { data } = await getChat({ chatId: props.chatId });

  if (data) {
    console.log('❗ currentChat -->', data);
    currentChat.value = data;
    await handleGetHistory();
  } else {
    await navigateTo(ROUTE.chats.href);
  }
});
// :ref="el => messagesContainerRef.push(el)"
</script>

<template>
  <main
    class="flex-1 flex flex-col gap-4 container p-4 rounded-2xl items-center max-w-[890px] relative"
  >
    <div
      class="flex-1 flex flex-col w-full p-8 space-y-6"
      ref="messagesContainerRef"
    >
      <ChatMessage
        v-for="(message, index) in messages"
        :key="`${index}-${message.role}-${message.message.slice(0, 10)}`"
        :message="message"
      />
      <ChatMessage
        v-if="aiTyping"
        :message="{
          chat: '123',
          message: '',
          role: 'ai',
        }"
        :is-typing="true"
      />
      <div v-if="closedChat" class="text-center p-4">
        <p class="text-muted-foreground text-lg">This chat is closed!</p>
      </div>
    </div>
    <UiCard
      class="shadow-lg py-4 px-8 w-full max-w-[800px] rounded-full flex items-center gap-4 sticky bottom-12"
    >
      <textarea
        v-model="currentPrompt"
        :class="
          cn(
            'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            'w-full py-0 font-normal border-none shadow-none focus-visible:ring-0 text-lg resize-none max-h-[80px]'
          )
        "
        :rows="nRows"
        :tabindex="0"
        :disabled="!!disabledChat"
        @keydown.enter.exact.prevent="handleSendMessage"
        ref="inputRef"
      />
      <UiButton
        class=""
        variant="ghost"
        size="icon"
        :disabled="disabledChat"
        type="submit"
        @click="handleSendMessage"
      >
        <!-- <PaperPlaneIcon /> -->
        <ChatSendIcon />
      </UiButton>
    </UiCard>
  </main>
</template>
