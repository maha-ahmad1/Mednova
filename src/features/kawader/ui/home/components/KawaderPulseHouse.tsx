"use client";

import {
  Ambulance,
  Apple,
  FlaskConical,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

// Positions use logical offsets so they mirror with the SVG in RTL.
const FLOATING_ICONS: {
  Icon: LucideIcon;
  position: string;
  duration: string;
  delay: string;
}[] = [
  { Icon: Stethoscope, position: "top-[2%] start-[56%]", duration: "5s", delay: "0s" },
  { Icon: Syringe, position: "top-[8%] start-[18%]", duration: "4.5s", delay: "-1.2s" },
  { Icon: FlaskConical, position: "top-[34%] end-[0%]", duration: "5.5s", delay: "-2.4s" },
  { Icon: Apple, position: "bottom-[2%] start-[24%]", duration: "4.8s", delay: "-3.1s" },
  { Icon: Ambulance, position: "bottom-[0%] end-[4%]", duration: "6s", delay: "-0.6s" },
];

// Flat line → ECG spike → flat → roof → eaves back → right wall → floor → left wall.
const PULSE_PATH =
  "M8 170 H66 L78 182 L96 98 L114 208 L126 170 H168 L280 78 L392 170 H360 V252 H200 V170";

/**
 * Decorative "pulse reaches home" illustration. The SVG is mirrored in RTL so the line
 * draws right-to-left; the animation itself lives in globals.css (.kawader-pulse-*).
 */
export default function KawaderPulseHouse({ className }: { className?: string }) {
  const { ref, seen, visible } = useInView<HTMLDivElement>({ amount: 0.4 });

  return (
    <div
      ref={ref}
      aria-hidden
      data-seen={seen}
      data-visible={visible}
      className={cn("kawader-pulse relative mx-auto aspect-[4/3] w-full", className)}
    >
      <div className="absolute inset-[6%] rounded-full bg-primary/10 blur-2xl" />

      <svg
        viewBox="0 0 400 300"
        className="relative size-full text-primary rtl:-scale-x-100"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon
          className="kawader-pulse-fill"
          points="200,145.5 280,78 360,145.5 360,252 200,252"
          fill="currentColor"
          fillOpacity={0.1}
          stroke="none"
        />
        <path className="kawader-pulse-line" d={PULSE_PATH} pathLength={1} />
        {/* Placement lives on the <g>; the CSS pulse animates the inner path's transform. */}
        <g transform="translate(262 184) scale(1.5)">
          <path
            className="kawader-pulse-heart"
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            fill="currentColor"
            fillOpacity={0.9}
            strokeWidth={1.5}
          />
        </g>
      </svg>

      {FLOATING_ICONS.map(({ Icon, position, duration, delay }) => (
        <span
          key={position}
          className={cn(
            "kawader-pulse-float absolute flex size-10 items-center justify-center rounded-full border border-primary/20 bg-white text-primary sm:size-11",
            position,
          )}
          style={{ animationDuration: duration, animationDelay: delay }}
        >
          <Icon className="size-5" />
        </span>
      ))}
    </div>
  );
}
