"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useFetcher } from "@/hooks/useFetcher";
import type {
  PaginatedResponse,
  WalletPayment,
  WalletRole,
  WalletSummary,
  WalletTransaction,
} from "../types";

const DEFAULT_PER_PAGE = 15;
const MAX_PER_PAGE = 50;

type WalletPaginationParams = {
  page: number;
  per_page: number;
};

const clampPerPage = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_PER_PAGE;
  return Math.min(value, MAX_PER_PAGE);
};

export const useWalletData = () => {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

  const role = session?.user?.role;
  const walletRole: WalletRole | null =
    role === "patient"
      ? "patient"
      : role === "therapist" || role === "rehabilitation_center"
      ? "consultant"
      : null;

  const paginationParams = useMemo(
    () => ({ page, per_page: clampPerPage(perPage) }),
    [page, perPage]
  );

  const walletSummary = useFetcher<WalletSummary>(
    ["wallet-summary", walletRole],
    walletRole ? `/api/financial/${walletRole}/wallet` : null
  );

  const consultantTransactions = useFetcher<PaginatedResponse<WalletTransaction>, WalletPaginationParams>(
    ["wallet-consultant-transactions"],
    walletRole === "consultant" ? "/api/financial/consultant/wallet/transactions" : null,
    { params: paginationParams, enabled: walletRole === "consultant" }
  );

  const patientPayments = useFetcher<PaginatedResponse<WalletPayment>, WalletPaginationParams>(
    ["wallet-patient-payments"],
    walletRole === "patient" ? "/api/financial/patient/wallet/payments" : null,
    { params: paginationParams, enabled: walletRole === "patient" }
  );

  const patientTransactions = useFetcher<PaginatedResponse<WalletTransaction>, WalletPaginationParams>(
    ["wallet-patient-transactions"],
    walletRole === "patient" ? "/api/financial/patient/wallet/transactions" : null,
    { params: paginationParams, enabled: walletRole === "patient" }
  );

  return {
    walletRole,
    page,
    perPage: clampPerPage(perPage),
    setPage,
    setPerPage,
    walletSummary,
    consultantTransactions,
    patientPayments,
    patientTransactions,
  };
};
