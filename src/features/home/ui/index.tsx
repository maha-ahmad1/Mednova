import { Footer } from "@/shared/ui/components/Footer";
import WhyMednova from "./whyMednova";
import Hero from "./hero";
import Program from "./program";
import SmartGlove from "./smartGlove";
import MostRatedProfessionals from "./mostRatedProfessionals";
import Services from "./Services";


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
