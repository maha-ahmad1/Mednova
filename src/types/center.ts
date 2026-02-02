export interface CenterProfile {
  id: number;
  full_name?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: "Male" | "Female";
  image?: string;
  name_center?: string;
  video_consultation_price?: string | number;
  chat_consultation_price?: string | number;
  currency?: string;
  timezone: string;

  center_details?: {
    id: number;
    specialty_id?: number[];
    specialties?: Array<{ id: number; name: string }>;
    year_establishment?: string;
    has_commercial_registration?: boolean;
    commercial_registration_number?: string;
    commercial_registration_file?: string;
    commercial_registration_authority?: string;
    license_authority?: string;
    license_file?: string;
    license_number?: string;
    bio?: string;
    video_consultation_price?: string | number;
    chat_consultation_price?: string | number;
    currency?: string;
    name_center?: string;
  };

  medicalSpecialties?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;

  schedules?: Array<{
    id: number;
    day_of_week?: string[];
    start_time_morning?: string;
    end_time_morning?: string;
    is_have_evening_time?: boolean;
    start_time_evening?: string;
    end_time_evening?: string;
  }>;

  location_details?: {
    id: number;
    country?: string;
    city?: string;
    formatted_address?: string;
  };
}
