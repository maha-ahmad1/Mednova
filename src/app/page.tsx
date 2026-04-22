import { Footer } from "@/shared/ui/components/Footer";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import {
  HeroSection,
  PreFooterCta,
  ServicesTabsSection,
  SocialProofSection,
  TrustFaqSection,
  WhyMednovaSection,
} from "@/components/home";

export default function Home() {
  return (
    <main>
      <Navbar variant="landing" />
      <HeroSection />
      <SocialProofSection />
      <WhyMednovaSection />
      <ServicesTabsSection />
      <TrustFaqSection />
      <PreFooterCta />
      <Footer />
    </main>
  );
}
