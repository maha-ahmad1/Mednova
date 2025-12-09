// // app/appointment/[doctorId]/page.tsx
// import BookingPage from "@/features/consultationtype/video/ui/BookingPage";
// import LandingNavbar from "@/shared/ui/layout/LandingNavbar";

// interface PageProps {
//   params: {
//     doctorId: string;
//   };
// }

// export default function AppointmentPage({ params }: PageProps) {
//   return (
//     <div className="min-h-screen">
//       <LandingNavbar />
//       <BookingPage doctorId={params.doctorId} />
//     </div>
//   );
// }


"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import LandingNavbar from "@/shared/ui/layout/LandingNavbar";
 import BookingPage from "@/features/consultationtype/video/ui/BookingPage";
import { useConsultationTypeStore } from '@/store/ConsultationTypeStore';



export default function AppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const { currentConsultation } = useConsultationTypeStore();

  useEffect(() => {
    // If no consultation data in store, but we have a provider ID in URL
    if (!currentConsultation && params.id) {
      // You can fetch provider data here if needed
      // Or redirect to home page
      router.push('/');
    }
  }, [currentConsultation, params.id, router]);

  // Use providerId from Zustand store or from URL params
  const providerId = currentConsultation?.providerId || (params.id as string);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">يجب تسجيل الدخول أولاً</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <LandingNavbar />
    <BookingPage 
      doctorId={providerId}
      patientId={session.user?.id}
    />
    </>
    
  );
}