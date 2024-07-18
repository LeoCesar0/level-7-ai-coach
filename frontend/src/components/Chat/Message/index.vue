<script setup lang="ts">
type Props = {
  message: string;
  user: string;
  time: string;
  isCurrentUser: boolean;
};

const props = defineProps<Props>();
</script>

<template>
  <div class="flex gap-2 items-center">
    <div class="flex flex-col gap-2">
      <ChatMessageUser :userName="props.user" :date="props.time" />
      <div class="bg-muted p-2 rounded-md">
        <p class="text-sm text-muted-foreground">{{ props.message }}</p>
      </div>
    </div>
  </div>
</template>
