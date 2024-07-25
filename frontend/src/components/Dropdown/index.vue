<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { defineProps } from "vue";
import type { IDropdownItem } from "~/@schemas/dropdown";
import { DotsHorizontalIcon } from "@radix-icons/vue";
import { cn } from "~/lib/utils";

type Props = {
  items: IDropdownItem[]; // Array of items for the dropdown menu
  trigger?: "dots";
};

// Get props
const props = defineProps<Props>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <UiButton size="icon" variant="ghost">
        <component
          v-if="trigger === 'dots'"
          :is="DotsHorizontalIcon"
          class="h-5 w-5"
        />
        <slot />
      </UiButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="bottom">
      <template v-for="(item, index) in props.items" :key="index">
        <DropdownMenuSeparator v-if="item.label === 'separator'" />
        <DropdownMenuGroup v-else-if="item.items && !item.icon">
          <template v-for="subItem in item.items" :key="subItem.label">
            <DropdownMenuItem
              v-if="!subItem.items"
              :disabled="subItem.disabled"
              @click="subItem.action"
              :class="
                cn({
                  'cursor-not-allowed': subItem.disabled,
                  'danger-color': subItem.variant === 'danger',
                })
              "
            >
              <component
                :is="subItem.icon"
                class="mr-2 h-4 w-4"
                v-if="subItem.icon"
              />
              <span>{{ subItem.label }}</span>
              <DropdownMenuShortcut v-if="subItem.shortcut">{{
                subItem.shortcut
              }}</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuSub v-else-if="subItem.items">
              <DropdownMenuSubTrigger>
                <component
                  :is="subItem.icon"
                  class="mr-2 h-4 w-4"
                  v-if="subItem.icon"
                />
                <span>{{ subItem.label }}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <template
                    v-for="nestedItem in subItem.items"
                    :key="nestedItem.label"
                  >
                    <DropdownMenuItem
                      :disabled="nestedItem.disabled"
                      @click="nestedItem.action"
                      :class="
                        cn({
                          'cursor-not-allowed': nestedItem.disabled,
                          'danger-color': nestedItem.variant === 'danger',
                        })
                      "
                    >
                      <component
                        :is="nestedItem.icon"
                        class="mr-2 h-4 w-4"
                        v-if="nestedItem.icon"
                      />
                      <span>{{ nestedItem.label }}</span>
                      <DropdownMenuShortcut v-if="nestedItem.shortcut">{{
                        nestedItem.shortcut
                      }}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </template>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </template>
        </DropdownMenuGroup>
        <DropdownMenuItem
          v-else
          :disabled="item.disabled"
          @click="item.action"
          :class="
            cn({
              'cursor-not-allowed': item.disabled,
              'danger-color': item.variant === 'danger',
            })
          "
        >
          <component :is="item.icon" class="mr-2 h-4 w-4" v-if="item.icon" />
          <span>{{ item.label }}</span>
          <DropdownMenuShortcut v-if="item.shortcut">{{
            item.shortcut
          }}</DropdownMenuShortcut>
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
