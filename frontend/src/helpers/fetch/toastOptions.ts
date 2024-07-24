import type { ToastOptions } from "~/@types/toast";

export const makeUpdateToastOptions = ({
  label,
}: {
  label: string;
}): ToastOptions => {
  return {
    success: { message: `${label} updated successfully` },
    error: true,
    loading: true,
  };
};

export const makeCreateToastOptions = ({
  label,
}: {
  label: string;
}): ToastOptions => {
  return {
    success: { message: `${label} created successfully` },
    error: true,
    loading: true,
  };
};
