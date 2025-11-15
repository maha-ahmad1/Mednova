"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Logo } from "@/shared/ui/Logo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  Video,
  ArrowLeft,
  Search,
  MapPin,
  Building,
  User,
  Star,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchingData {
  type: string;
  country: string;
  city: string;
}

const NavLink = [
  {
    id: 1,
    title: "الرئيسية",
    link: "/",
  },
  {
    id: 2,
    title: "خدماتنا",
    link: "#",
    dropdown: [
      { id: 1, title: "حجز موعد", link: "#" },
      {
        id: 2,
        title: "استشارات",
        link: "#",
      },
      {
        id: 3,
        title: "برنامج رحلة التعافي",
        link: "#",
      },
    ],
  },
  {
    id: 3,
    title: "التخصصات",
    link: "#",
    dropdown: [
      { id: 1, title: "العلاج العضلي الهيكلي", link: "#" },
      {
        id: 2,
        title: "العلاج العصبي",
        link: "#",
      },
      {
        id: 3,
        title: "علاج الأطفال (الاضطرابات الحركية)",
        link: "#",
      },
      {
        id: 4,
        title: "العلاج بعد العمليات والجراحة",
        link: "#",
      },
      {
        id: 5,
        title: "العلاج اليدوي (Manual Therapy)",
        link: "#",
      },
      {
        id: 6,
        title: "العلاج باستخدام الأجهزة (الكهربائي، الموجات، الليزر)",
        link: "#",
      },
      {
        id: 7,
        title: "إعادة التأهيل الوظيفي",
        link: "#",
      },
      {
        id: 8,
        title: "العلاج القلبي التنفسي",
        link: "#",
      },
    ],
  },
  {
    id: 4,
    title: "الأجهزة",
    link: "#",
    dropdown: [
      {
        id: 1,
        title: "جهاز القفاز الذكي",
        link: "#",
      },
    ],
  },
  {
    id: 5,
    title: "المختصين",
    link: "/therapistsAndCenters",
  },
];

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { setValue, watch, register, handleSubmit } = useForm<SearchingData>();

  const onSubmit = (data: SearchingData) => {
    console.log(data);
    const query = new URLSearchParams(
      Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    router.push(`/searchResults?${query}`);
  };

  const selectedType = watch("type");

  return (
    <section className="relative md:px-10 bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 overflow-hidden">
      {/* شكل دائري خلفي */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#32A88D]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* شريط التنقل */}
        <header className="flex items-center justify-between py-6">
          {/* الشعار */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* روابط التنقل - كبير الشاشة */}
          <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
            {NavLink.map((link) => (
              <div key={link.id} className="relative group">
                {link.dropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 text-gray-700 hover:text-[#32A88D] hover:bg-[#32A88D]/10 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                      >
                        {link.title}
                        <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-64 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl p-2"
                    >
                      {link.dropdown.map((item) => (
                        <DropdownMenuItem
                          key={item.id}
                          className="flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-[#32A88D]/10 hover:text-[#32A88D] cursor-pointer transition-all duration-200"
                        >
                          <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={link.link}
                    className="flex items-center gap-1 text-gray-700 hover:text-[#32A88D] hover:bg-[#32A88D]/10 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* أزرار تسجيل الدخول - كبير الشاشة */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="outline"
              className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-6 py-2 transition-all duration-200"
              asChild
            >
              <Link href="/login">تسجيل دخول</Link>
            </Button>
            {/* <Button
              variant="outline"
              className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-6 py-2 transition-all duration-200"
              asChild
            >
              <Link href="/login">تسجيل دخول</Link>
            </Button> */}
          </div>

          {/* زر القائمة - صغير الشاشة */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </header>

        {/* القائمة المنزلقة - صغير الشاشة */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden">
            <div className="bg-white w-80 h-full rtl:right-0 ltr:left-0 shadow-2xl relative">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Logo />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-[#32A88D] rounded-xl"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {NavLink.map((link) => (
                  <div
                    key={link.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    {link.dropdown ? (
                      <details className="group">
                        <summary className="flex items-center justify-between p-4 text-gray-700 hover:text-[#32A88D] cursor-pointer list-none">
                          <span className="font-medium">{link.title}</span>
                          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                        </summary>
                        <div className="pr-4 pb-2 space-y-1">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.id}
                              href={item.link}
                              className="block p-3 text-sm text-gray-600 hover:text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl transition-all duration-200"
                              onClick={() => setIsOpen(false)}
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <Link
                        href={link.link}
                        className="flex items-center p-4 text-gray-700 hover:text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl transition-all duration-200 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.title}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
                <Button
                  className="w-full bg-[#32A88D] hover:bg-[#2a8a7a] text-white rounded-xl py-3 transition-all duration-200"
                  asChild
                >
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    تسجيل دخول
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* المحتوى الرئيسي */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 lg:py-20 sm:px-0 3xl:px-32">
          {/* النص والعنوان */}
          <div className="lg:col-span-7 text-center lg:text-right">
            {/* شارة */}
            <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 text-[#32A88D] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-[#32A88D] rounded-full animate-pulse"></div>
              <span>رحلتك للشفاء تبدأ بميدنوفا</span>
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="sm:text-4xl text-6xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
              راحة جسدك{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#32A88D] to-[#2a8a7a]">
                تبدأ من هنا
              </span>
            </h1>

            {/* الوصف */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-16 leading-relaxed">
              استعد صحتك وثقتك بنفسك بمساعدة أفضل أخصائي العلاج الطبيعي
              والتأهيلي. رحلتك نحو التعافي تبدأ بخطوة واحدة مع فريقنا المتخصص.
            </p>

            {/* أزرار الإجراء */}
            <div className="flex flex-col w-fit md:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r w-[40%] md:w-[50%] from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                asChild
              >
                <Link href="/therapistsAndCenters">
                  ابدأ البحث الآن
                  <ArrowLeft className="mr-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-[#32A88D] w-[40%] md:w-[80%] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-8 py-4 text-lg transition-all duration-300"
              >
                تعرف أكثر
              </Button>
            </div>

            {/* إحصائيات */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#32A88D]">500+</div>
                <div className="text-sm text-gray-600">مختص معتمد</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#32A88D]">10K+</div>
                <div className="text-sm text-gray-600">مريض شفي</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#32A88D]">98%</div>
                <div className="text-sm text-gray-600">رضا العملاء</div>
              </div>
            </div>
          </div>

          {/* الصورة والعناصر المرئية */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* الصورة الرئيسية */}
              <div className="relative z-10">
                <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[480px] lg:h-[480px] mx-auto">
                  <Image
                    src="/images/home/doe.png"
                    alt="طبيب مختص"
                    width={480}
                    height={480}
                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              </div>

              {/* العناصر العائمة */}
              <div className="absolute -top-4 -right-4 z-20">
                <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      استشارة نصية
                    </div>
                    <div className="text-xs text-gray-600">رد فوري</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 z-20">
                <div
                  className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      استشارة فيديو
                    </div>
                    <div className="text-xs text-gray-600">وجه لوجه</div>
                  </div>
                </div>
              </div>

              {/* شكل خلفي */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#32A88D]/20 to-blue-500/20 rounded-2xl blur-xl -z-10 transform scale-110"></div>
            </div>
          </div>
        </div>

        {/* <div className="relative z-20 -translate-y-0">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mx-auto max-w-4xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                ابحث عن المختصين والمراكز التأهيلية بسهولة
              </h3>
              <p className="text-gray-600">
                اختر النوع والمكان للعثور على أفضل المختصين المناسبين لاحتياجاتك
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-1">
                  <Select
                    onValueChange={(value) => setValue("type", value)}
                    value={selectedType}
                  >
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#32A88D] focus:border-[#32A88D] transition-all duration-200">
                      <SelectValue
                        placeholder={
                          <div className="flex items-center gap-2 text-gray-500">
                            <User className="w-4 h-4" />
                            <span>النوع</span>
                          </div>
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg">
                      <SelectItem
                        value="center"
                        className="flex items-center gap-2"
                      >
                        <Building className="w-4 h-4" />
                        مركز
                      </SelectItem>
                      <SelectItem
                        value="therapist"
                        className="flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        مختص
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="الدولة"
                      {...register("country")}
                      className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl pr-10 focus:ring-2 focus:ring-[#32A88D] focus:border-[#32A88D] transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="المدينة"
                      {...register("city")}
                      className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl pr-10 focus:ring-2 focus:ring-[#32A88D] focus:border-[#32A88D] transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="ml-2 w-5 h-5" />
                  ابحث الآن
                </Button>

                <Button
                  type="reset"
                  variant="outline"
                  size="lg"
                  className="flex-1 border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl py-3 transition-all duration-300"
                >
                  مسح البحث
                </Button>
              </div>
            </form>
          </div>
        </div> */}
      </div>

      {/* أنيميشن للعناصر العائمة */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
