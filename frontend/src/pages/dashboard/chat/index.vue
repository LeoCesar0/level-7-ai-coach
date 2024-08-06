<script setup lang="ts">
import { ROUTE } from "../../../static/routes";
import { parseToDate } from "@common/helpers/parseToDate";
import { type IChat } from "@common/schemas/chat/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    navigateTo(ROUTE.chats.href + `/${openChat.value._id}`);
  }
};
const handleCreateNewChat = async () => {
  const response = await createNewChat();
  if (response.data) {
    navigateTo(ROUTE.chats.href + `/${response.data._id}`);
  }
};

const getChatTitle = (chat: IChat) => {
  const date = parseToDate(chat.date);
  return `Chat ${date.toLocaleString()}`;
};
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <section class="container flex-1 grid items-center">
      <div>
        <div class="text-center mb-14">
          <span class="flex items-center justify-center gap-4 mb-4">
            <Logo class="text-primary" />
            <h1 class="text-4xl">Level 7</h1>
          </span>
          <p class="text-muted-foreground">We're happy to see you again!</p>
        </div>
        <main class="flex items-stretch justify-center gap-8">
          <ChatCard
            @click="handleCreateNewChat"
            v-if="!openChat"
            title="New Chat"
            description="Start a new conversation with your coach"
          >
            <template v-slot:icon>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.23077 0C4.19723 0 0 3.46154 0 7.84615C0 10.0892 1.22769 12.0443 2.97138 13.4714C2.85879 14.2297 2.55051 14.9455 2.07692 15.5483C1.88365 15.7957 1.68168 16.0361 1.47138 16.2692C1.36252 16.384 1.26571 16.5095 1.18246 16.644C1.12985 16.7298 1.04769 16.8258 1.00985 17.0197C0.971077 17.2126 1.02369 17.5302 1.18246 17.7692L1.29785 17.9714L1.52862 18.0868C2.33631 18.4902 3.20862 18.4191 4.00985 18.2022C4.81015 17.9843 5.58 17.6114 6.31754 17.2209C7.05415 16.8314 7.75477 16.4234 8.30769 16.1252C8.38523 16.0837 8.43508 16.0735 8.50985 16.0385C9.96554 18.0397 12.6314 19.3846 15.6055 19.3846C15.6342 19.3883 15.6609 19.3846 15.6923 19.3846C16.8923 19.3846 20.7692 23.3483 23.0769 21.7791C23.1692 21.4108 21.048 20.4868 20.9418 17.7406C22.7483 16.464 23.9142 14.5652 23.9142 12.4615C23.9142 9.34892 21.444 6.77723 18.1449 5.856C17.1009 2.45908 13.4714 0 9.23077 0ZM9.23077 1.84615C13.428 1.84615 16.6154 4.66154 16.6154 7.84615C16.6154 11.0308 13.428 13.8462 9.23077 13.8462C8.48123 13.8462 8.05108 14.1526 7.44185 14.4812C6.83262 14.8089 6.13385 15.216 5.45169 15.5769C4.86092 15.8889 4.29785 16.1289 3.77908 16.2978C4.284 15.5686 4.81108 14.6095 4.90338 13.2692L4.93292 12.7495L4.5 12.4329C2.85508 11.28 1.84615 9.62123 1.84615 7.84615C1.84615 4.66154 5.03354 1.84615 9.23077 1.84615Z"
                  fill="#4880FF"
                />
              </svg>
            </template>
          </ChatCard>
          <ChatCard
            @click="continueChat"
            v-if="openChat"
            title="Resume Chat"
            description="Continue where you left off in your conversation"
          >
            <template v-slot:icon>
              <svg
                width="23"
                height="24"
                viewBox="0 0 23 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 9.05899V6.49999C11.4997 6.30237 11.4434 6.10926 11.3381 5.94501C11.2328 5.78075 11.0832 5.6527 10.9083 5.57699C10.7333 5.50127 10.5408 5.48129 10.355 5.51955C10.1692 5.55781 9.99843 5.65261 9.86417 5.79199L3.83337 12L9.86417 18.207C9.95296 18.3002 10.0585 18.3741 10.1748 18.4246C10.2911 18.475 10.4158 18.501 10.5417 18.501C10.6676 18.501 10.7923 18.475 10.9086 18.4246C11.0249 18.3741 11.1305 18.3002 11.2192 18.207C11.3083 18.1142 11.3789 18.004 11.4271 17.8827C11.4753 17.7613 11.5001 17.6313 11.5 17.5V15.011C14.1355 15.079 17.0152 15.577 19.1667 19V18C19.1667 13.367 15.8125 9.55699 11.5 9.05899Z"
                  fill="#E25E00"
                />
              </svg>
            </template>
          </ChatCard>
          <Sheet>
            <SheetTrigger as-child>
              <ChatCard
                title="History"
                description="View old conversation histories"
              >
                <template v-slot:icon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.80005 4.80002C4.80005 4.1635 5.05291 3.55306 5.50299 3.10297C5.95308 2.65288 6.56353 2.40002 7.20005 2.40002H12.7032C13.3397 2.40016 13.9501 2.65311 14.4 3.10322L18.4968 7.20002C18.947 7.65001 19.1999 8.26036 19.2 8.89682V19.2C19.2 19.8365 18.9472 20.447 18.4971 20.8971C18.047 21.3472 17.4366 21.6 16.8 21.6H7.20005C6.56353 21.6 5.95308 21.3472 5.50299 20.8971C5.05291 20.447 4.80005 19.8365 4.80005 19.2V4.80002Z"
                      fill="#FFBB3E"
                    />
                  </svg>
                </template>
              </ChatCard>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Chats History</SheetTitle>
              </SheetHeader>
              <div class="grid gap-4 py-8">
                <div class="flex items-center gap-4 flex-wrap">
                  <UiCard
                    v-for="(chat, index) in closedChats"
                    @click="navigateTo(ROUTE.chats.href + `/${chat._id}`)"
                    class="p-4 cursor-pointer hover:bg-accent transition-colors"
                  >
                    {{ getChatTitle(chat) }}
                  </UiCard>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </main>
      </div>
    </section>

    <!-- <main class="flex container flex-col flex-1 justify-center gap-6">
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
          @click="navigateTo(ROUTE.chats.href + `/${chat._id}`)"
          :title="getChatTitle(chat)"
        />
      </div>
    </main> -->
  </NuxtLayout>
</template>
