"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { cancelKawaderRequest } from "../api";
import type { KawaderRequest } from "../types/kawader";
import { handleKawaderError } from "../utils/kawader-errors";
import { kawaderKeys } from "../utils/kawader-query-keys";

export function useCancelKawaderRequest() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const t = useTranslations();

  const mutation = useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason?: string }) =>
      cancelKawaderRequest(axiosInstance, id, { reason }),
    onSuccess: (response, { id }) => {
      const detailKey = kawaderKeys.myRequestDetail(locale, id);

      // P5 is expected to return the updated request (same shape as P4): show it right away,
      // then refetch so the cache ends up with the server's truth either way.
      const updated = response.data as Partial<KawaderRequest> | null | undefined;
      if (updated && typeof updated === "object" && "status" in updated) {
        queryClient.setQueryData(detailKey, updated);
      }
      queryClient.invalidateQueries({ queryKey: detailKey });
      queryClient.invalidateQueries({ queryKey: [...kawaderKeys.myRequests(locale), "list"] });

      toast.success(response.message || t("kawader.cancel.success"));
    },
    onError: (error) => handleKawaderError(error, t),
  });

  return { cancelRequest: mutation.mutateAsync, isLoading: mutation.isPending };
}
