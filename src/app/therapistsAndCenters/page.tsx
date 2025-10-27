"use client";
import { useState } from "react";

import Image from "next/image";
import therapist from "../../../public/images/home/therapist.jpg";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";

type TypeItem = {
  id: number;
  full_name: string;
};

export default function TherapistsAndCenters() {
  const [selected, setSelected] = useState<"therapist" | "center">("therapist");
  const { data: session } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["serviceProviders", selected],
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
              type: selected,
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
    enabled: !!session?.accessToken && !!selected,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <section className="bg-[#F8F7F7] py-30 px-5 md:px-16 lg:px-28">
      <div className="flex flex-col ">
        <div className=" bg-white shadow-md  flex flex-row gap-10  justify-between mb-6 p-5 rounded-md">
          <div className="flex flex-row justify-center items-center gap-10 w-full" >
            <div className="flex-1 max-w-3xl">
          <Input type="" placeholder="ابحت عن المختصين والمراكز التأهيلية ...." className="w-full h-12 text-xl px-6 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary" />
          </div>
            <div className="flex gap-6 ">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="therapist"
                  checked={selected === "therapist"}
                  onChange={() => setSelected("therapist")}
                  className=" w-4 h-4 hidden peer"
                />
                  <div className="w-4 h-4 rounded-full border-2 border-primary peer-checked:bg-primary transition-all"></div>
                <span className="text-md font-medium text-gray-700">المختصون</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="center"
                  checked={selected === "center"}
                  onChange={() => setSelected("center")}
                  className="w-4 h-4 hidden peer"
                />
                <div className="w-4 h-4 rounded-full border-2 border-primary peer-checked:bg-primary transition-all"></div>
                <span className="text-md font-medium text-gray-700">المراكز التأهيلية</span>
              </label>
            </div>
          </div>
        </div>
        <div className=" bg-white shadow-md  mb-6 p-5 py-10 rounded-md">
          <div className="flex flex-col md:flex-row gap-5 flex-wrap justify-center">
            {data?.data?.map((data: TypeItem) => {
              return (
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
                      {data.full_name}
                    </p>
                    <p className="text-xs text-center">
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

