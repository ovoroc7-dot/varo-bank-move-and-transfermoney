import { createFileRoute, redirect, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Info, Settings } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import { useAccounts, formatUSD, type AccountId } from "@/lib/balances";
import emptyActivity from "@/assets/varo/empty-activity.png.asset.json";
import savingsPig from "@/assets/varo/savings-pig.png.asset.json";

export const Route = createFileRoute("/account/$id")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Account Balance — Varo Bank Account Activity" },
      {
        name: "description",
        content:
          "View your Varo account available balance, money in and money out for the month, spending by category and recent transactions.",
      },
      { property: "og:title", content: "Account Balance — Varo Bank Account Activity" },
      {
        property: "og:description",
        content:
          "View your Varo account available balance, money in and money out for the month, spending by category and recent transactions.",
      },
    ],
  }),
  component: AccountScreen,
});

type Tab = "all" | "in" | "out";

const tabs: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in", label: "Money in" },
  { id: "out", label: "Money out" },
];

const months = ["July", "August", "September"];

const categories = [
  { label: "All spending", pct: null as string | null },
  { label: "Transfers", pct: "0% of total" },
  { label: "Food & Drinks", pct: "0% of total" },
  { label: "Shopping", pct: "0% of total" },
];

function AccountScreen() {
  const { id } = Route.useParams();
  const router = useRouter();
  const accounts = useAccounts();
  const [tab, setTab] = useState<Tab>("all");

  const account = accounts.find((a) => a.id === (id as AccountId)) ?? accounts[0]!;
  const isSavings = account.id === "savings";

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-md">
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur">
          <button onClick={() => router.history.back()} aria-label="Back">
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="flex-1 text-base font-bold">{account.name}</h1>
          <Settings className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </header>

        {!isSavings && (
          <div className="flex gap-2 px-4 pb-4">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  tab === t.id
                    ? "bg-foreground text-background"
                    : "border border-border bg-surface text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {isSavings ? (
          <>
            <section className="px-4 pb-5 text-center">
              <p className="text-[13px] font-medium">Available balance</p>
              <p className="font-display mt-1 text-4xl font-extrabold">
                {formatUSD(account.balance)}
              </p>
            </section>

            <section className="px-4">
              <button className="flex w-full items-center justify-between border-t border-border py-4">
                <span className="text-[13px] font-medium">Interest earned</span>
                <span className="flex items-center gap-1 text-[13px] font-bold text-[#0d8a3c]">
                  +$0.00
                  <ChevronRight className="size-4 text-foreground" aria-hidden="true" />
                </span>
              </button>
              <button className="flex w-full items-center justify-between border-t border-border py-4">
                <span className="text-[13px] font-medium">Current APY</span>
                <span className="flex items-center gap-1 text-[13px] font-medium">
                  1.00%
                  <ChevronRight className="size-4" aria-hidden="true" />
                </span>
              </button>
              <button className="flex w-full items-center justify-between border-t border-border py-4">
                <span className="text-[13px] font-medium">Auto Saving</span>
                <span className="flex items-center gap-2">
                  <span className="rounded bg-[#d3382c] px-2 py-0.5 text-[11px] font-bold text-white">
                    Off
                  </span>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </span>
              </button>
            </section>

            <section className="px-4 pb-5 pt-2">
              <Link
                to="/transfer"
                className="block w-full rounded-md bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground"
              >
                Add money
              </Link>
            </section>

            <div className="h-2 bg-muted" />

            <section className="px-4 py-5">
              <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="flex-1">
                  <p className="font-display text-xl font-extrabold leading-snug">
                    Earn 3.75% APY on up to $5,000.00
                  </p>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    Check progress to qualify.
                  </p>
                  <button className="mt-3 rounded-md border border-primary px-4 py-2 text-[13px] font-bold text-primary">
                    See progress
                  </button>
                </div>
                <img
                  src={savingsPig.url}
                  alt="Piggy bank with a coin going in"
                  className="h-32 w-auto shrink-0 object-contain"
                />
              </div>
            </section>
          </>
        ) : tab === "all" ? (
          <section className="px-4 pb-5 text-center">
            <p className="text-[13px] font-medium">Available balance</p>
            <p className="font-display mt-1 text-4xl font-extrabold">
              {formatUSD(account.balance)}
            </p>
            <Link
              to="/transfer"
              className="mt-4 block w-full rounded-md bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground"
            >
              Add Money
            </Link>
          </section>
        ) : (
          <section className="px-4 pb-5">
            <p className="flex items-center justify-center gap-1 text-center text-[13px] font-medium">
              {tab === "in" ? "Total income so far this month" : "Total spend so far this month"}
              <Info className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </p>
            <p className="font-display mt-1 text-center text-4xl font-extrabold">$0.00</p>

            <div className="relative mt-5 h-40">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute inset-x-0 border-t border-border"
                  style={{ top: `${i * 25}%` }}
                />
              ))}
              <span className="absolute right-0 top-0 -translate-y-1/2 bg-background pl-1 text-[11px] text-muted-foreground">
                $300
              </span>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-background pl-1 text-[11px] text-muted-foreground">
                $150
              </span>
              <span className="absolute bottom-0 right-0 translate-y-1/2 bg-background pl-1 text-[11px] text-muted-foreground">
                $0
              </span>
            </div>
            <div className="mt-2 flex justify-between px-1 text-[11px] text-muted-foreground">
              {months.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>

            {tab === "in" ? (
              <div className="mt-5 flex items-start gap-3 rounded-lg bg-muted p-4">
                <span className="font-display grid size-6 shrink-0 place-items-center rounded-full border border-foreground text-[11px] font-bold">
                  $
                </span>
                <p className="text-[13px] leading-snug">
                  Fund your account or add direct deposit to start tracking insights.
                </p>
              </div>
            ) : (
              <>
                <h2 className="mt-6 text-sm font-bold">Spending by category</h2>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {categories.map((c, i) => (
                    <div
                      key={c.label}
                      className={`shrink-0 rounded-md border px-4 py-3 text-center ${
                        i === 0 ? "border-foreground" : "border-border"
                      }`}
                    >
                      <p className="text-[13px] font-medium">{c.label}</p>
                      {c.pct && (
                        <p className="text-[11px] text-muted-foreground">{c.pct}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg bg-muted p-4 text-center text-[13px]">
                  You haven't spent any money yet this month.
                </div>
              </>
            )}
          </section>
        )}

        <div className="h-2 bg-muted" />

        <section className="px-4 py-5">
          <h2 className="text-sm font-bold">Recent transactions</h2>
          <div className="py-10 text-center">
            <img
              src={emptyActivity.url}
              alt=""
              aria-hidden="true"
              className="mx-auto h-24 w-auto object-contain"
            />
            <p className="mt-5 text-[13px] text-muted-foreground">
              Your activity will be shown here
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
