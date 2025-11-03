import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import PatientCreate from "../_views/patient/ProfileCreate";
import TherapistCreate from "../_views/therapist/ProfileCreate";
import CenterCreate from "../_views/center/ProfileCreate";

export default async function ProfileCreatePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>الرجاء تسجيل الدخول</div>;
  }
  console.log("Session in create ProfilePage:", session);
if (session.isCompleted) redirect("/profile");

  // const isCompleted = session.user?.is_completed;
  // if (isCompleted) {
  //   redirect("/profile");
  // }
  //console.log("isCompleted create page:", isCompleted);

  const role = session.role || session.user?.type_account;

  switch (role) {
    case "patient":
      return <PatientCreate />;
    case "therapist":
      return <TherapistCreate />;
    case "rehabilitation_center":
      return <CenterCreate />;
    default:
      return <div>غير مصرح لك بالدخول</div>;
  }
}
