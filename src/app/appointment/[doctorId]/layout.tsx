// app/appointment/[doctorId]/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حجز موعد مع المختص",
  description: "حجز موعد مع المختص الطبي المختار",
};

export default function AppointmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}