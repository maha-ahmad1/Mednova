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

// src/features/service-provider/types/index.ts

export interface ServiceProvider {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  experience_years: number;
  average_rating: number;
  total_reviews: number;
  therapist_details?: TherapistDetails;
  center_details?: CenterDetails;
  location_details?: {
    country: string;
    city: string;
    formatted_address: string;
  };
  schedules?: Array<{
    id: number;
    day_of_week: string[];
    start_time_morning: string;
    end_time_morning: string;
    is_have_evening_time: boolean;
    start_time_evening: string;
    end_time_evening: string;
    type_time: string;
  }>;
  services?: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
    duration: string;
  }>;
  specialties?: Array<{
    id: number;
    name: string;
  }>;
  medicalSpecialties?: MedicalSpecialty[];
  chat_price?: number;
  video_price?: number;
  type_account?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface ScheduleDay {
  day: string;
  isAvailable: boolean;
  morningTime?: string;
  eveningTime?: string;
}

export type SearchFilters = {
  country: string;
  city: string;
  specialty: string;
};

export type ProviderType = "all" | "therapist" | "center";