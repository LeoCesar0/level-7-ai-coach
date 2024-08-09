<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { beautifyObjectName } from "../auto-form/utils";

defineProps<{
  title?: string;
  data: {
    name: string;
    color: string;
    value: any;
  }[];
}>();
</script>

<template>
  <Card class="text-sm">
    <CardHeader v-if="title" class="p-3 border-b">
      <CardTitle>
        {{ title }}
      </CardTitle>
    </CardHeader>
    <CardContent class="p-3 min-w-[180px] max-w-[50vw] flex flex-col gap-1">
      <div
        v-for="(item, key) in data"
        :key="key"
        class="flex justify-start items-center"
      >
        <div class="flex items-center">
          <span class="w-2.5 h-2.5 mr-2">
            <svg width="100%" height="100%" viewBox="0 0 30 30">
              <path
                d=" M 15 15 m -14, 0 a 14,14 0 1,1 28,0 a 14,14 0 1,1 -28,0"
                :stroke="item.color || 'hsl(var(--muted-foreground)/1)'"
                :fill="item.color || 'hsl(var(--muted-foreground)/1)'"
                stroke-width="1"
              />
            </svg>
          </span>
        </div>
        <p class="font-semibold ml-4" v-if="item.name">
          {{ beautifyObjectName(item.name || "") }}
          {{ " "
          }}<span class="font-regular text-muted-foreground">{{
            item.value
          }}</span>
        </p>
        <p class="font-semibold ml-4" v-else>
          {{
            `${
              item.value.split(":")[0]
                ? `${beautifyObjectName(item.value.split(":")[0] || "")}:`
                : ""
            }`
          }}
          {{ " "
          }}<span class="font-regular text-muted-foreground">{{
            item.value.split(":")[1] ?? item.value
          }}</span>
        </p>
      </div>
    </CardContent>
  </Card>
</template>
