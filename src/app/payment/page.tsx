"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  ArrowRight, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Clock, 
  User, 
  Building2,
  Lock,
  Sparkles,
  Zap,
  Smartphone,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { useConsultationTypeStore } from '@/store/ConsultationTypeStore';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function PaymentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { currentConsultation, clearConsultation } = useConsultationTypeStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');

  useEffect(() => {
    // Redirect if no consultation data
    if (!currentConsultation) {
      router.push('/');
      toast.error("لا توجد بيانات استشارة");
    }
  }, [currentConsultation, router]);

  const handlePayment = async () => {
    if (!currentConsultation || !session?.user?.id) return;

    setIsProcessing(true);
    try {
      // Here you would integrate with your payment gateway
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send API request to create consultation
      const response = await fetch('/api/consultations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: session.user.id,
          consultant_id: currentConsultation.providerId,
          consultant_type: currentConsultation.consultantType,
          consultant_nature: currentConsultation.consultationType,
          type_appointment: 'online',
        }),
      });

      if (!response.ok) throw new Error('Payment failed');
      
      clearConsultation();
      toast.success("تم الدفع بنجاح، سيتم توجيهك إلى الاستشارة");
      // Redirect to chat interface
      router.push('/consultations/chat');
      
    } catch (error) {
      toast.error("حدث خطأ أثناء المعالجة");
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentConsultation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-full flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">جاري التحميل...</h3>
          <p className="text-gray-600">يتم تحميل بيانات الاستشارة</p>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { 
      id: 'card', 
      name: 'البطاقة الائتمانية', 
      icon: CreditCard,
      description: 'فيزا، ماستركارد، أمريكان إكسبريس',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'mada', 
      name: 'مدى', 
      icon: Smartphone,
      description: 'الدفع عبر تطبيق مدى',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'apple-pay', 
      name: 'Apple Pay', 
      icon: Zap,
      description: 'الدفع عبر أجهزة آبل',
      color: 'from-gray-800 to-gray-900'
    },
  ];

  const benefits = [
    { icon: Shield, text: 'مدفوعات آمنة ومشفرة' },
    { icon: Clock, text: 'معالجة فورية' },
    { icon: CheckCircle, text: 'تأكيد فوري للحجز' },
    { icon: Globe, text: 'مدفوعات دولية مقبولة' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* رأس الصفحة */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 px-6 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            <span className="text-sm font-medium text-[#32A88D]">دفع آمن</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            إكمال عملية الدفع
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            خطوة أخيرة لبدء استشارتك النصية مع {currentConsultation.providerName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الأيسر: معلومات الاستشارة */}
          <div className="lg:col-span-2 space-y-6">
            {/* بطاقة معلومات الاستشارة */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">تفاصيل الاستشارة</h2>
                    <p className="text-white/90 text-sm">استكمل الدفع للبدء في الاستشارة</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">نوع الاستشارة</span>
                        <p className="font-semibold text-gray-800">استشارة نصية فورية</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1">
                      دردشة مباشرة
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-[#32A88D]" />
                        <span className="text-sm text-gray-600">المختص</span>
                      </div>
                      <p className="font-bold text-lg text-gray-800">{currentConsultation.providerName}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-[#32A88D]" />
                        <span className="text-sm text-gray-600">التخصص</span>
                      </div>
                      <p className="font-bold text-lg text-gray-800">
                        {currentConsultation.consultantType === 'therapist' ? 'معالج نفسي' : 'مركز تأهيلي'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-50/50 rounded-xl border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">مدة الاستشارة</span>
                        <p className="font-bold text-lg text-gray-800">غير محدودة - ردود متتالية</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">وقت البدء</span>
                        <p className="font-bold text-lg text-gray-800">فور الدفع</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* طرق الدفع */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-[#32A88D]" />
                  <CardTitle className="text-xl">اختر طريقة الدفع</CardTitle>
                </div>
                <CardDescription>اختر الطريقة المناسبة لك لإكمال عملية الدفع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02]",
                          selectedPaymentMethod === method.id
                            ? "border-[#32A88D] bg-gradient-to-r from-[#32A88D]/5 to-[#2a8a7a]/5"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center",
                              selectedPaymentMethod === method.id
                                ? "bg-gradient-to-r from-[#32A88D] to-[#2a8a7a]"
                                : "bg-gray-100"
                            )}>
                              <Icon className={cn(
                                "w-6 h-6",
                                selectedPaymentMethod === method.id
                                  ? "text-white"
                                  : "text-gray-600"
                              )} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{method.name}</h3>
                              <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                            selectedPaymentMethod === method.id
                              ? "border-[#32A88D] bg-[#32A88D]"
                              : "border-gray-300"
                          )}>
                            {selectedPaymentMethod === method.id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* معلومات أمان إضافية */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-5 h-5 text-[#32A88D]" />
                    <span className="font-semibold text-gray-800">أمان متقدم</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    جميع عمليات الدفع مشفرة باستخدام تقنية TLS 1.3. لن نخزن أي بيانات بطاقة ائتمانية على خوادمنا.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* العمود الأيمن: ملخص الدفع */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl rounded-2xl sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] p-6 text-white">
                <h2 className="text-xl font-bold">ملخص الدفع</h2>
                <p className="text-white/90 text-sm">مراجعة تفاصيل طلبك</p>
              </div>
              
              <CardContent className="p-6">
                {/* تفاصيل الأسعار */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">رسوم الاستشارة</span>
                    <span className="font-semibold text-gray-800">150 ر.س</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الضريبة المضافة</span>
                    <span className="font-semibold text-gray-800">15 ر.س</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">رسوم الخدمة</span>
                    <span className="font-semibold text-gray-800">0 ر.س</span>
                  </div>
                  
                  {/* <Separator className="my-4" /> */}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">المجموع</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#32A88D]">165 ر.س</span>
                      <p className="text-sm text-gray-500">شامل الضريبة</p>
                    </div>
                  </div>
                </div>
                
                {/* فوائد الدفع */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">مزايا الدفع لدينا</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <benefit.icon className="w-4 h-4 text-[#32A88D]" />
                        <span className="text-xs text-gray-600">{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* زر الدفع */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !currentConsultation}
                  className="w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-6 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          <span>الدخول للاستشارة</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>165 ر.س</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </>
                  )}
                </Button>
                
                {/* ضمان استرجاع المال */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-50/50 rounded-xl border border-green-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">ضمان استرجاع المال</h4>
                      <p className="text-sm text-gray-600">
                        يمكنك استرجاع المبلغ كاملًا إذا لم تبدأ الاستشارة خلال 24 ساعة
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 border-t p-6">
                <div className="text-center w-full">
                  <p className="text-sm text-gray-500 mb-2">
                    <Lock className="w-4 h-4 inline mr-1" />
                    مدفوعات آمنة 100%
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            {/* زر العودة */}
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-6 mt-4"
              onClick={() => router.back()}
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              العودة للخلف
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}