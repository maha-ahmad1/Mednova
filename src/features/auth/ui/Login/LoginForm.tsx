"use client";
import { Button } from "@/shared/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";


export function LoginForm() {

  return (
    <>
      <Card className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent">
        <CardHeader className="space-y-2 " dir="rtl">
        
          <CardTitle className="text-2xl font-bold text-foreground">
            قم بتسجيل الدخول
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            قم بإدخال بياناتك للانضمام الى منصة ميدنوفا{" "}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-50px]">
          <form className="space-y-5">
            {/* Email */}
            <div className="space-y-2" dir="rtl">
              <Label htmlFor="email" className="text-right block">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2" dir="rtl">
              <Label htmlFor="passward" className="text-right block ">
                كلمة المرور{" "}
              </Label>
              <Input
                id="passward"
                placeholder="أدخل كلمة المرور"
                className="text-right "
                dir="rtl"
                type="password"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2" dir="rtl">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 rounded border-border"
              />
              <div className="flex justify-between w-full">

                <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                تذكرني
              </Label>

               <Label
                htmlFor="terms"
                className="text-sm text-[#32A88D] cursor-pointer"
              >
                نسيت كلمة المرور؟
              </Label>
              </div>
              
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#32A88D] hover:bg-[#32A88D]/90 text-primary-foreground font-semibold"
              size="lg"
            >
              تسجيل الدخول
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-[13px]">أو من خلال</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-8">
            <Button
              variant="outline"
              type="button"
              className="w-full h-14  bg-transparent hover:bg-[#F0FDF4]"
            >
              <Image
                src="/images/auth/google-icon.png"
                alt="Google Icon"
                width={25}
                height={25}
                className="mr-2"
              />
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full h-14 bg-transparent hover:bg-[#F0FDF4]"
            >
              <Image
                src="/images/auth/facebook-icon.png"
                alt="facebook Icon"
                width={25}
                height={25}
                className="mr-2"
              />
              Facebook
            </Button>
          </div>
          <div>
            <a href="#" className="text-[#4B5563] cursor-default text-md">
              ليس لديك حساب؟
            </a>{" "}
            <a href="#" className="text-[#32A88D] hover:underline">
              أنشئ حسابك الآن
            </a>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
