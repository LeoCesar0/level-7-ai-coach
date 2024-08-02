<script setup lang="ts">
import {
  ATHLETE_QUESTIONS,
  type IAthleteFormSection,
} from "@common/schemas/user/athleteInfo";
import { beautifyObjectName } from "~/components/ui/auto-form/utils";

type Props = {
  section: IAthleteFormSection;
};

const props = defineProps<Props>();

const fields = ATHLETE_QUESTIONS.filter(
  (item) => item.section === props.section
);
</script>

<template>
  <div class="space-y-8 animate-fade ">
    <FormField
      v-for="field of fields"
      :input-variant="'textarea'"
      :rows="1"
      :name="`athleteInfo.${field.key}.answer`"
    >
      ]<template v-slot:field-header>
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
  </div>
</template>
