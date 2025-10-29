"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { toast } from "sonner";

export type PatientFormValues = Record<string, any>;

type UseUpdatePatientOptions = {
  onValidationError?: (errors: Record<string, string>) => void;
};

export const useUpdatePatient = (opts?: UseUpdatePatientOptions) => {
  const axios = useAxiosInstance();

  const mutation = useMutation({
    mutationFn: (data: PatientFormValues) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, val]) => {
        if (val === undefined || val === null) return;

        // if (Array.isArray(val)) {
        //   val.forEach((v) => v && formData.append(`${key}[]`, String(v)));
        //   return;
        // }

        if (typeof File !== "undefined" && val instanceof File) {
          formData.append(key, val);
          return;
        }

        if (typeof Blob !== "undefined" && val instanceof Blob) {
          formData.append(key, val);
          return;
        }

        if (typeof val === "boolean") {
          formData.append(key, val ? "1" : "0");
          return;
        }

        if (typeof val === "number") {
          formData.append(key, String(val));
          return;
        }

        if (typeof val === "object") {
          try {
            formData.append(key, JSON.stringify(val));
          } catch {
            formData.append(key, String(val));
          }
          return;
        }
        //formData.append("customer_id", data.customer_id );

        formData.append(key, String(val));
      });

      return axios.post("/api/patient/update", formData);
    },
    onError: (err: AxiosError) => {
      const respData = err.response?.data as
        | { message?: string; data?: Record<string, string> }
        | undefined;

      const message = respData?.message || "حدث خطأ أثناء الحفظ";
      const backendErrors = respData?.data;

      if (backendErrors && Object.keys(backendErrors).length > 0) {
        opts?.onValidationError?.(backendErrors);
      }

      toast.error(message);
    },
    onSuccess: () => {
      toast.success("تم حفظ التغييرات بنجاح");
    },
  });

  return {
    update: mutation.mutateAsync,
    isUpdating: mutation.status === "pending",
    updateError: mutation.error,
  };
};
