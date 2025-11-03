import { Footer } from "@/shared/ui/Footer";
import Hero from "./hero";
import LandingNavbar from "@/components/ui/LandingNavbar";
import WhyMednova from "./whyMednova";
import SmartGlove from "./smartGlove";
import Services from "./Services";
import MostRatedProfessionals from "./mostRatedProfessionals";
import Program from "./program";
export default function HomeSections() {
  return (
    <>
      <Hero />
      <WhyMednova />
      <Program />
      <SmartGlove />
      <MostRatedProfessionals />
      <Services />
      <Footer />
    </>
  );
}
