import type { ReactNode } from "react";
import { toast } from "sonner";

interface KawaderToastOptions {
  id: string;
  duration?: number;
  referenceCode?: string;
  /** Active locale; sets the text direction ("ar" -> rtl, otherwise ltr). */
  locale: string;
  action: { label: string; onClick: () => void };
}

/** Text element with the locale's direction; the reference code is isolated in <bdi>. */
const renderText = (text: string, locale: string, referenceCode?: string): ReactNode => {
  const dir = locale === "ar" ? "rtl" : "ltr";
  if (!referenceCode || !text.includes(referenceCode)) return <span dir={dir}>{text}</span>;
  const [before, ...rest] = text.split(referenceCode);
  return (
    <span dir={dir}>
      {before}
      <bdi dir="ltr">{referenceCode}</bdi>
      {rest.join(referenceCode)}
    </span>
  );
};

/**
 * Flex order follows the element's `direction`, so Arabic mirrors the row (icon right, action
 * left). Sonner's icon/button margins are physical and come from the Toaster's `dir` (LTR
 * here), so the RTL values are supplied per toast.
 */
const RTL_STYLE = {
  direction: "rtl",
  "--toast-icon-margin-start": "4px",
  "--toast-icon-margin-end": "-3px",
  "--toast-svg-margin-start": "0px",
  "--toast-svg-margin-end": "-1px",
  "--toast-button-margin-start": "0",
  "--toast-button-margin-end": "auto",
} as React.CSSProperties;

/**
 * Kawader realtime toast: the global Sonner `info` look, with only the action button
 * shown as an underlined text link. `!` modifiers are needed to beat sonner's own stylesheet.
 */
export function showKawaderToast(text: string, opts: KawaderToastOptions): void {
  toast.info(renderText(text, opts.locale, opts.referenceCode), {
    id: opts.id,
    duration: opts.duration,
    style: opts.locale === "ar" ? RTL_STYLE : { direction: "ltr" },
    action: { label: opts.action.label, onClick: opts.action.onClick },
    classNames: {
      actionButton:
        "!h-auto !bg-transparent !p-0 !rounded-sm !text-secondary !text-xs !font-medium underline underline-offset-2 hover:!text-secondary/80 focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-primary/50",
    },
  });
}
