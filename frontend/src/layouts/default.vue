<script setup lang="ts">
import { useDarkModeStore } from "../composables/useDarkModeStore";

const darkModeStore = useDarkModeStore();
</script>

<template>
  <div class="min-h-screen flex flex-col relative">
    <slot />
    <GlobalAlertDialog />
  </div>
</template>
