import { toast } from "sonner";


export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
  });
};


export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
  });
};


export const showWarningToast = (message: string) => {
  toast.warning(message, {
    duration: 4000,
  });
};
