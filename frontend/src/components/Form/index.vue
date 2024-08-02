<script setup lang="ts">
import { cn } from "~/lib/utils";

type Props = {
  onSubmit: () => Promise<any>;
  fullWidth?: boolean;
  class?: string;
};

const props = defineProps<Props>();
</script>

<template>
  <form
    :class="
      cn(
        'w-full space-y-6',
        {
          'w-full': !!fullWidth,
          'max-w-[600px]': !fullWidth,
        },
        props.class
      )
    "
    @submit="onSubmit"
  >
    <slot />
  </form>
</template>
