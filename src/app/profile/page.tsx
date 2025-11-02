import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

import PatientProfile from "./_views/patient/ProfileView"
import TherapistProfile from "./_views/therapist/ProfileView"
import CenterProfile from "./_views/center/ProfileView"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>الرجاء تسجيل الدخول</div>
  }
console.log("Session in ProfilePage:", session);

  // const isCompleted = session.user?.is_completed;
  // if (!isCompleted) {
  //   redirect("/profile/create")
  // }
//console.log("isCompleted page:", isCompleted);

  const role = session.role || session.user?.type_account
  console.log("role: " + role)

  switch (role) {
    case "patient":
      return <PatientProfile />
    case "therapist":
      return <TherapistProfile />
    case "rehabilitation_center":
      return <CenterProfile />
    default:
      return <div>غير مصرح لك بالدخول</div>
  }
}
