<script setup lang="ts">
import { ROUTE } from "~/static/routes";

let num: number = 2;
</script>

<template>
  <NuxtLayout name="home-layout">
    <div class="mb-16 relative">
      <h1 class="animate-fade-up text-5xl mb-6">Welcome to</h1>
      <div class="animate-fade-up delay-75 flex items-center pl-6 gap-1">
        <Logo :size="40" />
        <h1 class="text-5xl">Level 7 AI</h1>
      </div>
      <div class="absolute bottom-[calc(-100%-64px)]">
        <NuxtLink :to="ROUTE['sign-in'].href">
          <div class="animate-fade-right animate-once">
            <HomeArrow />
          </div>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped></style>
