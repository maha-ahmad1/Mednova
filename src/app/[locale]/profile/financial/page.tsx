import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConsultantWalletPage, PatientWalletPage } from "@/features/financial/ui";

export default async function FinancialPage() {
  const session = await getServerSession(authOptions);
  const role = session?.role ?? session?.user?.type_account;

  if (role === "patient") {
    return <PatientWalletPage />;
  }

  return <ConsultantWalletPage />;
}
