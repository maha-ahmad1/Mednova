import { Footer } from "@/shared/ui/Footer";
import Hero from "./hero";
import LandingNavbar from "@/components/ui/LandingNavbar";
import WhyMednova from "./whyMednova";
import Ser from "./ser";
import Services from "./Services";
export default function HomeSections() {
  return (
    <>
        <LandingNavbar />
        <Hero />
        <WhyMednova />
        <Ser/>
        <Services />
        <Footer />
    </>
  );
}