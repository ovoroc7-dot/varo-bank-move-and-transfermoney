import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Copy } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import varoCard from "@/assets/varo/varo-card.png";

export const Route = createFileRoute("/fund-instantly")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Fund Instantly with Cash App, PayPal or Venmo — Varo" },
      {
        name: "description",
        content:
          "Use apps like Venmo, PayPal, Cash App or Apple Cash to fund your Varo Bank Account instantly with your debit card or account and routing number.",
      },
      {
        property: "og:title",
        content: "Fund Instantly with Cash App, PayPal or Venmo — Varo",
      },
      {
        property: "og:description",
        content:
          "Use apps like Venmo, PayPal, Cash App or Apple Cash to fund your Varo Bank Account instantly with your debit card or account and routing number.",
      },
    ],
  }),
  component: FundInstantly,
});

const ROUTING = "124303201";
const ACCOUNT = "51763046";

function NumberRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    try {
      void navigator.clipboard?.writeText(value);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-end justify-between border-b border-border py-4">
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-[15px] font-medium">{value}</p>
      </div>
      <button onClick={copy} aria-label={`Copy ${label.toLowerCase()}`} className="pb-0.5">
        {copied ? (
          <span className="text-[11px] font-bold text-primary">Copied</span>
        ) : (
          <Copy className="size-5 text-foreground" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}

function FundInstantly() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="mx-auto max-w-md">
        <header className="sticky top-0 z-30 bg-background/95 px-4 py-3 backdrop-blur">
          <button onClick={() => router.history.back()} aria-label="Back">
            <ArrowLeft className="size-5" />
          </button>
        </header>

        <div className="px-4 pt-4">
          <h1 className="font-display text-[28px] font-extrabold leading-tight">
            Fund your Varo account instantly from other apps
          </h1>
          <p className="mt-4 text-[15px] leading-snug">
            You can use apps like Venmo®, PayPal®, or Apple Cash® to fund your account. Use your
            Varo debit card or account and routing number.
          </p>

          <img
            src={varoCard}
            alt="Varo purple debit Visa card in the name of Joann Juckett"
            className="mx-auto mt-6 h-auto w-56 object-contain"
          />

          <button className="mt-7 w-full rounded-md border border-primary py-3.5 text-sm font-bold text-primary">
            View card number
          </button>

          <div className="mt-6">
            <NumberRow label="Routing number" value={ROUTING} />
            <NumberRow label="Account number" value={ACCOUNT} />
          </div>
        </div>
      </div>
    </div>
  );
}
