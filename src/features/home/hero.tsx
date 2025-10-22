"use client";
import homeImage from "../../../public/images/home/homeImage.jpg";
import Image from "next/image";
import { useState, useEffect } from "react";
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
        slidesPerView={1}
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
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}


