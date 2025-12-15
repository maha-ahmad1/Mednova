export type MedicalSpecialty = {
  id: number;
  name: string;
  description: string;
};

export type LocationDetails = {
  id: number;
  latitude: string;
  longitude: string;
  formatted_address: string;
  country: string;
  region: string;
  city: string;
  district: string;
  postal_code: string;
  location_type: string;
};

export type TherapistDetails = {
  id: number;
  medical_specialties: MedicalSpecialty;
  experience_years: number;
  university_name: string;
  countries_certified: string;
  graduation_year: string;
  certificate_file: string | null;
  license_number: string;
  license_authority: string;
  license_file: string | null;
  bio: string;
};

export type CenterDetails = {
  id: number;
  year_establishment: number;
  license_number: string;
  license_authority: string;
  license_file: string | null;
  bio: string;
  has_commercial_registration: number;
  commercial_registration_number: string;
  commercial_registration_file: string | null;
  commercial_registration_authority: string;
  services?: {
    id: number;
    name: string;
  }[];
};

export type ServiceProvider = {
  id: number;
  image: string;
  full_name: string;
  email?: string;
  phone?: string;
  type_account: "therapist" | "rehabilitation_center";
  birth_date?: string;
  gender?: string;
  location_details?: LocationDetails;
 therapist_details?: Partial<TherapistDetails>;
  center_details?: CenterDetails | null;
  medicalSpecialties?: MedicalSpecialty[];
  average_rating?: string | null;
  total_reviews?: number;
  is_completed?: boolean;
  status?: string;
  is_banned?: number;
  timezone?: string | null;
};

export type SearchFilters = {
  country: string;
  city: string;
  specialty: string;
};

export type ProviderType = "all" | "therapist" | "center";