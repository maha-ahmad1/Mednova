"use client";

import { useMutation } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { purchaseProgram } from "../api";

export const useProgramPurchase = () => {
  const axiosInstance = useAxiosInstance();

  return useMutation({
    mutationFn: (programId: number) => purchaseProgram(axiosInstance, programId),
  });
};
