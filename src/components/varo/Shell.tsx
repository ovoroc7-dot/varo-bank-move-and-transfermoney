import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { art } from "./art";


export function Screen({
  children,
  header,
}: {
  children: ReactNode;
  header?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-md">
        {header}
        <div className="px-4">{children}</div>
      </div>
      <BottomNav />
    </div>
  );
}

export function VaroHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-background/95 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur">
      <img src={art.logo} alt="Varo" className="h-7 w-auto object-contain" />

      <button className="rounded-full border border-primary px-3 py-1.5 text-xs font-bold text-primary transition-colors active:bg-accent">
        Get $100
      </button>
    </header>
  );
}

export function TitleHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 bg-background/95 px-4 pb-2 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur">
      <div className="flex justify-end">
        <Info className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h1 className="screen-title mt-1">{title}</h1>
    </header>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label mb-2 mt-6">{children}</p>;
}

export function Pill({
  children,
  tone = "lime",
}: {
  children: ReactNode;
  tone?: "lime" | "muted";
}) {
  return (
    <span
      className={
        tone === "lime"
          ? "rounded bg-lime px-1.5 py-0.5 text-[10px] font-bold text-lime-foreground"
          : "text-[11px] font-medium text-muted-foreground"
      }
    >
      {children}
    </span>
  );
}
