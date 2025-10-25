"use client";
// import slider1 from "../../../public/images/home/slider1.jpg";
// import slider2 from "../../../public/images/home/slider2.jpeg";
// import slider3 from "../../../public/images/home/slider3.jpeg";

// import Image from "next/image";
// import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import slider1 from "../../../public/images/home/slider1.jpg";

const slides = [
  {
    image: "/images/home/slider1.jpg",
    title: "نحو مستقبل صحي أفضل",
    text: "نساعدك على الوصول إلى رعاية طبية متكاملة.",
    button: "احجز الآن",
  },
  {
    image: "/images/home/slider2.jpeg",
    title: "رعاية طبية عالية الجودة",
    text: "خبراء في تقديم الحلول الصحية الشاملة.",
    button: "اكتشف المزيد",
  },
  {
    image: "/images/home/slider3.jpeg",
    title: "مستقبل الطب الحديث",
    text: "نؤمن بأن كل مريض يستحق الأفضل.",
    button: "تواصل معنا",
  },
];

interface SearchingData {
  type: string;
  country: string;
  city: string;
}
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

export default function Hero() {
  const { setValue, watch, register, handleSubmit } = useForm<SearchingData>();
  const onSubmit = (data: SearchingData) => {
    console.log(data);
  };
  const selectedType = watch("type");
  return (
    <section className="overflow-x-hidden">
      <div className=" relative w-screen h-screen">
        <Image
          src={slider1}
          alt="slider1 image"
          className=" object-cover"
          fill
        />
        <div className="absolute inset-0 flex items-center justify-center top-105">
          <div className="bg-white/40 p-5 rounded-xl shadow-lg ">
            <p className="font-bold mb-4 ">
              ابحث عن المختصين والمراكز التأهيلية بكل سهولة
            </p>
            <div className="bg-white p-3 rounded-xl shadow-lg  text-center z-50">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-cols gap-3 "
              >
                {/* <Input
                      type=""
                      placeholder="المختص/المركز"
                      {...register("type")}
                    /> */}
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
    </section>
  );
}




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

