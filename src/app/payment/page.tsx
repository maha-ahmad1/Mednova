"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Smartphone,
  Zap,
  ChevronLeft,
  Sparkles,
  CreditCard as CardIcon,
  Wallet,
  Globe,
  ShieldCheck,
  Receipt,
  Calendar,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { useConsultationTypeStore } from '@/store/ConsultationTypeStore';
import Image from 'next/image';
import { cn } from '@/lib/utils';
// import { Navbar } from '@/shared/ui/components/Header';
// import { Navbar } from '@/shared/ui/components/Navbar';
import Navbar from '@/shared/ui/components/Navbar/Navbar';
import BreadcrumbNav from '@/shared/ui/components/BreadcrumbNav';

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-2xl flex items-center justify-center animate-pulse">
            <Receipt className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">جاري تحميل بيانات الدفع...</h3>
          <p className="text-gray-600">يرجى الانتظار</p>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { 
      id: 'card', 
      name: 'البطاقة الائتمانية', 
      icon: CardIcon,
      description: 'فيزا، ماستركارد، أمريكان إكسبريس',
      badge: 'الأكثر استخداماً',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    { 
      id: 'mada', 
      name: 'مدى', 
      icon: Wallet,
      description: 'الدفع عبر تطبيق مدى',
      badge: 'محلي',
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    { 
      id: 'apple-pay', 
      name: 'Apple Pay', 
      icon: Zap,
      description: 'الدفع عبر أجهزة آبل',
      badge: 'آمن',
      color: 'bg-gradient-to-r from-gray-800 to-gray-900'
    },
  ];

  const consultantTypeText = currentConsultation.consultantType === 'therapist' ? 'معالج نفسي' : 'مركز تأهيلي';
  const consultationTypeText = currentConsultation.consultationType === 'chat' ? 'استشارة نصية' : 'استشارة فيديو';

  return (
<>

<Navbar />

<BreadcrumbNav currentPage="إتمام الدفع" />
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* شريط التقدم */}
        {/* <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#32A88D] rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <span className="text-sm font-medium text-gray-600">اختيار المختص</span>
            </div>
            <div className="w-12 h-1 bg-gray-300 mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#32A88D] rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <span className="text-sm font-medium text-gray-600">تأكيد الحجز</span>
            </div>
            <div className="w-12 h-1 bg-gray-300 mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <span className="text-sm font-medium text-[#32A88D] font-bold">إتمام الدفع</span>
            </div>
          </div>
        </div> */}

        {/* العنوان الرئيسي */}
        {/* <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 px-6 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#32A88D]">خطوة أخيرة</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            إتمام عملية الدفع
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            أكمل عملية الدفع لبدء استشارتك مع {currentConsultation.providerName}
          </p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الأيسر: معلومات الاستشارة */}
          <div className="lg:col-span-2 space-y-6">
            {/* بطاقة تفاصيل الاستشارة */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">تفاصيل استشارتك</h2>
                      <p className="text-white/90 text-sm">مراجعة المعلومات قبل الدفع</p>
                    </div>
                  </div>
                  <Badge className="bg-white text-[#32A88D] hover:bg-white/90 px-4 py-2">
                    {consultationTypeText}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                {/* معلومات المختص */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] rounded-xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{currentConsultation.providerName}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {consultantTypeText}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-yellow-500">★</span> 4.9 (120 تقييم)
                      </span>
                    </div>
                  </div>
                </div>

                {/* تفاصيل الاستشارة */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">مدة الاستشارة</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">غير محدودة</p>
                    <p className="text-xs text-gray-500">ردود متتالية</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-50/50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">وقت البدء</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">فور الدفع</p>
                    <p className="text-xs text-gray-500">مباشر</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">ضمان الجودة</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">مضمون</p>
                    <p className="text-xs text-gray-500">استرجاع المال</p>
                  </div>
                </div>

                {/* خصم (إن وجد) */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-50/50 rounded-xl border border-amber-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-gray-800">هل لديك كود خصم؟</p>
                        <p className="text-sm text-gray-600">يمكنك إضافة كود الخصم قبل الدفع</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      إضافة كود
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* طرق الدفع */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">اختر طريقة الدفع</h2>
                  <p className="text-gray-600 text-sm">اختر الطريقة المناسبة لإكمال عملية الدفع</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={cn(
                        "relative p-4 rounded-xl border-2 transition-all duration-300 text-left",
                        selectedPaymentMethod === method.id
                          ? "border-[#32A88D] bg-gradient-to-br from-[#32A88D]/5 to-[#2a8a7a]/5 ring-2 ring-[#32A88D]/20"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center text-white",
                          method.color
                        )}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{method.name}</h3>
                            {method.badge && (
                              <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600">
                                {method.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                        selectedPaymentMethod === method.id
                          ? "border-[#32A88D] bg-[#32A88D]"
                          : "border-gray-300 bg-white"
                      )}>
                        {selectedPaymentMethod === method.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* معلومات أمان */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-5 h-5 text-[#32A88D]" />
                  <span className="font-semibold text-gray-800">مدفوعات آمنة 100%</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  جميع عمليات الدفع مشفرة باستخدام تقنية TLS 1.3 المتقدمة. 
                  نحن لا نخزن أي بيانات بطاقة ائتمانية على خوادمنا.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* العمود الأيمن: ملخص الدفع */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] p-6 text-white">
                  <h2 className="text-xl font-bold">ملخص الدفع</h2>
                  <p className="text-white/90 text-sm">مراجعة تفاصيل طلبك</p>
                </div>
                
                <div className="p-6">
                  {/* تفاصيل الأسعار */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">رسوم الاستشارة</span>
                      <span className="font-semibold text-gray-800">150 ر.ع.</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">الضريبة المضافة</span>
                      <span className="font-semibold text-gray-800">15 ر.ع.</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">رسوم الخدمة</span>
                      <span className="font-semibold text-gray-800">0 ر.ع.</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <span className="text-gray-600">خصم</span>
                      <span className="font-semibold text-red-600">-0 ر.ع.</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-800">المجموع النهائي</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-[#32A88D]">165 ر.ع.</span>
                          <p className="text-sm text-gray-500">شامل جميع الضرائب</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* زر الدفع */}
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || !currentConsultation}
                    className="w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-6 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري معالجة الدفع...
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5" />
                          <span>إتمام الدفع الآمن</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg">
                          <span>165 ر.ع.</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </Button>
                  
                  {/* ضمانات */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">ضمان استرجاع المال</h4>
                        <p className="text-xs text-gray-600">
                          استرجع المبلغ كاملًا إذا لم تبدأ الاستشارة خلال 24 ساعة
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">خصوصية تامة</h4>
                        <p className="text-xs text-gray-600">
                          جميع محادثاتك مشفرة ومحمية بخصوصية تامة
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border-t border-gray-200 p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500">مدفوعات دولية مقبولة</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      لديك أسئلة حول الدفع؟{' '}
                      <a href="#" className="text-[#32A88D] hover:underline font-medium">
                        تواصل مع الدعم
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* زر العودة */}
              <Button 
                variant="outline" 
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 rounded-xl py-4 mt-4 transition-all duration-300"
                onClick={() => router.back()}
              >
                <ChevronLeft className="w-5 h-5 ml-2" />
                العودة للخلف
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}