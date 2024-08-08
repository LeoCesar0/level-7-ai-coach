<script setup lang="ts">
import type { IUserFull } from "@common/schemas/user/user";
import { API_ROUTE } from "@common/static/routes";
import { ROUTE } from "@static/routes";
import { getSingleParams } from "~/helpers/getSingleParams";

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const { fetchApi } = useFetchApi();

const id = getSingleParams("id");
const isLoading = ref(false);

const { status, data: userRes } = await useGetApi<IUserFull>({
  url: API_ROUTE.users.get.url(id),
  loadingRefs: [isLoading],
});
const user = computed(() => userRes.value?.data);
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection v-if="user" :title="`${user.name} assessments`">
      <template v-slot:actions-right>
        <NuxtLink :to="ROUTE.createOrganization.href">
          <UiButton>Something</UiButton>
        </NuxtLink>
      </template>
    </DashboardSection>
  </NuxtLayout>
</template>
