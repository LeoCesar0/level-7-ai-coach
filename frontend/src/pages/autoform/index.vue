<script setup lang="ts">
import * as z from "zod";
import { h } from "vue";

enum Sports {
  Football = "Football/Soccer",
  Basketball = "Basketball",
  Baseball = "Baseball",
  Hockey = "Hockey (Ice)",
  None = "I don't like sports",
}

const schema = z.object({
  username: z
    .string({
      required_error: "Username is required.",
    })
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),

  password: z
    .string({
      required_error: "Password is required.",
    })
    .min(8, {
      message: "Password must be at least 8 characters.",
    }),

  favouriteNumber: z.coerce
    .number({
      invalid_type_error: "Favourite number must be a number.",
    })
    .min(1, {
      message: "Favourite number must be at least 1.",
    })
    .max(10, {
      message: "Favourite number must be at most 10.",
    })
    .default(1)
    .optional(),

  acceptTerms: z.boolean().refine((value) => value, {
    message: "You must accept the terms and conditions.",
    path: ["acceptTerms"],
  }),

  sendMeMails: z.boolean().optional(),

  birthday: z.coerce.date().optional(),

  color: z.enum(["red", "green", "blue"]).optional(),

  // Another enum example
  marshmallows: z.enum(["not many", "a few", "a lot", "too many"]),

  // Native enum example
  sports: z.nativeEnum(Sports).describe("What is your favourite sport?"),

  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    })
    .optional(),

  customParent: z.string().optional(),

  file: z.string().optional(),
});

function onSubmit(values: Record<string, any>) {}
</script>

<template>
  <UiAutoForm
    class="w-2/3 space-y-6"
    :schema="schema"
    :field-config="{
      password: {
        label: 'Your secure password',
        inputProps: {
          type: 'password',
          placeholder: '••••••••',
        },
      },
      favouriteNumber: {
        description: 'Your favourite number between 1 and 10.',
      },
      acceptTerms: {
        label: 'Accept terms and conditions.',
        inputProps: {
          required: true,
        },
      },

      birthday: {
        description: 'We need your birthday to send you a gift.',
      },

      sendMeMails: {
        component: 'switch',
      },

      bio: {
        component: 'textarea',
      },

      marshmallows: {
        label: 'How many marshmallows fit in your mouth?',
        component: 'radio',
      },

      file: {
        label: 'Text file',
        component: 'file',
      },
    }"
    @submit="onSubmit"
  >
    <template #acceptTerms="slotProps">
      <UiAutoFormField v-bind="slotProps" />
      <div class="!mt-2 text-sm">
        I agree to the
        <button class="text-primary underline">terms and conditions</button>.
      </div>
    </template>

    <template #customParent="slotProps">
      <div class="flex items-end space-x-2">
        <UiAutoFormField v-bind="slotProps" class="w-full" />
        <UiButton type="button"> Check </UiButton>
      </div>
    </template>

    <UiButton type="submit"> Submit </UiButton>
  </UiAutoForm>
</template>
