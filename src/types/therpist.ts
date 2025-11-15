export type Schedule = {
  id?: string;
  day_of_week?: string[];
  start_time_morning?: string;
  end_time_morning?: string;
  is_have_evening_time?: boolean;
  start_time_evening?: string | null;
  end_time_evening?: string | null;
};

export type TherapistProfile = {
  full_name?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  type_account?: string;
  // image can be a URL (string) or a File when editing locally
  image?: string | File;
  therapist_details?: {
    // backend may include an id for the specialty; make it optional
    medical_specialties?: { id?: string | number; name?: string } | null;
    experience_years?: number | string | null;
    university_name?: string | null;
    graduation_year?: number | string | null;
    countries_certified?: string[] | null;
    license_number?: string | null;
    license_authority?: string | null;
    certificate_file?: string | null;
    license_file?: string | null;
    bio?: string | null;
  } | null;
  location_details?: {
    country?: string | null;
    city?: string | null;
    formatted_address?: string | null;
  } | null;
  schedules?: Schedule[] | null;
  [key: string]: unknown;
};
