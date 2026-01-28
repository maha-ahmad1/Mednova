import axios from "axios"
import type { ProgramsResponse } from "../types/program"

export const getPrograms = async (token?: string): Promise<ProgramsResponse> => {
  const response = await axios.get<ProgramsResponse>("https://api.mednovacare.com/api/programs", {
    // headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return response.data
}
