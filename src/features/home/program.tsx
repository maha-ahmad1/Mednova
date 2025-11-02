import Image from "next/image";
export default function Program() {
  return (
    <section className=" bg-white py-20 px-14 md:px-18 lg:px-28 ">
      <div className=" max-w-[500] flex flex-col mx-auto ">
        <h1 className="text-2xl font-bold  p-2 mx-auto text-[#212121]">
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




// <section className="py-16 bg-white">
//   <div className="max-w-6xl mx-auto px-4">
//     <div className="text-center mb-10">
//       <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
//         برامجنا التأهيلية الأكثر طلبًا
//       </h2>
//       <p className="text-gray-600 max-w-2xl mx-auto">
//         مصممة لعلاج الحالات الشائعة بتمارين دقيقة وأساليب حديثة تساعد على تحسين الحركة وتخفيف الألم بإشراف مختصين.
//       </p>
//     </div>

//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row items-start md:items-center bg-gray-50 p-4 rounded-lg shadow-sm">
//         <div className="flex-1 space-y-2">
//           <div className="flex gap-4 text-sm text-gray-500">
//             <span>⏱ 45-30 دقيقة</span>
//             <span>🧩 6 جلسات</span>
//             <span>⭐ 4.7/5</span>
//           </div>
//           <h3 className="text-gray-800 font-semibold">
//             "قوة الحركة" سلسلة تمارين علاجية لمفصل الركبة
//           </h3>
//           <p className="text-sm text-gray-400">رقم البرنامج: 05213</p>
//           <button className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition">
//             طلب
//           </button>
// [8:05 PM, 11/2/2025] ChatGPT: </div>

//         <div className="w-full md:w-40 mt-4 md:mt-0 md:ml-4 relative">
//           <img
//             src="program-thumbnail.jpg"
//             alt="برنامج"
//             className="rounded-lg w-full h-auto object-cover"
//           />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <button className="bg-white p-2 rounded-full shadow-md">
//               ▶️
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* يمكن تكرار نفس العنصر حسب الحاجة */}
//     </div>

//     <div className="text-center mt-8">
//       <a href="#" className="text-teal-600 font-medium hover:underline">
//         عرض المزيد
//       </a>
//     </div>
//   </div>
// </section>
