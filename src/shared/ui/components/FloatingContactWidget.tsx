"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Mail, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "@/i18n/navigation";

const MASCOT_SRC = "/images/home/mascot-turtle-v2.png";

const WHATSAPP_NUMBER = "+96892349692";
const SUPPORT_EMAIL = "info@mednovacare.com";

const WELCOME_BADGE_SESSION_KEY = "floatingContactWelcomeShown";
const WELCOME_BADGE_DELAY_MS = 3000;
const WELCOME_BADGE_DURATION_MS = 8000;
const OPTION_STAGGER_MS = 70;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="#25D366"
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.17 8.17 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.04 0 1.2.88 2.37 1 2.53.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z" />
    </svg>
  );
}

export function FloatingContactWidget() {
  const t = useTranslations("floatingContact");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showWelcomeBadge, setShowWelcomeBadge] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(WELCOME_BADGE_SESSION_KEY)) return;

    const showTimer = window.setTimeout(() => {
      setShowWelcomeBadge(true);
      sessionStorage.setItem(WELCOME_BADGE_SESSION_KEY, "true");
    }, WELCOME_BADGE_DELAY_MS);

    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showWelcomeBadge) return;

    const hideTimer = window.setTimeout(() => {
      setShowWelcomeBadge(false);
    }, WELCOME_BADGE_DURATION_MS);

    return () => window.clearTimeout(hideTimer);
  }, [showWelcomeBadge]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // All hooks done — now safe to do conditional rendering

  if (pathname.includes("control-panel")) return null;

  function handleToggle() {
    setOpen((prev) => !prev);
    setShowWelcomeBadge(false);
  }

  function handleMinimize() {
    setMinimized(true);
    setOpen(false);
  }

  // Minimized: compact pill with mascot + expand icon
  if (minimized) {
    return (
      <div className="fixed bottom-6 end-6 z-40 hidden sm:block">
        <button
          type="button"
          onClick={() => setMinimized(false)}
          aria-label={t("restore")}
          className="group flex items-center overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-black/10 transition-shadow hover:shadow-xl"
        >
          <span className="relative h-14 w-14 shrink-0">
            <Image
              src={MASCOT_SRC}
              alt=""
              fill
              sizes="56px"
              className="object-contain p-0.5"
            />
          </span>
          <span className="flex items-center justify-center pe-4 ps-2 text-muted-foreground transition-colors group-hover:text-foreground">
            <Maximize2 className="h-4 w-4" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 end-6 z-40 hidden sm:flex flex-col items-end gap-3"
    >
      {open && (
        <div className="flex flex-col items-end gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-contact-pop-in motion-safe:hover:scale-[1.03] flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 shadow-md transition-[transform,box-shadow] duration-150 hover:shadow-lg"
            style={{ animationDelay: "0ms" }}
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium text-foreground">
              {t("whatsapp")}
            </span>
          </a>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="animate-contact-pop-in motion-safe:hover:scale-[1.03] flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 shadow-md transition-[transform,box-shadow] duration-150 hover:shadow-lg"
            style={{ animationDelay: `${OPTION_STAGGER_MS}ms` }}
          >
            <Mail className="h-5 w-5 shrink-0 text-[#0F6E56]" />
            <span className="text-sm font-medium text-foreground">
              {t("email")}
            </span>
          </a>
        </div>
      )}

      {/* Mascot circle — toggles the options menu */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={t("ariaLabel")}
        aria-expanded={open}
        className="relative flex h-[110px] w-[110px] items-center justify-center"
      >
        {!open && (
          <span
            className="bg-primary animate-contact-pulse absolute inset-0 rounded-full"
            aria-hidden="true"
          />
        )}

        <span className="ring-border relative h-24 w-24 overflow-hidden rounded-full border-[3px] border-white bg-white shadow-lg ring-1">
          <Image
            src={MASCOT_SRC}
            alt=""
            fill
            sizes="96px"
            className="object-contain p-1"
          />
          <span
            className={cn(
              "bg-secondary/85 absolute inset-0 flex items-center justify-center backdrop-blur-[1px] transition-all duration-300",
              open
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-75 opacity-0",
            )}
            aria-hidden="true"
          >
            <X
              className={cn(
                "h-8 w-8 text-white transition-transform duration-300",
                open ? "rotate-0" : "-rotate-90",
              )}
            />
          </span>
        </span>

        {!open && (
          <>
            <span
              className="absolute top-0 end-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5"
              aria-hidden="true"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <span
              className="absolute bottom-1 start-[-6px] flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5"
              aria-hidden="true"
            >
              <Mail className="h-5 w-5 text-[#0F6E56]" />
            </span>
          </>
        )}

        {showWelcomeBadge && (
          <span
            className="absolute top-1 end-3 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white"
            aria-hidden="true"
          />
        )}
      </button>

      {/* Bottom row: pill label + minimize button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          className="bg-primary rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-md"
        >
          {t("ariaLabel")}
        </button>
        <button
          type="button"
          onClick={handleMinimize}
          aria-label={t("minimize")}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/10 text-muted-foreground/70 transition-colors hover:text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
