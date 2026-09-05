import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import { useAccounts, formatUSD, type AccountId } from "@/lib/balances";
import emptyActivity from "@/assets/varo/empty-activity.png.asset.json";

export const Route = createFileRoute("/transaction-history")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Transaction History — Varo Bank Account Activity" },
      {
        name: "description",
        content:
          "Search and filter your Varo transaction history by account, money in and money out, and review activity month by month.",
      },
      { property: "og:title", content: "Transaction History — Varo Bank Account Activity" },
      {
        property: "og:description",
        content:
          "Search and filter your Varo transaction history by account, money in and money out, and review activity month by month.",
      },
    ],
  }),
  component: TransactionHistoryScreen,
});

type Filter = "all" | "in" | "out";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in", label: "Money in" },
  { id: "out", label: "Money out" },
];

function TransactionHistoryScreen() {
  const router = useRouter();
  const accounts = useAccounts();
  const [accountId, setAccountId] = useState<AccountId>("bank");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const account = accounts.find((a) => a.id === accountId) ?? accounts[0]!;

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-md">
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur">
          <button onClick={() => router.history.back()} aria-label="Back">
            <ArrowLeft className="size-6" strokeWidth={2} />
          </button>
          <h1 className="flex-1 text-[17px] font-semibold">Transaction history</h1>
          <SlidersHorizontal className="size-5 text-muted-foreground" aria-hidden="true" />
        </header>

        <div className="px-4">
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-left"
          >
            <span>
              <span className="block text-sm font-bold">{account.name}</span>
              <span className="block text-[12px] text-muted-foreground">
                ••{account.last4} · {formatUSD(account.balance)} available
              </span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
          </button>

          {pickerOpen && (
            <ul className="mt-2 overflow-hidden rounded-lg border border-border">
              {accounts.map((a) => (
                <li key={a.id}>
                  <button
                    onClick={() => {
                      setAccountId(a.id);
                      setPickerOpen(false);
                    }}
                    className={`flex w-full items-center justify-between border-b border-border px-4 py-3 text-left last:border-b-0 ${
                      a.id === accountId ? "bg-muted" : ""
                    }`}
                  >
                    <span className="text-sm font-medium">{a.name}</span>
                    <span className="text-[12px] text-muted-foreground">••{a.last4}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <label className="mt-3 flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5">
            <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div className="mt-3 flex gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  filter === f.id
                    ? "bg-foreground text-background"
                    : "border border-border bg-surface text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <h2 className="mb-2 mt-6 text-sm font-bold">September 2026</h2>
          <div className="rounded-lg border border-border py-12 text-center">
            <img
              src={emptyActivity.url}
              alt=""
              aria-hidden="true"
              className="mx-auto h-24 w-auto object-contain"
            />
            <p className="mt-5 px-8 text-[13px] text-muted-foreground">
              {query
                ? `No transactions match "${query}".`
                : filter === "in"
                  ? "No money in for this account yet."
                  : filter === "out"
                    ? "No money out for this account yet."
                    : "Your activity will be shown here"}
            </p>
          </div>

          <p className="mt-6 text-center text-[12px] leading-snug text-muted-foreground">
            Transactions are shown for the last 24 months. Pending items may take up to 3 business
            days to post.
          </p>
        </div>
      </div>
    </div>
  );
}
