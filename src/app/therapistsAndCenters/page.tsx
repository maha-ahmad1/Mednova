"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MessageSquareIcon, VideoIcon, StarIcon } from "lucide-react";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import LandingNavbar from "@/components/ui/LandingNavbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


type MedicalSpecialties = {
  id: number;
  name: string;
  description: string;
};
type TherapistDetails = {
  id: number;
  medical_specialties: MedicalSpecialties;
  university_name: string;
  countries_certified: string;
};
type TypeItem = {
  id: number;
  full_name: string;
  image: string;
  therapist_details: TherapistDetails;
  total_reviews: number;
  average_rating: number;
};

export default function TherapistsAndCenters() {
  const [selected, setSelected] = useState<"therapist" | "center">("therapist");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: session } = useSession();

   useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["serviceProviders", selected, debouncedSearch],
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
              full_name: debouncedSearch
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

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error loading data</p>;

  return (
    <>
      <LandingNavbar />
      <section className="bg-[#F8F7F7] py-30 px-5 md:px-16 lg:px-28">
        <div className="flex flex-col ">
          <div className=" bg-white shadow-md  flex flex-row gap-10  justify-between mb-6 p-5 rounded-md">
            <div className="flex flex-row justify-center items-center gap-10 w-full">
              <div className="flex-1 max-w-3xl">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="first_name"
                  placeholder="ابحت عن المختصين والمراكز التأهيلية ...."
                  className="w-full h-12 text-xl px-6 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                />
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
                  <span className="text-md font-medium text-gray-700">
                    المختصون
                  </span>
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
                  <span className="text-md font-medium text-gray-700">
                    المراكز التأهيلية
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className=" bg-white shadow-md  mb-6 p-5 py-10 rounded-md">
            <div className=" flex flex-col md:flex-row gap-5 justify-center flex-wrap">
              {data?.data?.length === 0 ? (
                <p className="w-full text-center">لا توجد نتائج</p>
              ) : ( 
                data?.data?.map((data: TypeItem) => {
                return (
                  <div
                    key={data.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
      
                    <Image src={"/images/home/therapist.jpg"} alt="therapist" className="w-full h-48 object-cover" width={100} height={100} />
                    <div className="text-[#4B5563]  mt-2 text-start mx-3">
                      <div></div>
                      <div className="mb-4">
                        <div className="flex flex-row justify-between text-lg font-medium text-gray-700 text-center">
                          <p>{data.full_name}</p>
                          <p className="text-sm text-red-600 font-medium rounded-sm flex flex-row gap-1 items-center px-2.5 py-0 h-6">
                            {Number(data.average_rating)?.toFixed(1) || 0}
                            <StarIcon className="fill-red-600 w-4 h-4" />
                          </p>
                        </div>
                        <p className="text-xs text-start">
                           {data.therapist_details?.university_name || "-"}
                        </p>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="text-center py-3 m-5 ">
                          <Button
                            variant={"default"}
                            size={"lg"}
                            className="bg-primary"
                          >
                            طلب استشارة{" "}
                          </Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-3xs">
                        <DialogHeader>
                          <DialogTitle className="text-center mt-5 pb-3">
                            اطلب استشارتك الأن
                          </DialogTitle>
                        </DialogHeader>
                        <div className=" pr-3 pb-3">
                          <ul className="flex flex-row justify-center gap-3">
                            <li className="  bg-[#F8F7F7] rounded-full p-2 text-blue-400">
                              <MessageSquareIcon />
                            </li>
                            <li className=" bg-[#F8F7F7] rounded-full p-2 text-red-800">
                              <VideoIcon />
                            </li>
                          </ul>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )})
              )}

            </div>
          </div>
        </div>
      </section>
    </>
  );
}


              {/* <div className="bg-primary/60 px-6 py-4 border-b border-blue-200">
                              <div className="flex justify-between items-center">
                                <span className=""></span>
                                <p className="text-sm text-white bg-red-500 rounded-sm flex flex-row gap-1 items-center px-2.5 py-0 h-6">
                                  {Number(data.average_rating).toFixed(1) || 0}
                                  <StarIcon className="fill-white w-4 h-4" />
                                </p>
                              </div>
                            </div> */}

                            
// <div className="flex flex-col md:flex-row gap-5 flex-wrap justify-center">
//             {data?.data?.map((data: TypeItem) => {
//               return (
//                 <div
//                   key={data.id}
//                   className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                 >
//                   <div className="bg-gradient-to-r from-secondary to-primary px-6 py-4 border-b border-blue-200">
//                     <div className="flex justify-between items-center">
//                       <span className=""></span>
//                     </div>
//                   </div>
//                   <Image
//                     src={therapist}
//                     alt="therapist"
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="text-[#4B5563]  mt-2 text-start mx-3">
//                     <p className="text-lg font-medium text-gray-700 text-center">
//                       {data.full_name}
//                     </p>
//                     <p className="text-xs text-center"></p>

//                   </div>

//                 </div>
//               );
//             })}
//           </div>
