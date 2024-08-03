<script setup lang="ts">
import { beautifyObjectName } from "~/components/ui/auto-form/utils";

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const roleLabel = computed(() => {
  const role =
    currentUser.value?.role === "user" ? "athlete" : currentUser.value?.role;
  return beautifyObjectName(role ?? "");
});
</script>

<template>
  <div class="flex items-center gap-4">
    <div
      class="h-12 w-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground"
    >
      {{ currentUser?.name ? currentUser?.name.slice(0, 1) : "" }}
    </div>
    <div class="flex flex-col font-medium">
      <p>{{ currentUser?.name }}</p>
      <p class="text-muted-foreground text-sm">{{ roleLabel }}</p>
    </div>
  </div>
</template>
