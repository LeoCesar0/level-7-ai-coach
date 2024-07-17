<script setup lang="ts">
type Props = {};

const props = defineProps<Props>();
const useUserStore = useUser();
const { currentUser } = storeToRefs(useUserStore);
const {} = useUserStore;
</script>

<template>
  <NuxtLayout name="dashboard-layout" >
    <div class="container">
      <h1>DASHBOARD</h1>
      <p>currentUser: {{ currentUser?.name }}</p>
      <NuxtLink to="/sign-in">
        <UiButton> To sign in </UiButton>
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
}
</style>
