import Image from "next/image";
import smartGloves from "../../../public/images/home/smartGloves.png";
export default function SmartGlove() {
  return (
    <section className=" bg-[#F8F7F7] py-20 px-14 md:px-18 lg:px-28 ">
      <div className="grid  grid-cols-1 gap-10 md:grid-cols-2">
        <div className=" order-2 md:order-none flex flex-col mt-20 ">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            القفاز الذكي من مدنوفا
          </h1>

          {/* <h2 className="text-xl font-medium text-[#31353b]bp-2">
            {" "}
            استعد مرونة يدك مع قفاز إعادة التأهيل الذكي
          </h2> */}
          {/* <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mb-2 mx-auto md:mx-0"></div> */}

          <p className="text-[#4B5563] text-lg  leading-8">
            إذا كنت تبحث عن قفازات طبية يعيد لك القدرة على استخدام يدك بشكل
            تدريجي، فهذا المنتج يجمع بين الراحة والكفاءة. بدلاً من الاعتماد فقط
            على العلاج الطبيعي التقليدي، يمكنك الاستفادة من هذا الجهاز الذكي في
            المنزل مع نتائج ملموسة.
          </p>
        </div>
        <div className=" order-1 md:order-none  w-full ">
          <Image
            src={smartGloves}
            alt="why Mednova"
            className=" w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
