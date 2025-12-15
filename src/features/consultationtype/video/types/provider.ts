export interface Provider {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  type_account: "therapist" | "rehabilitation_center" | "customer";
  image?: string;
  bio?: string;
  rating?: number;
  review_count?: number;
  location_details?: {
    formatted_address: string;
    latitude?: number;
    longitude?: number;
  };
  therapist_details?: {
    medical_specialties?: {
      name: string;
      id: string;
    };
    qualifications?: string[];
    experience_years?: number;
    consultation_fee?: number;
  };
  center_details?: {
    services?: Array<{
      name: string;
      description?: string;
      price?: number;
    }>;
    facilities?: string[];
    working_hours?: {
      day: string;
      start_time: string;
      end_time: string;
    }[];
  };
 
}