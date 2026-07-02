import type { DeviceProduct } from "../types/device.types";
import { DeviceCard } from "./DeviceCard";

interface DeviceGridProps {
  devices: DeviceProduct[];
}

export function DeviceGrid({ devices }: DeviceGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
}
