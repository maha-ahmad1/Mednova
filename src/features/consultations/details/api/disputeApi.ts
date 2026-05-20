import type { AxiosInstance } from "axios";

interface DisputePayload {
  type: "video" | "chat";
  reason_dispute: string;
}

export async function openDispute(
  axios: AxiosInstance,
  id: number,
  payload: DisputePayload,
): Promise<{ success: boolean; message?: string }> {
  const form = new FormData();
  form.append("type", payload.type);
  form.append("reason_dispute", payload.reason_dispute);

  const res = await axios.post<{ success: boolean; message?: string }>(
    `/api/consultation-request/financial/patient/${id}/dispute`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
}
