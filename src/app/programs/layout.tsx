import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import Navbar from "@/shared/ui/components/Navbar/Navbar";

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar variant="landing" />
      <BreadcrumbNav currentPage="البرامج التأهيلية" />
      {children}
    </>
  );
}
