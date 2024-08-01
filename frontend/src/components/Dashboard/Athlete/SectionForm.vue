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
  <div class="space-y-4">
    <FormField
      v-for="field of fields"
      :name="`athleteInfo.${field.key}`"
      :label="beautifyObjectName(field.key)"
    />
  </div>
</template>
