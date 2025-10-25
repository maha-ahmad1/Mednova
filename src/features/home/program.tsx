import Image from "next/image";
import smartGloves from "../../../public/images/home/smartGloves.png";
export default function Program() {
  return (
    <section className=" bg-white py-20 px-14 md:px-18 lg:px-28 ">
      <div className=" max-w-[500] flex flex-col mx-auto ">
        <h1 className="text-2xl font-bold  p-2 mx-auto ">
          برامجنا التأهيلية الأكثر طلبا
        </h1>
        <div className=" w-20 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mb-2  mx-auto"></div>
        <p className="text-center text-[#4B5563] text-lg leading-7">
          مصممة لعلاج الحالات الشائعة بتمارين دقيقة وأساليب حديثة، تساعد على
          تحسين الحركة وتخفيف الألم بإشراف مختصين.
        </p>
      </div>
    </section>
  );
}
