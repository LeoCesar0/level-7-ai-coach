<script setup lang="ts">
import { Field } from "vee-validate";
import { type ISelectOption } from "@/@schemas/select";
import { vAutoAnimate } from "@formkit/auto-animate";
import {
  DateFormatter,
  getLocalTimeZone,
  parseDate,
} from "@internationalized/date";
import { CalendarIcon } from "@radix-icons/vue";
import { cn } from "@lib/utils";
import type { VCalendarProps } from "~/components/ui/v-calendar/Calendar.vue";

type Props = {
  name: string;
  label: string;
  inputVariant?: "input" | "select" | "date" | "calendar";
  inputProps?: Record<string, any>;
  placeholder?: string;
  description?: string;
  class?: string;
  selectOptions?: ISelectOption[];
  disabled?: boolean;
  calendarProps?: VCalendarProps;
};

const props = withDefaults(defineProps<Props>(), {
  inputVariant: "input",
  selectOptions: () => [],
  disabled: false,
});
</script>

<template>
  <Field v-slot="{ componentField }" :name="name">
    <UiFormItem :class="cn(props.class ?? '')" v-auto-animate>
      <UiFormLabel>{{ label }}</UiFormLabel>
      <UiFormControl>
        <!-- INPUT -->
        <UiInput
          v-if="inputVariant === 'input'"
          :placeholder="placeholder ?? ''"
          v-bind="{
            ...componentField,
            disabled,
            ...(props.inputProps ?? {}),
          }"
        />
        <!-- SELECT -->
        <UiSelect
          v-if="inputVariant === 'select'"
          v-bind="{
            ...componentField,
            disabled,
            ...(props.inputProps ?? {}),
          }"
        >
          <UiSelectTrigger class="w-full">
            <UiSelectValue :placeholder="placeholder ?? ''" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem
              v-for="option in selectOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>
        <!-- DATE -->
        <div v-if="inputVariant === 'date'">
          <FormFieldCalendar
            v-bind="{
              ...componentField,
              disabled,
              ...(props.inputProps ?? {}),
              ...(props.calendarProps ?? {}),
            }"
          />
        </div>
        <!-- CALENDAR -->
        <div v-if="inputVariant === 'calendar'">
          <UiVCalendar
            v-bind="{
              ...componentField,
              disabled,
              ...(props.inputProps ?? {}),
              ...(props.calendarProps ?? {}),
            }"
          />
          />
        </div>
      </UiFormControl>
      <UiFormDescription v-if="description">{{
        description
      }}</UiFormDescription>
      <UiFormMessage />
    </UiFormItem>
  </Field>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
}
</style>
