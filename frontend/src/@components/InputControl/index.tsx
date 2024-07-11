import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import React from "react";

interface IProps {
  form: UseFormReturn<any>;
  component: "input";
  placeholder?: string;
  label?: string;
  description?: string;
  name: string;
  props?: Record<string, any>;
}

export const InputControl: React.FC<IProps> = ({
  form,
  component,
  label,
  placeholder = "",
  description,
  name,
  props = {},
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              {component === "input" && (
                <Input placeholder={placeholder} {...field} {...props} />
              )}
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
