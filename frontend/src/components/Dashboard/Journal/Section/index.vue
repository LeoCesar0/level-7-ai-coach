<script setup lang="ts">
import { ROUTE } from "@static/routes";
import { getCurrentRoute } from "~/helpers/routing/getCurrentRoute";
const route = useRoute();
const router = useRouter();

type Props = {
  title: string;
  draft?: boolean;
};

const props = defineProps<Props>();

const goBackLink = computed(() => {
  const page = getCurrentRoute();
  const backsToPage = page?.backsTo ? ROUTE[page.backsTo] : undefined;
  return backsToPage?.href ?? "";
});
</script>

<template>
  <div class="container">
    <header class="border-border border-b pb-8 mb-8">
      <div v-if="goBackLink" class="flex items-center mb-2">
        <NuxtLink :to="goBackLink" class="flex items-end gap-2 py-2">
          <IconsGoBack />
          <span class="text-sm leading-none">Back</span>
        </NuxtLink>
      </div>
      <div class="flex justify-between items-center gap-4">
        <div class="flex items-center gap-6">
          <p class="font-medium">
            <span class="text-muted-foreground">Note /</span> {{ title
            }}<span v-if="draft" class="text-yellow-600"> (draft)</span>
          </p>
          <div class="flex items-center gap-4">
            <slot name="actions-left" />
          </div>
        </div>
        <div class="flex items-center gap-8">
          <slot name="actions-right" />
        </div>
      </div>
      <div class="mt-12">
        <slot name="title-input" />
        <!-- <h2 class="font-medium text-2xl">{{ title }}</h2> -->
      </div>
    </header>
    <div class="space-y-6">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
