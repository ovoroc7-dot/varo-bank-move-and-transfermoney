import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Copy } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import { DetailScreen, Toggle } from "@/components/varo/DetailScreen";

export const Route = createFileRoute("/account-numbers")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Account Numbers — Varo" },
      {
        name: "description",
        content:
          "See the account and routing numbers for your Varo Bank Account and Varo Savings Account, and manage direct deposit.",
      },
      { property: "og:title", content: "Account Numbers — Varo" },
      {
        property: "og:description",
        content:
          "See the account and routing numbers for your Varo Bank Account and Varo Savings Account, and manage direct deposit.",
      },
    ],
  }),
  component: AccountNumbers,
});

const ROUTING = "124303201";

function CopyRow({ label, value }: { label: string; value: string }) {
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
    <div className="flex items-end justify-between border-b border-border py-3.5">
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-[15px]">{value}</p>
      </div>
      <button onClick={copy} aria-label={`Copy ${label.toLowerCase()}`} className="pb-0.5">
        {copied ? (
          <span className="text-[11px] font-bold text-primary">Copied</span>
        ) : (
          <Copy className="size-5" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}

function AccountNumbers() {
  const [show, setShow] = useState(false);

  const bank = show ? "51763046" : "****3046";
  const savings = show ? "51762987" : "****2987";

  return (
    <DetailScreen title="Account numbers">
      <h2 className="pt-1 text-[15px] font-bold">Varo Bank Account</h2>
      <CopyRow label="Account number" value={bank} />
      <CopyRow label="Routing number" value={ROUTING} />
      <button className="mt-4 w-full rounded-md border border-primary py-3 text-[13px] font-bold text-primary">
        Manage direct deposit
      </button>

      <div className="-mx-4 mt-5 h-2 bg-muted" />

      <h2 className="pt-4 text-[15px] font-bold">Varo Savings Account</h2>
      <CopyRow label="Account number" value={savings} />
      <CopyRow label="Routing number" value={ROUTING} />

      <div className="-mx-4 mt-5 h-2 bg-muted" />

      <div className="flex items-center gap-3 py-4">
        <span className="flex-1 text-[15px]">Show account numbers</span>
        <Toggle checked={show} onChange={setShow} label="Show account numbers" />
      </div>
    </DetailScreen>
  );
}
