"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import therapist from "../../../public/images/home/therapist.jpg";
import { MessagesSquareIcon, VideoIcon } from "lucide-react";

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

type TypeItem = {
  id: number;
  full_name: string;
};

export default function MostRatedProfessionals() {
  const { data: session } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["mostRatedProfessionals"],
    queryFn: async () => {
      try {
        const token = session?.accessToken; 

        const res = await axios.get(
          "https://demoapplication.jawebhom.com/api/customer/service-provider/search?type=therapist",
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
    enabled: !!session?.accessToken, 
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <section className=" py-20 px-14 md:px-18 lg:px-28">
      <div className="flex flex-col gap-7  mx-auto text-center">
        <div className="  max-w-[400] flex flex-col mx-auto ">
          <h1 className="text-2xl font-bold  p-2">المختصون الأكثر تقييما</h1>
          <div className=" w-20 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mb-2  mx-auto"></div>
        </div>
        <div className=" flex flex-col md:flex-row gap-5 justify-center">
          {data?.data?.slice(0, 4).map((data: TypeItem) => {
            return (
              <Card className=" pt-0 max-w-sm bg-[#F8F7F7]" key={data.id}>
                <CardHeader className="p-0">
                  <CardTitle className="m-0">
                    <Image
                      src={therapist}
                      alt="therapist"
                      className="rounded-t-lg"
                    />
                    <p className="text-[#4B5563] font-medium mt-2 text-start mx-3">
                      {data.full_name}
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent className="">
                  <CardDescription className="text-[#4B5563] font-bold m-0 p-0"></CardDescription>
                  <Dialog >
                    <DialogTrigger asChild>
                      <Button variant={"default"} size={"lg"}>
                        طلب استشارة{" "}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xs">
                      <DialogHeader>
                        <DialogTitle className="text-center mt-5 pb-3">اطلب استشارتك الأن</DialogTitle>
                        {/* <DialogDescription>
                        </DialogDescription> */}
                      </DialogHeader>
                      <div className=" pr-3 pb-3">
                        <ul className="flex flex-row justify-center gap-3">
                          <li className="  bg-[#F8F7F7] rounded-full p-2 text-blue-400"><MessagesSquareIcon /></li>
                          <li className=" bg-[#F8F7F7] rounded-full p-2 text-red-800">< VideoIcon/></li>
                        </ul>
                      </div>
                      {/* <DialogFooter className="flex mx-auto">
                        <Button>تأكيد</Button>
                      </DialogFooter> */}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="div">

         

        </div>
      </div>
    </section>
  );
}

const ServicesCard = [
  {
    id: 1,
    title: "حجز ذكي",
    details:
      "احجز موعدك بخطوات سهلة وسريعة، مع نظام حجز ذكي يتيح لك اختيار المختص المناسب والوقت الأنسب لك بكل مرونة.",
  },
  {
    id: 2,
    title: "استشارة فورية",
    details:
      "احصل على استشارة علاج طبيعي مباشرة من مختصين مؤهلين، في أي وقت تحتاج فيه للدعم أو التوجيه السريع.",
  },
  {
    id: 3,
    title: "فيديوهات تعليمية",
    details:
      "فيديوهات متخصصة في تمارين العلاج الطبيعي والتقنيات الصحيحة، تساعدك على التعافي ومتابعة حالتك من المنزل بسهولة.",
  },
  {
    id: 4,
    title: "ملف صحي",
    details:
      "ملف صحي ذكي يُسجل حالتك وتطورك أولًا بأول، مع إمكانية المتابعة المستمرة من المختصين لتحسين نتائج العلاج.",
  },
];

//   const { data: session, status } = useSession();
//     console.log(session?.accessToken)

//    
//  const { data, isLoading, error } = useQuery({
//     queryKey: ["mostRatedProfessionals"],
//     queryFn: async () => {
//   try {
//     const res = await axios.get("https://demoapplication.jawebhom.com/api/customer/service-provider/search?type=therapist");
//     console.log("✅ API Response:", res.data);
//     return res.data;
//   } catch (err: unknown) {
//   if (axios.isAxiosError(err)) {
//     console.error("API Error:", err.response?.data || err.message);
//   } else {
//     console.error("Unexpected Error:", err);
//   }
//   throw err;
// }
// },
//   });
//  
//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading data</p>;

// async () => {
//       const res = await axios.get("https://demoapplication.jawebhom.com/api/customer/service-provider/search?type=therapist");
//       return res.data;
//     },
