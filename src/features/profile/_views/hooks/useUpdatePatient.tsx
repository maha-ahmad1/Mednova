"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { toast } from "sonner";
import { useSession } from "next-auth/react"; 

export type PatientFormValues = Record<string, unknown>;

type UseUpdatePatientOptions = {
  onValidationError?: (errors: Record<string, string>) => void;
};

export const useUpdatePatient = (opts?: UseUpdatePatientOptions) => {
  const axios = useAxiosInstance();
  const { data: session, update } = useSession();
  
  const mutation = useMutation({
    mutationFn: async (data: PatientFormValues) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, val]) => {
        if (val === undefined || val === null) return;

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

      const res = await axios.post("/api/patient/update", formData);
      return res.data; 
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

 onSuccess: async (_, variables) => {
  toast.success("تم حفظ التغييرات بنجاح");

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
