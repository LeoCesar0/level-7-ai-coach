<script setup lang="ts">
import { type IChatHistoryMessage } from "@common/schemas/chatHistory";
import { cn } from "../../../lib/utils";
const userStore = useUserStore();

const { currentUser } = storeToRefs(userStore);

type Props = {
  message: IChatHistoryMessage;
};

const props = defineProps<Props>();

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
      <ChatMessageUser :userName="userName" :date="''" />
      <div class="bg-muted p-2 rounded-md">
        <p class="text-sm text-muted-foreground">
          {{ props.message.message }}
        </p>
      </div>
    </div>
  </div>
</template>
