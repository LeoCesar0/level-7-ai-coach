<script setup lang="ts"></script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection title="Create User">
      <DashboardUserForm :edit="false" />
    </DashboardSection>
  </NuxtLayout>
</template>
