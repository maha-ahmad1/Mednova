"use client"
import HomeSections from "@/features/home";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log("isCompleted", session?.isCompleted);
  return (
    <div className=" ">
      <HomeSections />
    </div>
  );
}
