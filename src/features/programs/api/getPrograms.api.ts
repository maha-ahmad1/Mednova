import type { ProgramsResponse } from "../types/program"
import { mockPrograms } from "./__mock__/programs.mock"

export const getPrograms = async (token?: string): Promise<ProgramsResponse> => {
  // TODO(programs-api-stage2): swap for a real axios call once the backend endpoint ships.
  return {
    success: true,
    message: "",
    data: mockPrograms,
    status: "success",
  }
}
