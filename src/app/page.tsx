"use client"
import { useSession } from "next-auth/react";
import HomeSections from "@/features/home/ui";


export default function Home() {
  const { data: session } = useSession();
  console.log("isCompleted", session?.isCompleted);
  return (
    <div className=" ">
      <HomeSections />
    </div>
  );
}
