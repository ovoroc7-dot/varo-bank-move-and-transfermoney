import { useEffect, useRef, useState, type ReactNode } from "react";

export function Splash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"spinner" | "logo">("spinner");
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const a = setTimeout(() => setPhase("logo"), 1200);
    const b = setTimeout(() => onDoneRef.current(), 2500);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-splash">
      {phase === "spinner" ? (
        <span
          className="size-8 animate-spin rounded-full border-2 border-white/30 border-t-splash-foreground"
          aria-label="Loading"
        />
      ) : (
        <span className="font-display text-5xl font-black tracking-tight text-splash-foreground">
          Varo
        </span>
      )}
    </div>
  );
}

export function AuthScreen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-10">
        <div className="flex justify-end pt-3">
          <button className="rounded-full bg-muted px-5 py-2.5 text-sm font-bold text-primary shadow-sm">
            Help
          </button>
        </div>
        <p className="mt-8 text-center font-display text-5xl font-black tracking-tight text-primary">
          Varo
        </p>
        <div className="mt-10 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  reveal,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  reveal?: boolean;
}) {
  const [shown, setShown] = useState(false);
  const inputType = reveal && !shown ? "password" : reveal ? "text" : type;

  return (
    <div className="mb-5">
      <label className="mb-2 block text-[13px] font-bold">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 w-full rounded-md border border-input bg-surface px-4 pr-12 text-[15px] outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {reveal && (
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-3 flex items-center text-foreground"
          >
            <EyeGlyph off={shown} />
          </button>
        )}
      </div>
    </div>
  );
}

function EyeGlyph({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.6" />
      {off && <path d="M3 21 21 3" />}
    </svg>
  );
}
