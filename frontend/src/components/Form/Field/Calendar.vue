<script setup lang="ts">
import { Field, type ComponentFieldBindingObject } from "vee-validate";
import { type ISelectOption } from "@/@schemas/select";
import { vAutoAnimate } from "@formkit/auto-animate";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { CalendarIcon } from "@radix-icons/vue";
import { cn } from "@lib/utils";
import { useForwardPropsEmits, type CalendarRootEmits } from "radix-vue";
import { stringToDate } from "@common/helpers/stringToDate";
import type { VCalendarProps } from "~/components/ui/v-calendar/Calendar.vue";

type Props = {
  disabled?: boolean;
} & VCalendarProps;

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);
const forward = useForwardPropsEmits(props, emit);
</script>

<template>
  <UiPopover>
    <UiPopoverTrigger as-child :disabled="disabled">
      <UiButton
        variant="outline"
        :class="
          cn(
            'w-full justify-start text-left font-normal',
            !modelValue && 'text-muted-foreground'
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ modelValue ? modelValue : "Pick a date" }}
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent class="w-auto p-0">
      <UiVCalendar v-bind="forward" />
    </UiPopoverContent>
  </UiPopover>
</template>
