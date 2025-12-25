import { useFetcher } from '@/hooks/useFetcher';
import { MedicalSpecialty }  from '../types/provider';

export const useMedicalSpecialties = () => {
  return useFetcher<MedicalSpecialty[]>(
    ["medicalSpecialties"],
    "/api/medical-specialties",
    { staleTime: 60 }
  );
};