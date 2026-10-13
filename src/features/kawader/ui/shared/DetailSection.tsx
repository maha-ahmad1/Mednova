import type { ReactNode } from "react";

interface DetailSectionProps {
  title: string;
  /** Short explanation under the title. */
  description?: string;
  children: ReactNode;
}

export function DetailSection({ title, description, children }: DetailSectionProps) {
  return (
    <section className="space-y-3 rounded-xl border bg-white p-4 sm:p-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

interface DetailRowProps {
  label: string;
  children: ReactNode;
  /** Spans both columns (long text such as the address or notes). */
  wide?: boolean;
}

export function DetailRow({ label, children, wide = false }: DetailRowProps) {
  return (
    <div className={wide ? "space-y-1 sm:col-span-2" : "space-y-1"}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="whitespace-pre-line break-words text-sm text-foreground">{children}</dd>
    </div>
  );
}
