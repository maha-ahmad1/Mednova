import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
// import { useConsultationStore } from '@/stores/consultation-store';
// import { ServiceProvider } from '@/types/provider';
import { useConsultationTypeStore } from '@/store/ConsultationTypeStore';
import { ServiceProvider } from '@/features/service-provider/types/provider';


export const useConsultationFlow = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    setConsultation,
    startLoading,
    stopLoading,
    setError,
    clearConsultation,
  } = useConsultationTypeStore();

  const initiateConsultation = async (
    provider: ServiceProvider,
    type: 'chat' | 'video'
  ) => {
    if (!session?.user?.id) {
      toast.error("يجب تسجيل الدخول أولاً");
      return false;
    }

    startLoading();
    
      try {
      // Store consultation data in Zustand
      const consultationData = {
        providerId: String(provider.id),
        providerName: provider.full_name,
        consultationType: type,
        consultantType: (provider.type_account === 'therapist'
          ? 'therapist'
          : 'rehabilitation_center') as 'therapist' | 'rehabilitation_center',
      };

      setConsultation(consultationData);
      
      // Navigate based on consultation type
      if (type === 'chat') {
        // For chat, redirect to payment page
        router.push('/payment');
      } else {
        // For video, redirect to booking page
        router.push(`/appointment/${provider.id}`);
      }
      
      return true;
    } catch (error) {
      setError('حدث خطأ أثناء بدء الاستشارة');
      console.error('Consultation initiation error:', error);
      return false;
    } finally {
      stopLoading();
    }
  };

  const completeConsultation = () => {
    clearConsultation();
    toast.success("تم إكمال العملية بنجاح");
  };

  return {
    initiateConsultation,
    completeConsultation,
    isLoading: useConsultationTypeStore((state) => state.isLoading),
    currentConsultation: useConsultationTypeStore((state) => state.currentConsultation),
  };
};