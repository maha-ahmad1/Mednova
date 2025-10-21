// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  // ✅ هنا نجيب الجلسة من السيرفر
  const session = await getServerSession(authOptions);

  // لو المستخدم مش مسجل دخول
  if (!session) {
    return <div>الرجاء تسجيل الدخول أولاً</div>;
  }

  // لو مسجل دخول نعرض بياناته
  return (
    <div dir="rtl">
      <h1>مرحباً {session.user?.full_name}</h1>
      <p>البريد الإلكتروني: {session.user?.email}</p>
      <p>نوع الحساب: {session.user?.type_account}</p>
    </div>
  );
}
