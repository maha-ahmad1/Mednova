"use client";
import homeImage from "../../../public/images/home/homeImage.jpg";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

 const slides = [
    {
      image: "/images/home/homeImage.jpg",
      title: "نحو مستقبل صحي أفضل",
      text: "نساعدك على الوصول إلى رعاية طبية متكاملة.",
      button: "احجز الآن",
    },
    {
      image: "/images/home/homeImage.jpg",
      title: "رعاية طبية عالية الجودة",
      text: "خبراء في تقديم الحلول الصحية الشاملة.",
      button: "اكتشف المزيد",
    },
    {
      image: "/images/home/homeImage.jpg",
      title: "مستقبل الطب الحديث",
      text: "نؤمن بأن كل مريض يستحق الأفضل.",
      button: "تواصل معنا",
    },
  ];

export default function Hero() {
   

  return (
        <section className="relative w-full h-screen">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1} // ✅ الصورة بتكون واحدة فقط
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-2xl">
                  {slide.text}
                </p>
                <button className="bg-primary hover:bg-primary/80 transition px-6 py-3 rounded-full text-white font-medium">
                  {slide.button}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}


// منصة مدنوفا تضع رعايتك في المقدمة، فهي تجمع بين التخصص الدقيق في العلاج الطبيعي والخدمات الذكية المصممة لراحتك، من الحجز السريع، إلى الاستشارات الفورية، والملف الصحي الذكي، لتمنحك تجربة علاجية متكاملة وسهلة في متناولك.



// احجز موعدك بخطوات سهلة وسريعة، مع نظام حجز ذكي يتيح لك اختيار المختص المناسب والوقت الأنسب لك بكل مرونة.
// احصل على استشارة علاج طبيعي مباشرة من مختصين مؤهلين، في أي وقت تحتاج فيه للدعم أو التوجيه السريع.
// فيديوهات متخصصة في تمارين العلاج الطبيعي والتقنيات الصحيحة، تساعدك على التعافي ومتابعة حالتك من المنزل بسهولة.
// ملف صحي ذكي يُسجل حالتك وتطورك أولًا بأول، مع إمكانية المتابعة المستمرة من المختصين لتحسين نتائج العلاج.
// تواصل دائم مع المختصين لمتابعة حالتك، وضمان التقدم في العلاج بخطة مرنة ومناسبة لحاجتك الفردية.
// نوصلك بأقرب مراكز التأهيل وأخصائيي العلاج الطبيعي حسب موقعك، لتبدأ رحلة التعافي بسهولة وفي المكان الأنسب لك.




{/* <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h1 className="text-[var(--primary)] text-5xl font-bold mb-4">
            مرحبا بكم في منصتنا
          </h1>
          <p className="text-[var(--foreground)] text-lg mb-6">
            اكتشف المزايا والخدمات المميزة التي نقدمها لك.
          </p>
          <button className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:brightness-90 transition">
            ابدأ الآن
          </button>
        </div>
        <div className="flex-1">
          {/* <img src="/hero-image.png" alt="Hero" className="w-full" /> */}
       
