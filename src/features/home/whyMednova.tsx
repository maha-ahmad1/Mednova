"use client";
import Image from "next/image";
import whyMednova from "../../../public/images/home/whyMednova.jpg";
export default function WhyMednova() {
  return (
    <section className=" bg-[#F8F7F7] py-20 px-14 md:px-18 lg:px-28 ">
      <div className="grid  grid-cols-1 gap-10 md:grid-cols-[2fr_1fr]">
        <div className=" order-2 md:order-none flex flex-col mt-20 w-[80%] text-center md:text-start mx-auto md:mx-0">
          <div className="text-2xl font-bold  p-2">
            لماذا منصة مدنوفا؟
          </div>
           <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mb-2 mx-auto md:mx-0"></div>
          <p className="text-[#4B5563] text-lg  leading-8">
            منصة مدنوفا تضع رعايتك في المقدمة، فهي تجمع بين التخصص الدقيق في
            العلاج الطبيعي والخدمات الذكية المصممة لراحتك، من الحجز السريع، إلى
            الاستشارات الفورية، والملف الصحي الذكي، لتمنحك تجربة علاجية متكاملة
            وسهلة في متناولك.
          </p>
        </div>
        <div className=" order-1 md:order-none relative border-3 border-primary rounded-2xl w-full max-w-[350px] h-[440px] md:h-[440px]">
          <Image
            src={whyMednova}
            alt="why Mednova"
            className="absolute rounded-xl right-6 top-1 object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
