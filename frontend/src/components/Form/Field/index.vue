<script setup lang="ts">
import { Field } from "vee-validate";
import { type ISelectOption } from "@/@schemas/select";
import { vAutoAnimate } from "@formkit/auto-animate";
import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { CalendarIcon } from "@radix-icons/vue";
import { cn } from '@lib/utils';

type Props = {
  name: string;
  label: string;
  inputVariant?: "input" | "select" | "date";
  inputProps?: Record<string, any>;
  placeholder?: string;
  description?: string;
  class?: string;
  selectOptions?: ISelectOption[];
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  inputVariant: "input",
  selectOptions: () => [],
  disabled: false,
});

const dateFormatter = new DateFormatter("en-US", {
  dateStyle: "long",
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
          <UiPopover>
            <UiPopoverTrigger as-child :disabled="disabled">
              <UiButton
                variant="outline"
                :class="
                  cn(
                    'w-full justify-start text-left font-normal',
                    !componentField.modelValue && 'text-muted-foreground'
                  )
                "
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{
                  componentField.modelValue
                    ? dateFormatter.format(
                        componentField.modelValue.toDate(getLocalTimeZone())
                      )
                    : "Pick a date"
                }}
              </UiButton>
            </UiPopoverTrigger>
            <UiPopoverContent class="w-auto p-0">
              <UiCalendar initial-focus v-bind="componentField" />
            </UiPopoverContent>
          </UiPopover>
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
