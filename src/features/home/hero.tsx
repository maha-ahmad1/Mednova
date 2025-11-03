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
  ChevronDownIcon,
  Menu,
  X,
  MessageSquareIcon,
  ArrowLeft,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import doe from "../../../public/images/home/doe.png";
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
  {
    return (
      <section className="relative h-screen  ">
        <div className=" mx-auto px-6 lg:px-16">
          <div className=" rounded-xl  overflow-hidden">
            <header className=" flex items-center justify-between px-6 ">
              <div className="text-lg font-bold">
                <Logo />
              </div>

              <div>
                <ul className="hidden md:flex">
                  {NavLink.map((link) => {
                    return (
                      <li key={link.id}>
                        {link.dropdown ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              className="mx-2   hover:border-b-2 hover:border-b-secondary  mt-1  flex items-center gap-0.5 "
                            >
                              <Link
                                href={link.link}
                                className=" font-medium text-[#424952]"
                              >
                                {link.title}
                                <ChevronDownIcon className="w-4 h-4 mt-1  " />
                              </Link>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {link.dropdown.map((item) => {
                                return (
                                  <DropdownMenuItem key={item.id}>
                                    {item.title}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Link
                            href={link.link}
                            className=" font-medium text-[#4B5563] mx-2   hover:border-b-2 hover:border-b-secondary  mt-1 flex items-center"
                          >
                            {link.title}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="hidden md:flex gap-6 items-center">
                <button className="text-secondary rounded-lg border border-secondary px-4 py-2 ">
                  <Link href="/login">تسجيل دخول</Link>
                </button>
              </div>
              <div className="md:hidden p-4 flex justify-between items-center">
                <button onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
                {isOpen && (
                  <div className="fixed inset-0 z-50 bg-black/20">
                    <div className="bg-white w-64 h-full p-4 shadow-md relative">
                      <div className="flex items-center justify-between border-b-2">
                        <div className="">
                          <Logo />
                        </div>
                        <button
                          onClick={() => setIsOpen(false)}
                          className=" text-gray-600 hover:text-black"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <ul className="flex flex-col gap-2 mt-12">
                        {NavLink.map((link) => (
                          <li key={link.id}>
                            <Link
                              href={link.link}
                              className="p-2 hover:bg-gray-100 rounded flex items-center justify-between"
                              onClick={() => setIsOpen(false)}
                            >
                              {link.title}
                              {link.dropdown && (
                                <span className="ml-2">
                                  <ChevronDownIcon />
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </header>
            <div className="  flex flex-col  items-center justify-center">
              {/* الي بلم كلشي  */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 text-center md:text-start">
                  <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm mb-4">
                    <span className="text-xs font-medium">
                      رحلتك للشفاء تبدأ بميدنوفا
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800  mb-2">
                    راحة جسدك تبدأ من هنا
                  </h1>

                  <p className="text-[#4B5563] max-w-2xl mb-6 text-md">
                    استعد صحتك وثقتك بنفسك بمساعدة أفضل أخصائي العلاج الطبيعي
                    والتأهيلي{" "}
                  </p>

                  <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                    <Link
                      href="/therapistsAndCenters"
                      className="inline-flex items-center justify-center rounded-md bg-primary text-white px-5 py-3 text-sm font-medium shadow-lg "
                    >
                      ابدأ البحث الآن <ArrowLeft />
                    </Link>
                  </div>
                </div>
                <div className="pb-10 lg:col-span-5 relative flex justify-center lg:justify-end">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_#c3f7e8_0%,_#9ee6cf_35%,_rgba(255,255,255,0)_70%)] blur-3xl opacity-95"></div>

                  <div className="hidden lg:block relative  w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                    <Image
                      src={doe}
                      alt="doctor"
                      width={300}
                      height={300}
                      className=" relative rounded-full object-cover  "
                    />

                    <div className="absolute -right-3 top-20 w-10 h-10 rounded-full bg-primary   text-white flex items-center justify-center shadow">
                      <MessageSquareIcon />
                    </div>
                    <div className="absolute right-70 top-50 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow">
                      <VideoIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute lg:top-[100%] lg:left-1/2 transform lg:-translate-x-1/2 lg:-translate-y-1/2 bg-gray-300 p-5 rounded-xl shadow-lg lg:w-[70%]">
          <p className="text-xl font-bold mb-4 text-[#212121] text-center">
            ابحث عن المختصين والمراكز التأهيلية بسهولة
          </p>
          {/* text-[#212121] */}
          <div className="bg-white p-3 rounded-xl   shadow-lg  text-center w-full  mt-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-cols gap-3 "
            >
              <Select
                onValueChange={(value) => setValue("type", value)}
                value={selectedType}
              >
                <SelectContent>
                  <SelectItem value="center">مركز</SelectItem>
                  <SelectItem value="therapist">مختص</SelectItem>
                </SelectContent>
                <SelectTrigger className="">
                  <SelectValue placeholder="المختص/المركز" />
                </SelectTrigger>
              </Select>
              <Input type="" placeholder="الدولة" {...register("country")} />
              <Input type="" placeholder="المدينة" {...register("city")} />
              <Button type="submit">ابحث</Button>
              <Button
                type="submit"
                variant="outline"
                className="bg-white text-primary border-1-primary "
              >
                مسح
              </Button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // <div className="absolute bottom-12 right-0 translate-x-10 bg-white rounded-xl px-4 py-1 shadow-md ">
  //                     <div className="flex items-center justify-between mb-2 text-sm">
  //                       تواصل في مواعيد المراكز
  //                       <div className="text-xs text-gray-500">
  //                         Review: New best review
  //                       </div>
  //                       <div className="text-xs text-gray-400">30 min ago</div>
  //                     </div>
  //                     <div className="flex items-center gap-3">
  //                       <img
  //                         src="https://via.placeholder.com/40"
  //                         className="w-10 h-10 rounded-full"
  //                       />
  //                       <div>
  //                         <div className="text-sm font-medium">
  //                           Alexe Jordan
  //                         </div>
  //                         <div className="text-xs text-gray-400">Critic</div>
  //                       </div>
  //                     </div>
  //                   </div>

  {
    /* <div className="absolute top-10 left-4 bg-white rounded-xl px-3 py-2 shadow-md flex items-center gap-2 text-xs">
                      <div className="flex -space-x-2">
                        <img
                          src="https://via.placeholder.com/28"
                          className="w-6 h-6 rounded-full border-2 border-white"
                        />
                        <img
                          src="https://via.placeholder.com/28"
                          className="w-6 h-6 rounded-full border-2 border-white"
                        />
                        <img
                          src="https://via.placeholder.com/28"
                          className="w-6 h-6 rounded-full border-2 border-white"
                        />
                      </div>
                      <span>اطلب استشارتك الأن </span>
                      <button className="ml-2 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                        +
                      </button>
                    </div> */
  }

  //  <div className="bg-white p-3 rounded-xl shadow-lg  text-center ">
  //               <form
  //                 onSubmit={handleSubmit(onSubmit)}
  //                 className="flex flex-cols gap-3 "
  //               >
  //                 <Select
  //                   onValueChange={(value) => setValue("type", value)}
  //                   value={selectedType}
  //                 >
  //                   <SelectContent>
  //                     <SelectItem value="center">مركز</SelectItem>
  //                     <SelectItem value="therapist">مختص</SelectItem>
  //                   </SelectContent>
  //                   <SelectTrigger className="">
  //                     <SelectValue placeholder="المختص/المركز" />
  //                   </SelectTrigger>
  //                 </Select>
  //                 <Input type="" placeholder="الدولة" {...register("country")} />
  //                 <Input type="" placeholder="المدينة" {...register("city")} />
  //                 <Button type="submit">ابحث</Button>
  //                 <Button
  //                   type="submit"
  //                   variant="outline"
  //                   className="bg-white text-primary border-1-primary "
  //                 >
  //                   مسح
  //                 </Button>
  //               </form>
  //             </div>

  //   <section className="overflow-x-hidden">
  //   <div className=" relative w-screen h-screen bg-gradient-to-r from-primary to-secondary"> */

  //  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  //         {/* <Image src={logo} alt="logo" width={500} height={500}/> */}
  //         </div>

  //         <div className="absolute inset-0 flex flex-col items-center justify-center top-[70%] z-10">
  //           <div className="bg-white/40 p-5 rounded-xl shadow-lg ">
  //             <p className="font-bold mb-4 text-[#212121]">
  //               ابحث عن المختصين والمراكز التأهيلية بكل سهولة
  //             </p>
  //             <div className="bg-white p-3 rounded-xl shadow-lg  text-center ">
  //               <form
  //                 onSubmit={handleSubmit(onSubmit)}
  //                 className="flex flex-cols gap-3 "
  //               >
  //                 <Select
  //                   onValueChange={(value) => setValue("type", value)}
  //                   value={selectedType}
  //                 >
  //                   <SelectContent>
  //                     <SelectItem value="center">مركز</SelectItem>
  //                     <SelectItem value="therapist">مختص</SelectItem>
  //                   </SelectContent>
  //                   <SelectTrigger className="">
  //                     <SelectValue placeholder="المختص/المركز" />
  //                   </SelectTrigger>
  //                 </Select>
  //                 <Input type="" placeholder="الدولة" {...register("country")} />
  //                 <Input type="" placeholder="المدينة" {...register("city")} />
  //                 <Button type="submit">ابحث</Button>
  //                 <Button
  //                   type="submit"
  //                   variant="outline"
  //                   className="bg-white text-primary border-1-primary "
  //                 >
  //                   مسح
  //                 </Button>
  //               </form>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
}

{
  /* <section className="overflow-x-hidden"> */
}
{
  /* <div className=" relative w-screen h-screen bg-gradient-to-r from-primary to-secondary"> */
}
{
  /* <Image
          src={slider1}
          alt="slider1 image"
          className=" object-cover"
          fill
        /> */
}
{
  /* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Image src={logo} alt="logo" width={500} height={500}/>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center top-[75%] z-10">
          <div className="bg-white/40 p-5 rounded-xl shadow-lg ">
            <p className="font-bold mb-4 ">
              ابحث عن المختصين والمراكز التأهيلية بكل سهولة
            </p>
            <div className="bg-white p-3 rounded-xl shadow-lg  text-center ">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-cols gap-3 "
              >
                <Select
                  onValueChange={(value) => setValue("type", value)}
                  value={selectedType}
                >
                  <SelectContent>
                    <SelectItem value="center">مركز</SelectItem>
                    <SelectItem value="therapist">مختص</SelectItem>
                  </SelectContent>
                  <SelectTrigger className="">
                    <SelectValue placeholder="المختص/المركز" />
                  </SelectTrigger>
                </Select>
                <Input type="" placeholder="الدولة" {...register("country")} />
                <Input type="" placeholder="المدينة" {...register("city")} />
                <Button type="submit">ابحث</Button>
                <Button
                  type="submit"
                  variant="outline"
                  className="bg-white text-primary border-1-primary "
                >
                  مسح
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section> */
}

// const slides = [
//   {
//     image: "/images/home/slider1.jpg",
//     title: "نحو مستقبل صحي أفضل",
//     text: "نساعدك على الوصول إلى رعاية طبية متكاملة.",
//     button: "احجز الآن",
//   },
//   {
//     image: "/images/home/slider2.jpeg",
//     title: "رعاية طبية عالية الجودة",
//     text: "خبراء في تقديم الحلول الصحية الشاملة.",
//     button: "اكتشف المزيد",
//   },
//   {
//     image: "/images/home/slider3.jpeg",
//     title: "مستقبل الطب الحديث",
//     text: "نؤمن بأن كل مريض يستحق الأفضل.",
//     button: "تواصل معنا",
//   },
// ];
// const Searching = [
//   {
//     id: 1,
//     type: "center",
//     link: "#",
//   },
//   {
//     id: 2,
//     type: "therapist",
//     link: "#",
//   },
// ];

// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import { Pagination, Autoplay } from "swiper/modules";

// <Swiper
//         modules={[Pagination, Autoplay]}
//         slidesPerView={1}
//         pagination={{ clickable: true }}
//         autoplay={{
//           delay: 3000,
//           disableOnInteraction: false,
//         }}
//         loop={true}
//         className="w-full h-full"
//       >
//         {slides.map((slide, index) => (
//           <SwiperSlide key={index}>
//             <div
//               className="relative w-full h-full"
//               style={{ backgroundImage: `url(${slide.image})` }}
//             ></div>
//             <div className="absolute inset-0 flex items-center justify-center top-105">
//               <div className="bg-white/40 p-5 rounded-xl shadow-lg ">
//                 <p className="font-bold mb-4 ">
//                   ابحث عن المختصين والمراكز التأهيلية بكل سهولة
//                 </p>
//                 <div className="bg-white p-3 rounded-xl shadow-lg  text-center">
//                   <form
//                     onSubmit={handleSubmit(onSubmit)}
//                     className="flex flex-cols gap-3 "
//                   >
//                     {/* <Input
//                       type=""
//                       placeholder="المختص/المركز"
//                       {...register("type")}
//                     /> */}
//                     <Select
//                       onValueChange={(value) => setValue("type", value)}
//                       value={selectedType}
//                     >
//                       <SelectContent>
//                         <SelectItem value="center">مركز</SelectItem>
//                         <SelectItem value="therapist">مختص</SelectItem>
//                       </SelectContent>
//                       <SelectTrigger className="">
//                         <SelectValue placeholder="المختص/المركز" />
//                       </SelectTrigger>

//                     </Select>
//                     <Input
//                       type=""
//                       placeholder="الدولة"
//                       {...register("country")}
//                     />
//                     <Input
//                       type=""
//                       placeholder="المدينة"
//                       {...register("city")}
//                     />
//                     <Button type="submit">ابحث</Button>
//                     <Button
//                       type="submit"
//                       variant="outline"
//                       className="bg-white text-primary border-1-primary "
//                     >
//                       مسح
//                     </Button>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
