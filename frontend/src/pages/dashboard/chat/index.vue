<script setup lang="ts">
import { PaperPlaneIcon } from "@radix-icons/vue";
type Props = {};

const props = defineProps<Props>();
const useUserStore = useUser();
const { currentUser } = storeToRefs(useUserStore);
const {} = useUserStore;

const currentPrompt = ref<string>("");
const charactersPerRow = 70;

const nRows = computed(() => {
  const rows = Math.ceil(currentPrompt.value.length / charactersPerRow);
  return Math.max(1, rows);
});
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <main
      class="flex-1 flex flex-col gap-4 container p-4 rounded-2xl items-center"
    >
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
        />
        <UiButton class="" variant="ghost" size="icon">
          <!-- <PaperPlaneIcon /> -->
          <ChatSendIcon />
        </UiButton>
      </UiCard>
    </main>
  </NuxtLayout>
</template>
