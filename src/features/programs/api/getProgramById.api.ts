import axios from "axios"
import type { ProgramDetailResponse } from "../types/program"

export const getProgramById = async (id: number, token?: string): Promise<ProgramDetailResponse> => {
  const response = await axios.get<ProgramDetailResponse>(`https://mednovacare.com/api/programs/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return response.data
}
