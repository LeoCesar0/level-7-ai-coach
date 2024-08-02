<script setup lang="ts">
import {
  ATHLETE_QUESTIONS,
  type IAthleteFormSection,
} from "@common/schemas/user/athleteInfo";
import type { FormContext } from "vee-validate";
import { beautifyObjectName } from "~/components/ui/auto-form/utils";

type Props = {
  section: IAthleteFormSection;
  form: FormContext;
};

const props = defineProps<Props>();

const fields = ATHLETE_QUESTIONS.filter(
  (item) => item.section === props.section
);

const getFieldPath = (key: string) => `athleteInfo.${key}.answer`;

const defaultSliderValue = [5];

fields.forEach((item) => {
  if (item.inputType === "slider") {
    props.form.setFieldValue(getFieldPath(item.key), defaultSliderValue);
  }
});

const sliderProps = {
  "default-value": defaultSliderValue,
  min: 1,
  max: 10,
  step: 1,
};
</script>

<template>
  <div class="space-y-8 animate-fade">
    <template v-if="section === 'personal'">
      <FormField :input-variant="'date'" name="birthDate" class="max-w-[300px]">
        <template v-slot:field-header>
          <div class="mb-4">
            <label
              class="text-2xl font-semibold inline-block"
              :for="`birthDate`"
              >Date of Birth</label
            >
          </div>
        </template>
      </FormField>
    </template>
    <div
      v-for="field of fields"
      :key="`${section}-${field.key}`"
      :class="{
        'max-w-[800px]': field.inputType === 'slider',
      }"
    >
      <FormField
        :input-variant="field.inputType === 'slider' ? 'slider' : 'textarea'"
        :rows="1"
        :name="getFieldPath(field.key)"
        :input-props="{
          ...(field.inputType === 'slider' ? sliderProps : {}),
        }"
      >
        <template v-slot:field-header>
          <div class="mb-8">
            <label
              class="text-2xl font-semibold inline-block mb-4"
              :for="`athleteInfo.${field.key}`"
              >{{ beautifyObjectName(field.key) }}</label
            >
            <p class="text-lg">{{ field.question }}</p>
          </div>
        </template>
      </FormField>
      <div
        v-if="field.inputType === 'slider'"
        class="mt-4 w-full flex items-center justify-between"
      >
        <span
          v-for="num in Array.from({
            length: sliderProps.max,
          }).map((_, index) => index + 1)"
          >{{ num }}</span
        >
      </div>
    </div>
  </div>
</template>
