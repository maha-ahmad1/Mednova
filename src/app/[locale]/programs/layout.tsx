import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import { getTranslations } from "next-intl/server";
import Navbar from "@/shared/ui/components/Navbar/Navbar";

export default async function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("programs");
  return (
    <>
      <Navbar variant="landing" />
      <BreadcrumbNav currentPage={t("breadcrumb.list")} />
      {children}
    </>
  );
}
