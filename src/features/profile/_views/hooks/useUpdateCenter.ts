"use client";

import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import type { CenterFormValues } from "@/app/api/center";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type UseUpdateCenterOptions = {
  onValidationError?: (errors: Record<string, string>) => void;
};

export const useUpdateCenter = (opts?: UseUpdateCenterOptions) => {
  const axios = useAxiosInstance();
  const { data: session, update } = useSession();

  const mutation = useMutation({
    mutationFn: async (data: CenterFormValues) => {
      const formData = new FormData();

      if (!data.has_commercial_registration) {
        delete data.commercial_registration_number;
        delete data.commercial_registration_authority;
        delete data.commercial_registration_file;
      }
      Object.entries(data).forEach(([key, val]) => {
        if (val === undefined || val === null) return;

        if (Array.isArray(val)) {
          (val as Array<unknown>).forEach((v) => {
            if (v === undefined || v === null) return;
            formData.append(`${key}[]`, String(v));
          });
          return;
        }

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

        formData.append(key, String(val));
      });

      // return axios.post("/api/center/update", formData);

      const res = await axios.post("/api/center/update", formData);
      return res.data;
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
    onSuccess: async (_, variables) => {
      // toast.success("Changes saved successfully.");
      await update({
        user: {
          ...session?.user,
          ...variables,
        },
      });
    },
  });

  return {
    update: mutation.mutateAsync,
    isUpdating: mutation.status === "pending",
    updateError: mutation.error,
  };
};
