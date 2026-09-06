import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Mail, MessageSquare, Wallet } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import { DetailScreen, Toggle } from "@/components/varo/DetailScreen";
import cardArt from "@/assets/varo/varo-card-portrait.png";

export const Route = createFileRoute("/varo-card")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Varo Debit Card — Manage Your Card" },
      {
        name: "description",
        content:
          "View your Varo Debit Card number, freeze your card, change your PIN, report it lost or stolen and add it to Apple Wallet.",
      },
      { property: "og:title", content: "Varo Debit Card — Manage Your Card" },
      {
        property: "og:description",
        content:
          "View your Varo Debit Card number, freeze your card, change your PIN, report it lost or stolen and add it to Apple Wallet.",
      },
    ],
  }),
  component: VaroCardScreen,
});

function ConfirmIdentity({ onBack }: { onBack: () => void }) {
  const options = [
    { icon: Mail, label: "Email" },
    { icon: MessageSquare, label: "Text message" },
  ];
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="mx-auto max-w-md">
        <header className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} aria-label="Back">
            <ArrowLeft className="size-6" />
          </button>
          <span className="text-[17px] font-semibold">Confirm your identity</span>
        </header>
        <div className="px-4">
          <h2 className="mt-3 font-display text-[26px] font-extrabold">Confirm your identity</h2>
          <p className="mt-1 text-[14px] leading-snug text-muted-foreground">
            It&apos;s for your security. Let us know if you prefer an email or text.
          </p>
          <ul className="mt-4">
            {options.map(({ icon: Icon, label }) => (
              <li key={label}>
                <button className="flex w-full items-center gap-4 border-b border-border py-4 text-left">
                  <Icon className="size-6" strokeWidth={1.5} />
                  <span className="flex-1 text-[15px]">{label}</span>
                  <ChevronRight className="size-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function VaroCardScreen() {
  const [frozen, setFrozen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <DetailScreen title="Varo Debit Card">
      <div className="flex justify-center pt-2">
        <img
          src={cardArt}
          alt="Varo Debit Visa card in the name of Joann Juckett"
          className="w-[62%] max-w-[240px]"
        />
      </div>

      <button
        onClick={() => setConfirming(true)}
        className="mt-5 w-full rounded-md border border-primary py-3 text-[13px] font-bold text-primary"
      >
        View card number
      </button>

      <div className="mt-5 flex items-center gap-3">
        <span className="flex-1 text-[15px]">Freeze card</span>
        <Toggle checked={frozen} onChange={setFrozen} label="Freeze card" />
      </div>
      <p className="mt-2 text-[12px] leading-snug text-muted-foreground">
        Freezing your card blocks new purchases and refunds but won&apos;t affect pre-authorized
        charges, recurring payments, direct deposits, or bill payments.
      </p>

      <button className="mt-4 flex w-full items-center gap-3 border-b border-t border-border py-4 text-left">
        <span className="flex-1 text-[15px]">Change PIN</span>
        <ChevronRight className="size-5" />
      </button>
      <button className="flex w-full items-center gap-3 border-b border-border py-4 text-left">
        <span className="flex-1 text-[15px]">Report lost or stolen card</span>
        <ChevronRight className="size-5" />
      </button>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-foreground py-3.5 text-[15px] font-bold text-background">
        <Wallet className="size-5" strokeWidth={2} /> Add to Apple Wallet
      </button>

      <p className="mt-4 text-[11px] leading-snug text-muted-foreground">
        Visa is registered trademark of Visa International Service Association. The Varo Visa® Debit
        Card is issued pursuant to a license from Visa U.S.A. Inc and may be used everywhere Visa
        debit cards are accepted.
      </p>

      {confirming && <ConfirmIdentity onBack={() => setConfirming(false)} />}
    </DetailScreen>
  );
}
