import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useAccounts, formatUSD } from "@/lib/balances";
import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { Screen, VaroHeader, SectionLabel, Pill } from "@/components/varo/Shell";
import { Glyph, type GlyphName } from "@/components/varo/Glyph";
import { isLoggedIn } from "@/lib/auth-guard";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Varo Home — Accounts, Savings & Cashback" },
      {
        name: "description",
        content:
          "See your Varo Bank Account, savings, Believe Card and cashback offers in one place, and top up instantly.",
      },
      { property: "og:title", content: "Varo Home — Accounts, Savings & Cashback" },
      {
        property: "og:description",
        content:
          "See your Varo Bank Account, savings, Believe Card and cashback offers in one place, and top up instantly.",
      },
    ],
  }),
  component: HomeScreen,
});

const quickActions = ["Transfer", "Pay bills", "View card", "Send money", "Find ATM"];

const quickActionClass =
  "shrink-0 rounded-md bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground";

const topUpOptions: {
  glyph: GlyphName;
  label: string;
  note: string;
  instant: boolean;
  href: "/fund-instantly" | "/add-cash" | "/transfer";
}[] = [
  {
    glyph: "phone",
    label: "Use Cash App, Paypal or Venmo",
    note: "⚡ Instant",
    instant: true,
    href: "/fund-instantly",
  },
  { glyph: "cash", label: "Deposit Cash", note: "⚡ Instant", instant: true, href: "/add-cash" },
  { glyph: "bank", label: "Bank Transfer", note: "2-4 days", instant: false, href: "/transfer" },
];


function HomeScreen() {
  const [showPromo, setShowPromo] = useState(true);
  const [topUpOpen, setTopUpOpen] = useState(true);
  const accounts = useAccounts();
  const bank = accounts.find((a) => a.id === "bank")!;
  const savings = accounts.find((a) => a.id === "savings")!;

  return (
    <Screen header={<VaroHeader />}>
      <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {quickActions.map((action) => {
          const href =
            action === "Transfer" ? "/transfer" : action === "Pay bills" ? "/pay-bills" : null;
          return href ? (
            <Link key={action} to={href} className={quickActionClass}>
              {action}
            </Link>
          ) : (
            <button key={action} className={quickActionClass}>
              {action}
            </button>
          );
        })}
      </div>

      {showPromo && (
        <section className="card-surface relative bg-mint p-4 text-mint-foreground">
          <button
            onClick={() => setShowPromo(false)}
            aria-label="Dismiss offer"
            className="absolute right-3 top-3 text-mint-foreground/70"
          >
            <X className="size-4" />
          </button>
          <Glyph name="gas" size="lg" />
          <h2 className="card-title mt-3 text-xl">Get cashback on gas</h2>
          <p className="mt-2 text-sm leading-snug">
            Earn up to 24¢/gal back when you fill your tank at the gas station. Activate your
            deals now.
          </p>
          <button className="mt-3 rounded-full bg-surface px-4 py-2 text-xs font-bold text-primary">
            Activate offers
          </button>
        </section>
      )}

      <section className="card-surface mt-3 flex items-center gap-3 p-4">
        <div className="flex-1">
          <p className="text-sm font-medium leading-snug">
            Unlock a higher savings rate with qualifying direct deposits.
          </p>
          <button className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary">
            Set up direct deposit <ChevronRight className="size-4" />
          </button>
        </div>
        <Glyph name="bag" size="lg" />
      </section>

      <SectionLabel>Banking</SectionLabel>
      <div className="card-surface overflow-hidden">
        <Link
          to="/account/$id"
          params={{ id: "bank" }}
          className="flex items-center gap-3 p-4"
        >
          <Glyph name="wallet" />
          <span className="flex-1 text-sm font-medium">Varo Bank Account</span>
          <span className="font-display text-base font-extrabold">{formatUSD(bank.balance)}</span>
        </Link>


        <button
          onClick={() => setTopUpOpen((v) => !v)}
          className="flex w-full items-center gap-2 border-t border-border bg-muted px-4 py-3 text-left"
        >
          <span className="flex-1 text-sm font-bold">Top up your account</span>
          <ChevronDown
            className={`size-4 transition-transform ${topUpOpen ? "" : "-rotate-90"}`}
          />
        </button>
        {topUpOpen && (
          <ul className="bg-muted">
            {topUpOptions.map((o) => (
              <li key={o.label}>
                <Link
                  to={o.href}
                  className="flex items-center gap-3 border-t border-border/70 px-4 py-2.5"
                >
                  <Glyph name={o.glyph} />
                  <span className="flex-1 text-[13px]">{o.label}</span>
                  <Pill tone={o.instant ? "lime" : "muted"}>{o.note}</Pill>
                </Link>
              </li>
            ))}
          </ul>

        )}

        <Link
          to="/account/$id"
          params={{ id: "savings" }}
          className="flex items-center gap-3 border-t border-border p-4"
        >
          <Glyph name="savings" />
          <div className="flex-1">
            <p className="text-sm font-medium">Varo Savings Account</p>
            <p className="text-[11px] text-muted-foreground">1.00% APY</p>
          </div>
          <span className="font-display text-base font-extrabold">{formatUSD(savings.balance)}</span>
        </Link>

        <div className="flex items-center gap-3 border-t border-border p-4">
          <Glyph name="card" />
          <div className="flex-1">
            <p className="text-sm font-medium">Varo Believe Card</p>
            <p className="text-[11px] text-muted-foreground">
              Build credit with no monthly fees. No APR.
            </p>
          </div>
          <Plus className="size-5 text-primary" />
        </div>

        <button className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-left">
          <span className="flex-1 text-[13px]">Get early payday and more with direct deposit</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
        <div className="border-t border-border px-4 pb-4 pt-3">
          <div className="h-1.5 rounded-full bg-muted" />
          <div className="mt-3 flex items-center justify-between">
            <span className="font-display text-sm font-extrabold">$0.00 this month</span>
            <span className="text-xs text-muted-foreground">Updated Sep 3</span>
          </div>
        </div>
      </div>

      <SectionLabel>Borrow</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        <div className="card-surface flex flex-col p-4">
          <Glyph name="sprout" />
          <p className="mt-2 text-[11px] text-muted-foreground">Advance</p>
          <p className="text-sm font-bold leading-snug">Get up to $250</p>
          <span className="mt-3 w-fit rounded bg-lime px-1.5 py-0.5 text-[10px] font-bold text-lime-foreground">
            Try it!
          </span>
        </div>
        <div className="card-surface flex flex-col p-4">
          <div className="flex items-start justify-between">
            <Glyph name="coins" />
            <Plus className="size-5 text-primary" />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Line of Credit</p>
          <p className="text-sm font-bold leading-snug">Borrow up to $2,000</p>
          <span className="mt-3 text-[11px] text-muted-foreground">with monthly repayments</span>
        </div>
      </div>

      <SectionLabel>For you</SectionLabel>
      <div className="space-y-3">
        <div className="card-surface flex items-center gap-3 overflow-hidden p-4">
          <div className="flex-1">
            <p className="text-sm font-bold leading-snug">
              The easiest way to view your other account balances and move money.
            </p>
            <button className="mt-3 rounded-full border border-primary px-3 py-1.5 text-xs font-bold text-primary">
              Link Accounts
            </button>
          </div>
          <Glyph name="building" size="lg" />
        </div>
        <div className="card-surface flex items-center gap-3 overflow-hidden p-4">
          <div className="flex-1">
            <p className="text-sm font-bold leading-snug">Invite friends. Earn $100.*</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              You and your friend both get $100 when they join Varo and qualify.
            </p>
            <button className="mt-3 rounded-full border border-primary px-3 py-1.5 text-xs font-bold text-primary">
              Get $100
            </button>
          </div>
          <Glyph name="friends" size="lg" />
        </div>
      </div>
    </Screen>
  );
}
