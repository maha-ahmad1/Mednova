"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import therapist from "../../../public/images/home/therapist.jpg";
import { MessageSquareIcon, VideoIcon, StarIcon } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
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

export default function MostRatedProfessionals() {
  const { data: session, status } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["mostRatedProfessionals"],
    queryFn: async () => {
      try {
        const token = session?.accessToken;

        const res = await axios.get(
          "https://demoapplication.jawebhom.com/api/rating?typeServiceProvider=therapist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
   const items = data?.data?.slice(0, 4) || [];


  return (
    <section className=" py-20 px-14 md:px-18 lg:px-28">
      <div className="flex flex-col gap-7  mx-auto text-center">
        <div className="  max-w-[400] flex flex-col mx-auto ">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">المختصون الأكثر تقييما</h1>
          {/* <div className=" w-20 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mb-2  mx-auto"></div> */}
        </div>
        {status === "loading" || isLoading  ? (
          <p className="text-gray-500 text-center">جاري التحميل...</p>
        ) : error ? (
          <p className="text-red-500 text-center">حدث خطأ في تحميل البيانات</p>
        ) : (
        <div className=" flex flex-col md:flex-row gap-5 justify-center">
          {items.map((data: TypeItem) => {
            return (
              <div
                key={data.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* <div className="bg-primary/60 px-6 py-4 border-b border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className=""></span>
                    <p className="text-sm text-white bg-red-500 rounded-sm flex flex-row gap-1 items-center px-2.5 py-0 h-6">
                      {Number(data.average_rating).toFixed(1) || 0}
                      <StarIcon className="fill-white w-4 h-4" />
                    </p>
                  </div>
                </div> */}
                <Image src={therapist} alt="therapist" className="" />
                <div className="text-[#4B5563]  mt-2 text-start mx-3">
                  <div></div>
                  <div className="mb-4">
                    <div className="flex flex-row justify-between text-lg font-medium text-gray-700 text-center">
                      <p>{data.full_name}</p>
                      <p className="text-sm text-red-600 font-medium rounded-sm flex flex-row gap-1 items-center px-2.5 py-0 h-6">
                        {Number(data.average_rating).toFixed(1) || 0}
                        <StarIcon className="fill-red-600 w-4 h-4" />
                      </p>
                    </div>
                    <p className="text-xs text-start">
                      {data.therapist_details?.university_name}
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
          })}
        </div>
        )}
      </div>
    </section>
  );
}


  {/* <DialogFooter className="flex mx-auto">
                      <Button>تأكيد</Button>
                    </DialogFooter> */}

                    
  {/* <div className="text-center py-3 m-5 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-secondary">
                    {data.therapist_details.medical_specialties.description}
                  </p>
                </div> */}

                {/* <div className="flex  flex-row justify-center gap-5 mt-5 m-5">
                  <div className=" bg-gray-100 rounded-full  p-2.5  ">

                    <MessageSquareIcon className=" text-secondary " />
                  </div>
                  <div className=" bg-gray-100 rounded-full  p-2.5  ">

                    <VideoIcon className="  text-secondary" />
                  </div>
                </div> */}

                {/* <div className="p-2 flex  items-center justify-center gap-3  bg-gray-50 rounded-lg border border-gray-200 mx-auto w-[65%] m-5">
                  <p className="text-sm text-secondary font-medium">
                    تحدث الأن{" "}
                  </p>

                  <ul className="flex flex-row gap-3">
                    <li className="   rounded-full  text-secondary ">
                      <MessageSquareIcon className="" />
                    </li>
                    <li className="  rounded-full text-gray-400">
                      <VideoIcon className="" />
                    </li>
                  </ul>
                </div> */}




// {data?.data?.slice(0, 4).map((data: TypeItem) => {
//           return (
//             <Card
//               className=" pt-0 max-w-sm  bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//               key={data.id}
//             >
//               <CardHeader className="p-0">
//                 <CardTitle className="m-0 ">
//                   <div className="bg-gradient-to-r from-secondary to-primary px-6 py-4 border-b border-blue-200">
//                     <div className="flex justify-between items-center">
//                       <span className=""></span>
//                       <p className="text-sm text-white bg-red-500 rounded-sm flex flex-row gap-1 items-center px-2.5 py-0 h-6">
//                         {Number(data.average_rating).toFixed(1) || 0}
//                         <StarIcon className="fill-white w-4 h-4" />
//                       </p>
//                     </div>
//                   </div>
//                   <Image src={therapist} alt="therapist" className="" />
//                   <div className="text-[#4B5563]  mt-2 text-start mx-3">
//                     <h3 className="text-lg font-medium text-gray-600 text-center">
//                       {data.full_name}
//                     </h3>
//                   </div>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="">
//                 <CardDescription className="text-[#1F6069] font-bold m-0 pb-5">
//                   <div className="text-center py-5 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-sm text-secondary">
//                       {data.therapist_details.medical_specialties.description}
//                     </p>
//                   </div>
//                 </CardDescription>
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button
//                       variant={"default"}
//                       size={"lg"}
//                       className="bg-gradient-to-r from-secondary to-primary"
//                     >
//                       طلب استشارة{" "}
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="sm:max-w-3xs">
//                     <DialogHeader>
//                       <DialogTitle className="text-center mt-5 pb-3">
//                         اطلب استشارتك الأن
//                       </DialogTitle>
//                       {/* <DialogDescription>
//                       </DialogDescription> */}
//                     </DialogHeader>
//                     <div className=" pr-3 pb-3">
//                       <ul className="flex flex-row justify-center gap-3">
//                         <li className="  bg-[#F8F7F7] rounded-full p-2 text-blue-400">
//                           <MessagesSquareIcon />
//                         </li>
//                         <li className=" bg-[#F8F7F7] rounded-full p-2 text-red-800">
//                           <VideoIcon />
//                         </li>
//                       </ul>
//                     </div>
//                     {/* <DialogFooter className="flex mx-auto">
//                       <Button>تأكيد</Button>
//                     </DialogFooter> */}
//                   </DialogContent>
//                 </Dialog>
//               </CardContent>
//             </Card>
//           );
//         })}

{
  /*  */
}

//                 <div className=" flex flex-col md:flex-row gap-5 justify-center">
//   {data?.data?.slice(0, 4).map((data: TypeItem) => {
//     return (
//       <div
//         key={data.id}
//         className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//       >
//         <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
//           <div className="flex justify-between items-center">
//             <span className="text-blue-800 font-semibold text-lg">
//               Psychologist
//             </span>
//             <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
//               Available Today
//             </span>
//           </div>
//         </div>

//         <div className="p-6 space-y-4">
//           <h3 className="text-xl font-bold text-gray-900 text-center">
//             Dr. Michael Brown
//           </h3>
//           <div className="space-y-2">
//             <div className="flex items-center gap-2 text-gray-600">
//               <i className="fas fa-map-marker-alt text-blue-500 w-4 h-4"></i>
//               <span className="text-sm">Minneapolis, MN</span>
//             </div>
//             <div className="flex items-center gap-2 text-gray-600">
//               <i className="fas fa-clock text-blue-500 w-4 h-4"></i>
//               <span className="text-sm">+ 30 Min</span>
//             </div>
//           </div>
//           <div className="text-center py-3 bg-gray-50 rounded-lg border border-gray-200">
//             <p className="text-sm text-gray-600">Computation Fees</p>
//             <p className="text-2xl font-bold text-blue-600">$650</p>
//           </div>
//           <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md">
//             Block Now
//           </button>
//         </div>
//       </div>
//     );
//   })}
// </div>
