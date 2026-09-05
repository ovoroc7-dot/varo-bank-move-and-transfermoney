import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export function DetailScreen({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-md">
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur">
          <button onClick={() => router.history.back()} aria-label="Back">
            <ArrowLeft className="size-6" strokeWidth={2} />
          </button>
          <h1 className="flex-1 text-[17px] font-semibold">{title}</h1>
          {action}
        </header>
        <div className="px-4">{children}</div>
      </div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors ${
        checked ? "border-primary bg-primary/15" : "border-border bg-muted"
      }`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-primary transition-all ${
          checked ? "left-[26px]" : "left-0.5 bg-muted-foreground"
        }`}
      />
    </button>
  );
}
