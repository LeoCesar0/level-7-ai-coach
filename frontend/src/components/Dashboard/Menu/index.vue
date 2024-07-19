<script setup lang="ts">
import { ROUTES_LIST } from "~/static/routes";
import { ROUTE, type IRoute } from "~/static/routes";
import { cn } from "~/lib/utils";
import { APP_CONFIG } from "~/static/app";
import {} from "@radix-icons/vue";
import Logout from "../../icons/Logout.vue";

const dashboardStore = useDashboardStore();
const { menuIsOpen } = storeToRefs(dashboardStore);

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
const { logout } = userStore;

const routes = computed<IRoute[]>(() => {
  if (!currentUser.value) return [];
  const list = ROUTES_LIST.filter((route) => {
    return route.inMenuFor && route.inMenuFor.includes(currentUser.value!.role);
  });
  return list;
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
    <header class="mb-8 py-4 px-4 space-y-4">
      <NuxtLink :to="ROUTE.dashboard.href">
        <span class="flex items-center gap-4 transition-colors py-4">
          <Logo class="text-primary" />
          <span class="text-2xl tracking-wide font-bold">{{
            APP_CONFIG.title
          }}</span>
        </span>
      </NuxtLink>
      <div className="">
        <h3 class="text-base">
          Hello,
          <span class="font-semibold text-xl">{{ currentUser?.name }}</span> 👋
        </h3>
      </div>
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
          :isLast="true"
          :action="
            () => {
              logout();
            }
          "
        />
      </div>
    </ul>
  </nav>
</template>

<style lang="scss" scoped></style>
