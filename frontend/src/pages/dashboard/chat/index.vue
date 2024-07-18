<script setup lang="ts">
type Props = {};

const props = defineProps<Props>();
const useUserStore = useUser();
const { currentUser } = storeToRefs(useUserStore);
const {} = useUserStore;
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <main class="flex-1 flex flex-col gap-4 container p-4 rounded-2xl items-center">
      <div class="flex-1 flex flex-col w-full p-8" >
        <ChatMessage 
        :isCurrentUser="true"
        message="Hello, how can I help you today?"
        time="12:00 PM"
        user="John Doe"
        />
      </div>
      <UiCard class="shadow-lg py-2 px-8 w-full max-w-[800px] rounded-full" >
          <UiInput class="w-full border-none shadow-none focus-visible:ring-0 text-lg" />
      </UiCard>
    </main>
  </NuxtLayout>
</template>
