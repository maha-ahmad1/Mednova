"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { MessageSquareIcon, VideoIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <>
      <LandingNavbar />

      <section className="bg-[#F8F7F7] py-30 px-5 md:px-16 lg:px-28 min-h-screen">
        <div className="flex flex-col md:flex-row gap-5 justify-center flex-wrap">
          {data?.data && data.data.length > 0 ? (
            data?.data?.map((data: TypeItem) => {
              return (
                <div
                  key={data.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Image
                    src="/images/home/therapist.jpg"
                    alt="therapist"
                    className="w-full h-48 object-cover"
                    width={100}
                    height={100}
                  />
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
              );
            })
          ) : (
            <p className="text-gray-500 text-center w-full mt-10 text-lg font-medium">
              لا يوجد نتائج
            </p>
          )}
        </div>
      </section>
    </>
  );
}
