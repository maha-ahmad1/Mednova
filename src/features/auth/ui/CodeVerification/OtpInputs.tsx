"use client";

import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
export function OtpInputs() {
  const [otp, setOtp] = useState(""); 

  return (
    <div className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent  mt-14">
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground ">
          تأكيد الرمز
        </div>
        <div className="">
          أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
        </div>
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-center">
        <form className="space-y-5  mt-[-20px]">
          <div className="flex justify-center" dir="ltr">
            <InputOTP maxLength={4} value={otp} onChange={setOtp}>
              <InputOTPGroup className="flex justify-center border-1 rounded-xl">
                {[0, 1, 2, 3].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className={`w-16 h-16 text-lg font-bold text-center border-1 
                      ${
                        otp[i]
                          ? "border-[#32A88D] text-[#4B5563]"
                          : "border-gray-300 text-gray-800"
                      }
                      focus:ring-2 focus:ring-[#32A88D] focus:border-[#32A88D]
                    `}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="submit"
            className="w-full  text-primary-foreground font-semibold mt-4"
            size="lg"
          >
            تأكيد الرمز
          </Button>
        </form>
      </div>
    </div>
  );
}
