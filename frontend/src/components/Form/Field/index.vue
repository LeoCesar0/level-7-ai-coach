<script setup lang="ts">
import { Field } from "vee-validate";
import { type ISelectOption } from "@/@schemas/select";
import { vAutoAnimate } from "@formkit/auto-animate";
import { cn } from "@lib/utils";
import type { VCalendarProps } from "~/components/ui/v-calendar/Calendar.vue";

export type IFieldInputVariant =
  | "input"
  | "select"
  | "date"
  | "calendar"
  | "textarea"
  | "slider"
  | "checkbox"
  | "switch";

type Props = {
  name: string;
  label?: string;
  inputVariant?: IFieldInputVariant;
  inputProps?: Record<string, any>;
  placeholder?: string;
  description?: string;
  class?: string;
  selectOptions?: ISelectOption[];
  disabled?: boolean;
  calendarProps?: VCalendarProps;
  required?: boolean;
  greatDescription?: string;
};

const props = withDefaults(defineProps<Props>(), {
  inputVariant: "input",
  selectOptions: () => [],
  disabled: false,
});
const inLineComponents: IFieldInputVariant[] = ["checkbox", "switch"];
const isLineInput = inLineComponents.includes(props.inputVariant);
</script>

<template>
  <Field v-slot="{ componentField }" :name="name">
    <UiFormItem
      :class="
        cn([
          {
            'flex items-center gap-3': isLineInput,
          },
          props.class ?? '',
        ])
      "
      v-auto-animate
    >
      <UiFormLabel v-if="label" :required="required">{{ label }}</UiFormLabel>
      <slot name="field-header" />
      <div v-if="greatDescription">
        <p class="">{{ greatDescription }}</p>
      </div>
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
        <!-- TEXTAREA -->
        <UiTextarea
          v-if="inputVariant === 'textarea'"
          :placeholder="placeholder ?? ''"
          v-bind="{
            ...componentField,
            disabled,
            ...(props.inputProps ?? {}),
          }"
          :rows="5"
        />
        <!-- SLIDER -->
        <UiSlider
          v-if="inputVariant === 'slider'"
          :placeholder="placeholder ?? ''"
          v-bind="{
            ...componentField,
            disabled,
            ...(props.inputProps ?? {}),
          }"
        />
        <!-- CHECKBOX -->
        <UiCheckbox
          v-if="inputVariant === 'checkbox'"
          class="!mt-0"
          v-bind="{
            ...componentField,
            disabled,
            ...(props.inputProps ?? {}),
          }"
          :checked="componentField.modelValue"
          @update:checked="componentField['onUpdate:modelValue']"
        />
        <!-- SWITCH -->
        <UiSwitch
          v-if="inputVariant === 'switch'"
          class="!mt-0"
          v-bind="{
            ...componentField,
            disabled,
            ...(props.inputProps ?? {}),
          }"
          :checked="componentField.modelValue"
          @update:checked="componentField['onUpdate:modelValue']"
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
