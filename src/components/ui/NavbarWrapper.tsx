// "use client";
// import { useSession } from "next-auth/react";
// import { usePathname } from "next/navigation";
// import LandingNavbar from "./LandingNavbar";

// export default function NavbarWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const showNavbarPages = ["/specialists", "/"];
//   const showNavbar = showNavbarPages.includes(pathname);

//   return (
//     <>
//       {showNavbar && <LandingNavbar />} 
//       {children}
//     </>
//   );
// }
