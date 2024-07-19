<script setup lang="ts">
import { type IChatHistoryMessage } from "@common/schemas/chatHistory";
import { cn } from "@lib/utils";
import { parse } from "marked";
const userStore = useUserStore();

const { currentUser } = storeToRefs(userStore);

type Props = {
  message: IChatHistoryMessage;
  isTyping?: boolean;
};

const props = defineProps<Props>();

let htmlMessage = ref("");
try {
  htmlMessage.value = await parse(props.message.message);
} catch (err) {
  htmlMessage.value = props.message.message;
}

const isHuman = props.message.role === "human";
const userName = isHuman ? currentUser.value?.name ?? "" : "AI Coach";
</script>

<template>
  <div
    class="flex gap-2 items-center"
    :class="
      cn({
        'justify-end': isHuman,
        'justify-start': !isHuman,
      })
    "
  >
    <div :class="cn('flex flex-col gap-2')">
      <ChatMessageUser :userName="userName" :date="''" :right="isHuman" />
      <div class="bg-muted p-2 rounded-md">
        <p
          v-if="!isTyping"
          class="text-sm text-muted-foreground"
          v-html="htmlMessage"
        />
        <!-- {{ props.message.message }} -->
        <div v-else class="flex gap-2 items-center">
          <div
            class="w-3 h-3 bg-muted-foreground rounded-full animate-bounce"
          ></div>
          <div
            class="w-3 h-3 bg-muted-foreground rounded-full animate-bounce animate-delay-150"
          ></div>
          <div
            class="w-3 h-3 bg-muted-foreground rounded-full animate-bounce animate-delay-300"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
