<script setup lang="ts">
import { verifyMutatePermission } from "@common/helpers/verifyMutatePermission";
import { verifyRoutePermission } from "@common/helpers/verifyRoutePermission";
import type { IOrganization } from "@common/schemas/organization/organization";
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
  await navigateTo(ROUTE.organizations.href);
}

const { status, data } = await useGetApi<IOrganization>({
  url: API_ROUTE.organizations.get.url(id),
  loadingRefs: [isLoading],
});

const item = computed(() => data.value?.data);

const canEdit = computed(() => {
  return verifyMutatePermission({
    item,
    permissions:API_ROUTE.organizations['update'].permissions,
    user: currentUser.value,
  });
});
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection :title="`Viewing ${item?.name ?? ''}`">
      <template v-slot:actions-right>
        <NuxtLink v-if="canEdit" :to="`${ROUTE.editOrganization.href}/${id}`">
          <UiButton>Edit Team/Organization</UiButton>
        </NuxtLink>
      </template>
      <UiCard class="max-w-4xl mx-auto p-8 mt-8 card-container" v-if="item">
        <div class="flex items-center mb-8">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            alt="Team Image"
            class="w-24 h-24 rounded-full mr-6"
          />
          <div>
            <h1 class="text-2xl font-bold">{{ item.name }}</h1>
            <p v-if="item.adminOrganization">
              <strong>Admin Organization </strong>Yes
            </p>
            <p><strong>Active </strong>{{ item.active ? "Yes" : "No" }}</p>
            <p>
              <strong>Created at </strong>
              {{ item.createdAt ? `${formatDate(item.createdAt)}` : "" }}
            </p>
            <p>
              <strong>Updated at </strong>
              {{ item.updatedAt ? `${formatDate(item.updatedAt)}` : "" }}
            </p>
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
