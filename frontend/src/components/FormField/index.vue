<script setup lang="ts">
import { Field } from "vee-validate";
import { cn } from "../../lib/utils";
import { type ISelectOption } from "../../@schemas/select";
import { vAutoAnimate } from "@formkit/auto-animate";

type Props = {
  name: string;
  label: string;
  inputVariant?: "input" | "select";
  inputProps?: Record<string, any>;
  placeholder?: string;
  description?: string;
  class?: string;
  selectOptions?: ISelectOption[];
};

const props = withDefaults(defineProps<Props>(), {
  inputVariant: "input",
  selectOptions: () => [],
});
</script>

<template>
  <Field v-slot="{ componentField }" :name="name">
    <UiFormItem :class="cn(props.class ?? '')" v-auto-animate>
      <UiFormLabel>{{ label }}</UiFormLabel>
      <UiFormControl>
        <UiInput
          v-if="inputVariant === 'input'"
          :placeholder="placeholder ?? ''"
          v-bind="{
            ...componentField,
            ...(props.inputProps ?? {}),
          }"
        />
        <UiSelect
          v-if="inputVariant === 'select'"
          v-bind="{
            ...componentField,
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
