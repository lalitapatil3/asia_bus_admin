import toast from "react-hot-toast";

type ToastOptions = {
  duration?: number;
};

export function showSuccess(message: string, options?: ToastOptions) {
  return toast.success(message, {
    duration: options?.duration ?? 3000,
  });
}

export function showError(error: unknown, fallbackMessage = "Something went wrong") {
  let message = fallbackMessage;

  if (error instanceof Error && error.message) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string"
  ) {
    message = (error as any).message;
  }

  return toast.error(message, { duration: 4000 });
}

