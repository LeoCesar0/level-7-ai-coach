<script setup lang="ts">
import { ROUTES_LIST } from "~/static/routes";
import { ROUTE, type IRoute } from "~/static/routes";
import { cn } from "~/lib/utils";
import { APP_CONFIG } from "~/static/app";
import {} from "@radix-icons/vue";
import Logout from "../icons/Logout.vue";

const dashboardStore = useDashboardStore();
const { menuIsOpen } = storeToRefs(dashboardStore);

const userStore = useUser();
const { currentUser } = storeToRefs(userStore);

const routes = computed<IRoute[]>(() => {
  if (!currentUser.value) return [];
  return ROUTES_LIST.filter((route) => {
    return route.inMenuFor && route.inMenuFor.includes(currentUser.value!.role);
  });
});
</script>

<template>
  <nav
    :class="
      cn([
        'w-[var(--drawer-width)] shadow-lg transition-transform duration-300',
        'fixed top-0 left-0 h-screen flex flex-col',
        'bg-card text-card-foreground',
        { '-translate-x-full': !menuIsOpen },
      ])
    "
  >
    <header class="mb-8 py-4">
      <NuxtLink :to="ROUTE.dashboard.href">
        <span
          class="flex items-center gap-4 accent-hover transition-colors p-4"
        >
          <Logo />
          <span>{{ APP_CONFIG.title }}</span>
        </span>
      </NuxtLink>
    </header>
    <ul class="flex flex-col flex-1 pb-4">
      <template v-for="route in routes" :key="route.href">
        <NuxtLink :to="route.href">
          <DashboardMenuItem :route="route" />
        </NuxtLink>
      </template>
      <div class="mt-auto">
        <DashboardMenuItem
          :route="{
            href: '',
            label: 'Logout',
            icon: Logout,
          }"
        />
      </div>
    </ul>
  </nav>
</template>

<style lang="scss" scoped></style>
