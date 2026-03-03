"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.role === "admin") {
      router.replace("/control-panel/users");
    }
  }, [router, session?.role, status]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      login_context: "control-panel",
    });

    setIsSubmitting(false);

    if (!result?.ok) {
      setError("بيانات تسجيل الدخول غير صحيحة أو لا تمتلك صلاحية لوحة التحكم.");
      return;
    }

    router.replace("/control-panel/users");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-right">
          <CardTitle className="text-2xl">تسجيل دخول لوحة التحكم</CardTitle>
          <CardDescription>
            هذه الصفحة مخصصة لمسؤولي النظام فقط. يرجى إدخال بيانات حساب الإدارة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "جاري تسجيل الدخول..." : "دخول لوحة التحكم"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
