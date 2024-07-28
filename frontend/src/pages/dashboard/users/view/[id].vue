<script setup lang="ts">
import { verifyRoutePermission } from "@common/helpers/verifyRoutePermission";
import type { IUserFull } from "@common/schemas/user/user";
import { PERMISSION } from "@common/static/permissions";
import { API_ROUTE } from "@common/static/routes";
import { formatDate } from "~/helpers/formatDate";
import { getSingleParams } from "~/helpers/getSingleParams";
import { getYearsOld } from "~/helpers/getYearsOld";
import { ROUTE } from "~/static/routes";

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const id = getSingleParams("id");

const isLoading = ref(false);

if (!id) {
  await navigateTo(ROUTE.users.href);
}

const { status, data } = await useGetApi<IUserFull>({
  url: API_ROUTE.users.get.url(id),
  loadingRefs: [isLoading],
});

const user = computed(() => data.value?.data);

const canEdit = computed(() => {
  return verifyRoutePermission({
    item: user,
    routePermissions: PERMISSION.organizations,
    user: currentUser.value,
    action: "update",
  });
});
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection :title="`Viewing ${user?.name ?? ''}`">
      <template v-slot:actions-right>
        <NuxtLink v-if="canEdit" :to="`${ROUTE.editUser.href}/${id}`">
          <UiButton>Edit User</UiButton>
        </NuxtLink>
      </template>
      <UiCard class="max-w-4xl mx-auto p-8 mt-8 card-container" v-if="user">
        <div class="flex items-center mb-8">
          <img
            v-if="user.imageUrl"
            :src="user.imageUrl"
            alt="User Image"
            class="w-24 h-24 rounded-full mr-6"
          />
          <div>
            <h1 class="text-2xl font-bold">{{ user.name }}</h1>
            <p><strong>Email </strong>{{ user.email }}</p>
            <p><strong>Role </strong>{{ user.role }}</p>
            <p><strong>Active </strong>{{ user.active ? "Yes" : "No" }}</p>
            <p>
              <strong>Organization/Team </strong> {{ user.organization.name }}
            </p>
            <p><strong>Phone code</strong> {{ user.phoneCode }}</p>
            <p><strong>Phone </strong> {{ user.phone }}</p>
            <p>
              <strong>Birth Date </strong>
              {{
                user.birthDate
                  ? `${formatDate(user.birthDate)} (${getYearsOld(
                      user.birthDate
                    )} year old)`
                  : ""
              }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-if="user.archetype && user.role === 'user'">
            <h2 class="font-semibold text-lg">Archetype</h2>
            <NuxtLink
              ><p>{{ user.archetype.name }}</p></NuxtLink
            >
            <p class="text-sm mt-2">{{ user.archetype.description }}</p>
          </div>
          <div v-if="user.address">
            <h2 class="font-semibold text-lg">Address</h2>
            <p>{{ user.address.address }}</p>
            <p>
              {{ user.address.city }}, {{ user.address.state }},
              {{ user.address.country }}
            </p>
          </div>
          <div v-if="user.athleteInfo">
            <h2 class="font-semibold text-lg">Athlete Info</h2>
          </div>
        </div>
      </UiCard>
    </DashboardSection>
  </NuxtLayout>
</template>

<style lang="scss">
.card-container {
  p {
    @apply text-muted-foreground;
  }
}
</style>
