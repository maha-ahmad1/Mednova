import { Footer } from "@/shared/ui/components/Footer";
import WhyMednova from "./whyMednova";
import Hero from "./hero";
import Program from "./program";
import SmartGlove from "./smartGlove";
import MostRatedProfessionals from "./mostRatedProfessionals";
import Services from "./Services";
import TrustStrip from "./trustStrip";
import ClosingCta from "./closingCta";


export default function HomeSections() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WhyMednova />
      <MostRatedProfessionals />
      <Program />
      <SmartGlove />
      <Services />
      <ClosingCta />
      <Footer />
    </>
  );
}
