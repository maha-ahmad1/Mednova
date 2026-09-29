import type { ProgramDetailResponse } from "../types/program"
import { mockPrograms } from "./__mock__/programs.mock"

export const getProgramById = async (id: number, token?: string): Promise<ProgramDetailResponse> => {
  // TODO(programs-api-stage2): swap for a real axios call once the backend endpoint ships.
  const program = mockPrograms.find((item) => item.id === id) ?? mockPrograms[0]
  return {
    success: true,
    message: "",
    data: program,
    status: "success",
  }
}
