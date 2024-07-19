<script setup lang="ts">
import { type IChatHistoryMessage } from "@common/schemas/chatHistory";
const userStore = useUserStore();

const { currentUser } = storeToRefs(userStore);

type Props = {
  message: IChatHistoryMessage;
};

const props = defineProps<Props>();

const userName = props.message.role === 'assistant' ? 'AI Coach' : currentUser.value?.name ?? ''

</script>

<template>
  <div class="flex gap-2 items-center">
    <div class="flex flex-col gap-2">
      <ChatMessageUser :userName="userName" :date="''" />
      <div class="bg-muted p-2 rounded-md">
        <p class="text-sm text-muted-foreground">{{ props.message.message }}</p>
      </div>
    </div>
  </div>
</template>
