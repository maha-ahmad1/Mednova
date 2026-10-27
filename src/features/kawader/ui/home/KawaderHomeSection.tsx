"use client";

import {
  Ambulance,
  Apple,
  ArrowRight,
  FlaskConical,
  HeartPulse,
  Package,
  PersonStanding,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/useInView";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import KawaderPulseHouse from "./components/KawaderPulseHouse";

// TODO: there is no return-to-page mechanism after login (the middleware sends guests who hit
// /profile/* to /login without remembering the target). A logged-out visitor therefore lands on
// the default page after signing in instead of /profile/kawader/new.
const REQUEST_HREF = "/profile/kawader/new";

const SERVICES: { key: string; Icon: LucideIcon }[] = [
  { key: "gp_visit", Icon: Stethoscope },
  { key: "dietitian", Icon: Apple },
  { key: "home_nursing", Icon: Syringe },
  { key: "physiotherapy", Icon: PersonStanding },
  { key: "home_diagnostics", Icon: FlaskConical },
  { key: "patient_transfer", Icon: Ambulance },
  { key: "medical_supplies_delivery", Icon: Package },
];

const STEPS = ["request", "coordinate", "arrive"] as const;
const STEP_STAGGER_S = 0.15;

// Static marketing copy only: this section must not call the Kawader API (needs a patient token).
export default function KawaderHomeSection() {
  const t = useTranslations("kawader.home");
  const { data: session, status } = useSession();
  const { ref: stepsRef, seen: stepsSeen } = useInView<HTMLOListElement>({ amount: 0.5 });

  // Same role source as the middleware. Signed-in specialists/centers don't see the section;
  // guests and patients do.
  const role = session?.role ?? session?.user?.type_account;
  if (status === "authenticated" && role !== "patient") return null;

  // Same-height placeholder while the session resolves so the page below doesn't jump.
  if (status === "loading") {
    return <section aria-hidden className="min-h-[56rem] bg-white lg:min-h-[44rem]" />;
  }

  const scrollToSteps = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stepsRef.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    // White background: the sections above (Services) and below (ClosingCta) both use the teal
    // gradient, so this one reads as its own block.
    <section
      aria-labelledby="kawader-home-title"
      className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Visual first on mobile, at the end on lg */}
          <div className="order-first mx-auto w-full max-w-[280px] sm:max-w-[360px] lg:order-last lg:col-span-5 lg:max-w-[460px]">
            <KawaderPulseHouse />
          </div>

          <div className="text-center lg:col-span-7 lg:text-start">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-secondary">
              <HeartPulse className="size-4 text-primary" aria-hidden />
              <span>{t("badge")}</span>
            </div>

            <h2
              id="kawader-home-title"
              className="mb-6 text-4xl font-extrabold leading-tight text-secondary md:text-5xl"
            >
              {t("title")}
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg leading-8 text-gray-600 lg:mx-0">
              {t("description")}
            </p>

            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="rounded-xl px-8 py-4 text-lg transition-all duration-300 hover:-translate-y-0.5"
                asChild
              >
                <Link href={REQUEST_HREF}>
                  {t("ctaPrimary")}
                  <ArrowRight className="ms-2 size-5 rtl:rotate-180" aria-hidden />
                </Link>
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={scrollToSteps}
                className="rounded-xl border-secondary px-8 py-4 text-lg text-secondary hover:bg-secondary/5 hover:text-secondary"
              >
                {t("ctaSecondary")}
              </Button>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-16">
          <h3 className="sr-only">{t("stepsTitle")}</h3>
          <ol ref={stepsRef} className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
            {STEPS.map((step, i) => {
              const delay = `${i * STEP_STAGGER_S}s`;
              const isLast = i === STEPS.length - 1;
              return (
                <li
                  key={step}
                  data-seen={stepsSeen}
                  style={{ transitionDelay: delay }}
                  className={cn(
                    "relative flex gap-4 transition-all duration-500 ease-out sm:flex-col sm:gap-3",
                    "motion-reduce:transition-none",
                    stepsSeen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                    "motion-reduce:translate-y-0 motion-reduce:opacity-100",
                  )}
                >
                  <span
                    className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-base font-bold text-white"
                  >
                    {i + 1}
                  </span>

                  {/* Connector to the next step; fills in with the step (vertical on mobile) */}
                  {!isLast && (
                    <>
                      <span
                        aria-hidden
                        className="absolute start-5 top-10 -bottom-8 w-0.5 -translate-x-1/2 bg-primary/15 sm:hidden rtl:translate-x-1/2"
                      >
                        <span
                          style={{ transitionDelay: delay }}
                          className={cn(
                            "block size-full origin-top bg-primary transition-transform duration-500 ease-out motion-reduce:transition-none",
                            stepsSeen ? "scale-y-100" : "scale-y-0",
                            "motion-reduce:scale-y-100",
                          )}
                        />
                      </span>
                      <span
                        aria-hidden
                        className="absolute start-12 top-5 -end-6 hidden h-0.5 -translate-y-1/2 bg-primary/15 sm:block"
                      >
                        <span
                          style={{ transitionDelay: delay }}
                          className={cn(
                            "block size-full bg-primary transition-transform duration-500 ease-out ltr:origin-left rtl:origin-right motion-reduce:transition-none",
                            stepsSeen ? "scale-x-100" : "scale-x-0",
                            "motion-reduce:scale-x-100",
                          )}
                        />
                      </span>
                    </>
                  )}

                  <div className="text-start">
                    <h4 className="mb-1 font-bold text-secondary">{t(`steps.${step}.title`)}</h4>
                    <p className="text-sm leading-6 text-gray-600">
                      {t(`steps.${step}.description`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Services */}
        <div className="mt-14">
          <h3 className="sr-only">{t("servicesLabel")}</h3>
          <ul className="flex flex-wrap justify-center gap-3 lg:justify-start">
            {SERVICES.map(({ key, Icon }) => (
              <li key={key}>
                <Link
                  href={REQUEST_HREF}
                  className="kawader-chip inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-secondary transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/10 focus-visible:-translate-y-0.5 focus-visible:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <Icon className="kawader-chip-icon size-4 text-primary" aria-hidden />
                  {t(`services.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-center text-sm text-gray-600 lg:text-start">{t("footer")}</p>
      </div>
    </section>
  );
}
