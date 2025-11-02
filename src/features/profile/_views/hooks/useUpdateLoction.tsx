"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import type { TherapistFormValues } from "@/app/api/therapist";
import { toast } from "sonner";

type useUpdateLoctionOptions = {
  onValidationError?: (errors: Record<string, string>) => void;
};

export const useUpdateLoction = (opts?: useUpdateLoctionOptions) => {
  const axios = useAxiosInstance();

  const mutation = useMutation({
    mutationFn: (data: TherapistFormValues) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, val]) => {
        if (val === undefined || val === null) return;

        // For arrays (e.g., day_of_week) append each entry as key[]
        // if (Array.isArray(val)) {
        //   (val as Array<unknown>).forEach((v) => {
        //     if (v === undefined || v === null) return;
        //     formData.append(`${key}[]`, String(v));
        //   });
        //   return;
        // }

        // Files / Blobs: append directly
        // if (typeof File !== "undefined" && val instanceof File) {
        //   formData.append(key, val);
        //   return;
        // }
        // if (typeof Blob !== "undefined" && val instanceof Blob) {
        //   formData.append(key, val);
        //   return;
        // }

        // Booleans: convert to server-expected flag (1/0)
        // if (typeof val === "boolean") {
        //   formData.append(key, val ? "1" : "0");
        //   return;
        // }

        // Numbers and other primitives: stringify
        // if (typeof val === "number") {
        //   formData.append(key, String(val));
        //   return;
        // }

        if (typeof val === "object") {
          // Fallback for plain objects: serialize to JSON
          try {
            formData.append(key, JSON.stringify(val));
          } catch {
            // last-resort string coercion
            formData.append(key, String(val));
          }
          return;
        }

        // Strings and other values
        formData.append(key, String(val));
      });

      return axios.post("/api/location/update", formData);
    },
    onError: (err: AxiosError) => {
      const respData = err.response?.data as unknown as
        | { message?: string; data?: Record<string, string> }
        | undefined;

      const message = respData?.message || err.message || "حدث خطأ";

      // If backend returned field errors, surface them to caller
      const backendErrors = (respData && (respData.data || {})) as
        | Record<string, string>
        | undefined;
      if (backendErrors && Object.keys(backendErrors).length > 0) {
        opts?.onValidationError?.(backendErrors);
      }

      toast.error(String(message));
    },
    onSuccess: () => {
      toast.success("Changes saved successfully.");
    },
  });

  return {
    update: mutation.mutateAsync,
    isUpdating: mutation.status === "pending",
    updateError: mutation.error,
  };
};
