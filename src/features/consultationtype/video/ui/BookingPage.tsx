"use client";

import React from "react";
import BookingHeader from "./components/BookingHeader/BookingHeader";
import ProviderInfoCard from "./components/ProviderInfoCard/ProviderInfoCard";
import DateTimeSelector from "./components/DateTimeSelector/DateTimeSelector";
import BookingButton from "./components/BookingButton/BookingButton";
import BookingPageSkeleton from "./BookingPageSkeleton";
import { useBookingLogic } from "./hooks/useBookingLogic";

interface BookingPageProps {
  doctorId?: string;
  patientId?: string;
}

export default function BookingPage({ doctorId, patientId }: BookingPageProps) {
  const logic = useBookingLogic({ doctorId, patientId });

  if (logic.isPageLoading || logic.isLoadingProvider)
    return <BookingPageSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-12 xl:px-16">
      <div className="max-w-7xl mx-auto">
        <BookingHeader consultantType={logic.providerType} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <ProviderInfoCard
              provider={logic.provider}
              consultantType={logic.providerType}
              selectedDate={logic.selectedDate}
              selectedTime={logic.selectedTime}
              onBack={() => history.back()}
              isLoading={logic.isLoadingProvider}
            />
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
            <DateTimeSelector
              selectedDate={logic.selectedDate}
              setSelectedDate={logic.setSelectedDate}
              selectedTime={logic.selectedTime}
              setSelectedTime={logic.setSelectedTime}
              timeZone={logic.timeZone}
              setTimeZone={logic.setSelectedTimeZone} // تأكد من استخدام الدالة الصحيحة
              groupedSlots={logic.groupedSlots}
              isLoadingSlots={logic.isLoadingSlots}
              availableSlotsLength={logic.availableSlotsLength}
              customerId={patientId ? parseInt(patientId) : undefined} // تحويل إلى number إذا لزم
              onTimeZoneChange={(tz) => {
                // only reload slots if a date is already selected
                if (logic.selectedDate) {
                  void logic.loadAvailableSlots(logic.selectedDate, tz)
                }
              }}
            />

            <BookingButton
              onClick={logic.handleBooking}
              disabled={
                !logic.selectedDate || !logic.selectedTime || logic.isSubmitting
              }
              isSubmitting={logic.isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
