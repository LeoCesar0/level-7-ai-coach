<script setup lang="ts">
import { cn } from "@/lib/utils";
import { type IRole } from "@common/schemas/roles";
import { ROLE_COLORS } from "@static/colors";
type Props = {
  role: IRole;
};

const props = defineProps<Props>();

const color = computed(() => {
  const c = ROLE_COLORS[props.role] ?? "";
  return c;
});
</script>

<template>
  <div class="flex items-center flex-start gap-2">
    <div
      :class="cn('w-4 h-4 rounded-full')"
      :style="{ backgroundColor: color }"
    ></div>
    <span class="capitalize">{{ role ?? "" }}</span>
  </div>
</template>
