"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";

import therapist from "../../../public/images/home/therapist.jpg";

type TypeItem = {
  id: number;
  full_name: string;
};

export default function SearchResults() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const country = searchParams.get("country");
  const city = searchParams.get("city");

  const { data, isLoading, error } = useQuery({
    queryKey: ["SearchResults", type, country, city],
    queryFn: async () => {
      try {
        const token = session?.accessToken;

        const res = await axios.get(
          `https://demoapplication.jawebhom.com/api/customer/service-provider/search`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              type,
              country,
              city,
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
    enabled: !!type && !!country && !!city,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;
  return (
    <section className="bg-[#F8F7F7] py-30 px-5 md:px-16 lg:px-28 min-h-screen">
      <div className="flex flex-col md:flex-row gap-5 justify-center flex-wrap">
        {data?.data && data.data.length > 0 ? (
          data?.data?.map((item: TypeItem) => (
            <div
              key={data.id}
              className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-gradient-to-r from-secondary to-primary px-6 py-4 border-b border-blue-200">
                <div className="flex justify-between items-center">
                  <span className=""></span>
                </div>
              </div>
              <Image
                src={therapist}
                alt="therapist"
                className="w-full h-48 object-cover"
              />
              <div className="text-[#4B5563]  mt-2 text-start mx-3">
                <p className="text-lg font-medium text-gray-700 text-center">
                  {item.full_name}
                </p>
                <p className="text-xs text-center">
                  {/* {data.therapist_details.university_name} */}
                </p>

                {/* <div className="flex flex-row justify-between">
                                <p className="text-xs text-center">
                                  {data.therapist_details.countries_certified}
                                </p>
            
                                <p className="text-xs text-center">
                                  {data.therapist_details.university_name}
                                </p>
                              </div> */}
              </div>
              {/* <div className="text-center py-3 m-5 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-sm text-secondary">
                                {data.therapist_details.medical_specialties.description}
                              </p>
                            </div> */}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full mt-10 text-lg font-medium">
            لا يوجد نتائج
          </p>
        )}
      </div>
    </section>
  );
}
