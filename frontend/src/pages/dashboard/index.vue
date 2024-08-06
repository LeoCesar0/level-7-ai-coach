<script setup lang="ts">
import { type ICreateArchetype } from "@common/schemas/archetype/createArchetype";
type Props = {};

const props = defineProps<Props>();
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
const {} = useUserStore;
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <HomeDetails />
    <div class="container flex-1 grid items-center">
      <div class="text-center">
        <span class="flex items-center justify-center gap-4 mb-4">
          <Logo class="text-primary" />
          <h1 class="text-4xl">Hello {{ currentUser?.name }}</h1>
        </span>
        <p class="text-muted-foreground">We're happy to see you again!</p>
      </div>
    </div>
  </NuxtLayout>
</template>
