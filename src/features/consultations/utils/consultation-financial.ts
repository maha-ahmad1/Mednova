type ConsultationFinancialApi = {
  consultation_price?: unknown;
  gateway_commission_rate?: unknown;
  gateway_commission_amount?: unknown;
  net_amount?: unknown;
};

export type ConsultationFinancial = {
  consultationPrice: number;
  gatewayCommissionRate: string;
  gatewayCommissionAmount: number;
  netAmount: number;
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const toRate = (value: unknown): string =>
  typeof value === "string" && value.trim().length > 0 ? value : "";

export const extractConsultationFinancial = (
  response: unknown,
): ConsultationFinancial => {
  const source = response as {
    financial?: ConsultationFinancialApi;
    data?: {
      financial?: ConsultationFinancialApi;
    };
  };

  const financial = source?.data?.financial ?? source?.financial;

  return {
    consultationPrice: toNumber(financial?.consultation_price),
    gatewayCommissionRate: toRate(financial?.gateway_commission_rate),
    gatewayCommissionAmount: toNumber(financial?.gateway_commission_amount),
    netAmount: toNumber(financial?.net_amount),
  };
};
