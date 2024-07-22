<script setup lang="ts">
import { cn } from "@/lib/utils";
import { type IRole } from "@common/schemas/roles";
import { ROLE_COLORS } from "@static/colors";
type Props = {
  role: IRole;
};

const props = defineProps<Props>();

const color = ROLE_COLORS[props.role] ?? "";
</script>

<template>
  <div class="flex items-center flex-start gap-2">
    <div
      class="w-4 h-4 rounded-full"
      :class="cn({ [`bg-${color}`]: true })"
    ></div>
    <span class="capitalize">{{ role ?? "" }}</span>
  </div>
</template>
