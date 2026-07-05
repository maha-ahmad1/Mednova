export type DeviceCategory = "homecare" | "clinical" | "accessories";

export interface DeviceProduct {
  id: string; // translation key, e.g. "hrc10"
  pid: string; // e.g. "SY-HRC10"
  category: DeviceCategory;
  image: string; // "/images/smart-devices/SY-HRC10.png"
  isBestSeller?: boolean;
  hostSize?: string; // e.g. "105x95x60mm" — omit if not applicable
}

export interface DeviceProductTranslation {
  name: string;
  description?: string;
  features: string[];
  configuration: string[];
}
