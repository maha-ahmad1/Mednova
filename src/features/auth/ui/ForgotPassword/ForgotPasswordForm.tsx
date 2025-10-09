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


export function ForgotPassword() {
  return (
    <>
      <Card className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent">
        <CardHeader className="space-y-2 " dir="rtl">
         
          <CardTitle className="text-2xl font-bold text-foreground">
            إعادة تعيين كلمة المرور
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-20px]">
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#32A88D] hover:bg-[#32A88D]/90 text-primary-foreground font-semibold"
              size="lg"
            >
              إرسال
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
