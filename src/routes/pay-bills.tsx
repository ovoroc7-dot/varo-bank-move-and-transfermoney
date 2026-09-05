import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bell, CalendarDays, RotateCw, Sparkles, X } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import billsHero from "@/assets/varo/bills-hero.png.asset.json";
import billsDetect from "@/assets/varo/bills-detect.png.asset.json";
import billsPlaid from "@/assets/varo/bills-plaid.png.asset.json";

export const Route = createFileRoute("/pay-bills")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Pay Bills — Bill Manager in Varo" },
      {
        name: "description",
        content:
          "Move your phone, streaming and utility bills to Varo. Track everything in one calendar view, cancel subscriptions and get alerts before bills are paid.",
      },
      { property: "og:title", content: "Pay Bills — Bill Manager in Varo" },
      {
        property: "og:description",
        content:
          "Move your phone, streaming and utility bills to Varo. Track everything in one calendar view, cancel subscriptions and get alerts before bills are paid.",
      },
    ],
  }),
  component: PayBillsScreen,
});

type Step = "intro" | "loading" | "terms" | "consent" | "plaid" | "manual";

const perks = [
  { Icon: CalendarDays, label: "Track everything in one calendar view" },
  { Icon: Sparkles, label: "Cancel subscriptions you don't want" },
  { Icon: Bell, label: "Get alerts before bills are paid" },
];

function PayBillsScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");

  useEffect(() => {
    if (step !== "loading") return;
    const t = setTimeout(() => setStep("terms"), 1400);
    return () => clearTimeout(t);
  }, [step]);

  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-md pb-8">
          <div className="relative">
            <img src={billsHero.url} alt="" aria-hidden="true" className="w-full object-cover" />
            <button
              onClick={() => router.history.back()}
              aria-label="Back"
              className="absolute left-3 top-3 rounded-full bg-surface/70 p-2"
            >
              <ArrowLeft className="size-5" />
            </button>
          </div>

          <div className="px-4">
            <h1 className="screen-title mt-6 text-center">Take control of your bills</h1>
            <p className="mt-4 text-center text-sm leading-relaxed text-foreground">
              From phone to streaming to utilities—easily switch your bills to Varo and manage
              everything in one place.
            </p>

            <div className="mt-5 rounded-lg bg-muted p-4">
              <p className="text-sm font-bold">Move 5+ bills to Varo to get full access:</p>
              <ul className="mt-1">
                {perks.map(({ Icon, label }, i) => (
                  <li
                    key={label}
                    className={`flex items-center gap-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}
                  >
                    <Icon className="size-5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                    <span className="text-[13px]">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
              To maintain full access to Bill Manager, you must continue to pay 5+ bills with Varo.
            </p>

            <button
              onClick={() => setStep("loading")}
              className="mt-5 w-full rounded-md bg-primary py-3.5 text-sm font-bold text-primary-foreground"
            >
              Move my bills
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
        <header className="flex items-center justify-between px-4 py-3">
          <RotateCw className="size-5" aria-hidden="true" />
          <button
            onClick={() => router.navigate({ to: "/" })}
            className="text-sm font-bold text-foreground"
          >
            Exit
          </button>
        </header>

        {step === "loading" ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="size-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        ) : (
          <div className="px-6 pt-6">
            <img
              src={billsDetect.url}
              alt=""
              aria-hidden="true"
              className="mx-auto h-40 w-auto object-contain"
            />
            <h2 className="mt-4 text-center text-2xl font-medium">Automatically detect bills</h2>
            <p className="mt-3 text-center text-[13px] leading-relaxed text-foreground">
              Link your bank accounts and credit cards to automatically detect and switch recurring
              bills. Varo Bank uses Pinwheel to safely access other accounts.
            </p>
          </div>
        )}

        {step === "consent" && (
          <div className="mt-auto px-6 pb-8">
            <p className="text-center text-[12px] text-muted-foreground">
              By selecting Continue you agree to Pinwheel's{" "}
              <span className="text-primary underline">Terms of Service</span> &{" "}
              <span className="text-primary underline">Privacy Policy</span>.
            </p>
            <button
              onClick={() => setStep("plaid")}
              className="mt-4 w-full rounded-md bg-primary py-3.5 text-sm font-bold text-primary-foreground"
            >
              Continue
            </button>
          </div>
        )}

        {step === "manual" && (
          <div className="mt-auto px-6 pb-8">
            <p className="text-center text-[13px] text-muted-foreground">
              We'll let you know as soon as manual bills are ready to add.
            </p>
            <button
              onClick={() => router.navigate({ to: "/" })}
              className="mt-4 w-full rounded-md bg-primary py-3.5 text-sm font-bold text-primary-foreground"
            >
              Done
            </button>
          </div>
        )}

        {(step === "terms" || step === "plaid") && (
          <>
            <div className="fixed inset-0 z-40 bg-foreground/50" aria-hidden="true" />
            <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-2xl bg-surface px-6 pb-8 pt-5">
              <button
                onClick={() => setStep("consent")}
                aria-label="Close"
                className="absolute right-4 top-4"
              >
                <X className="size-5" />
              </button>

              {step === "terms" ? (
                <>
                  <h3 className="pr-8 text-xl font-medium">Varo Bank Terms &amp; Conditions</h3>
                  <p className="mt-4 text-center text-[13px] leading-relaxed">
                    By clicking "Agree to Terms and Continue", you're giving Varo permission to
                    obtain and use the information in the external financial accounts you link
                    through Plaid as set forth in Varo's{" "}
                    <span className="text-primary underline">Terms of Use</span> and{" "}
                    <span className="text-primary underline">Privacy Policy</span>
                  </p>
                  <button
                    onClick={() => setStep("consent")}
                    className="mt-5 w-full rounded-md bg-primary py-3.5 text-sm font-bold text-primary-foreground"
                  >
                    Agree to Terms and Continue
                  </button>
                  <button
                    onClick={() => router.navigate({ to: "/" })}
                    className="mt-4 w-full text-center text-sm font-bold text-primary"
                  >
                    No thanks
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={billsPlaid.url}
                    alt=""
                    aria-hidden="true"
                    className="mx-auto mt-2 h-10 w-auto object-contain"
                  />
                  <h3 className="mt-4 text-center text-xl font-medium">Link accounts via Plaid</h3>
                  <p className="mt-3 text-center text-[13px] leading-relaxed">
                    Link the credit or debit card where you pay your Netflix, Spotify, Verizon, etc.
                  </p>
                  <button
                    onClick={() => router.navigate({ to: "/" })}
                    className="mt-5 w-full rounded-md bg-primary py-3.5 text-sm font-bold text-primary-foreground"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => setStep("manual")}
                    className="mt-4 w-full text-center text-sm font-bold text-primary"
                  >
                    Add bills manually
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
