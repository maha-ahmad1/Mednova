"use client";

import Image from "next/image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import therapist from "../../../public/images/home/therapist.jpg";
import { StarIcon } from "lucide-react";

type TypeItem = {
  id: number;
  title: string;
  image: string;
  price: number;
  description: string;
  ratings_avg_rating: string;
  // therapist_details: TherapistDetails;
  total_reviews: number;
  average_rating: number;
};
export default function Program() {
  const { data: session, status } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["getTopEnrolledProgram"],
    queryFn: async () => {
      try {
        const token = session?.accessToken;

        const res = await axios.get(
          "https://demoapplication.jawebhom.com/api/programs/show/get-top-enrolled-program",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 3,
            },
          }
        );

        console.log("✅ API Response:", res.data);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("API Error:", err.response?.data || err.message);
        } else {
          console.error("Unexpected Error:", err);
        }
        throw err;
      }
    },
    enabled: status === "authenticated",
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            برامجنا التأهيلية الأكثر طلبًا
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            مصممة لعلاج الحالات الشائعة بتمارين دقيقة وأساليب حديثة تساعد على
            تحسين الحركة وتخفيف الألم بإشراف مختصين.
          </p>
        </div>

        <div className="space-y-6">
          {status === "loading" || isLoading ? (
            <p className="text-gray-500 text-center">جاري التحميل...</p>
          ) : error ? (
            <p className="text-red-500 text-center">
              حدث خطأ في تحميل البيانات
            </p>
          ) : (
            <div className="flex flex-col items-start p-4  ">
              {data?.data?.map((data: TypeItem) => {
                return (
                  <div
                    className="flex flex-row bg-gray-50 mb-5  rounded-lg w-full"
                    key={data.id}
                  >
                    <div className=" w-full md:w-40 mt-4 md:mt-0 md:ml-4 ">
                      <Image
                        src={therapist}
                        alt="therapist"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="py-3 flex-1 space-y-2">
                      <h3 className="text-gray-800 font-semibold">
                        {data.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {data.description}
                      </p>
                      <button className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition">
                        طلب
                      </button>
                    </div>
                    <div className="p-3 flex gap-4 text-sm  text-gray-500">
                      <span >⏱ 45-30 دقيقة</span>
                      <span>🧩 6 جلسات</span>
                      <span className="text-sm    flex flex-row gap-1   py-0 h-6">
                        <StarIcon className="fill-red-600 text-red-600 w-4 h-4" />
                        {Number(data.ratings_avg_rating).toFixed(1) || 0}
                      </span>
                      <span>$ {data.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="text-center ">
          <a href="#" className="text-teal-600 font-medium hover:underline">
            عرض المزيد
          </a>
        </div>
      </div>
    </section>
  );
}
