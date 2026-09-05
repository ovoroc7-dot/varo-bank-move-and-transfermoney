import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, Delete, Landmark, CircleDollarSign, Check } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import { useAccounts, transfer, formatUSD, type AccountId, type VaroAccount } from "@/lib/balances";

export const Route = createFileRoute("/transfer")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Transfer — Move Money Between Varo Accounts" },
      {
        name: "description",
        content:
          "Transfer money between your Varo Bank Account and Varo Savings Account instantly, with no fees.",
      },
      { property: "og:title", content: "Transfer — Move Money Between Varo Accounts" },
      {
        property: "og:description",
        content:
          "Transfer money between your Varo Bank Account and Varo Savings Account instantly, with no fees.",
      },
    ],
  }),
  component: TransferScreen,
});

function TransferScreen() {
  const router = useRouter();
  const accounts = useAccounts();

  const [from, setFrom] = useState<AccountId | null>(null);
  const [to, setTo] = useState<AccountId | null>(null);
  const [cents, setCents] = useState(0);
  const [sheet, setSheet] = useState<null | "from" | "to">(null);
  const [step, setStep] = useState<"amount" | "review" | "done">("amount");
  const [error, setError] = useState<string | null>(null);

  const byId = (id: AccountId | null) => accounts.find((a) => a.id === id) ?? null;
  const fromAccount = byId(from);
  const toAccount = byId(to);
  const amount = cents / 100;
  const canContinue = !!from && !!to && from !== to && cents > 0;

  function press(key: string) {
    setError(null);
    if (key === "del") {
      setCents((c) => Math.floor(c / 10));
      return;
    }
    setCents((c) => {
      const next = Number(`${c}${key}`);
      return next > 99_999_999 ? c : next;
    });
  }

  function choose(id: AccountId) {
    if (sheet === "from") {
      setFrom(id);
      if (to === id) setTo(null);
    } else if (sheet === "to") {
      setTo(id);
      if (from === id) setFrom(null);
    }
    setSheet(null);
  }

  function submit() {
    if (!from || !to) return;
    if (transfer(from, to, amount)) {
      setStep("done");
    } else {
      setStep("amount");
      setError("You don't have enough available to make this transfer.");
    }
  }

  if (step === "done" && fromAccount && toAccount) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-8 pt-16 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-8" strokeWidth={3} />
          </div>
          <h1 className="screen-title mt-6">Transfer complete</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {formatUSD(amount)} moved from {fromAccount.name} to {toAccount.name}.
          </p>
          <div className="card-surface mt-6 divide-y divide-border text-left">
            {accounts.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-4">
                <VaroMark />
                <span className="flex-1 text-sm font-medium">{a.name}</span>
                <span className="font-display text-base font-extrabold">
                  {formatUSD(a.balance)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto space-y-3 pt-8">
            <button
              onClick={() => {
                setStep("amount");
                setCents(0);
                setFrom(null);
                setTo(null);
              }}
              className="w-full rounded-md border border-primary py-3 text-sm font-bold text-primary"
            >
              Make another transfer
            </button>
            <button
              onClick={() => router.navigate({ to: "/" })}
              className="w-full rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
        <header className="flex items-center gap-4 px-4 py-4">
          <button
            aria-label="Go back"
            onClick={() => router.history.back()}
            className="text-foreground"
          >
            <ArrowLeft className="size-5" />
          </button>
          <span className="text-base font-medium">Transfer</span>
        </header>

        <div className="px-4">
          <SelectorRow
            label="From:"
            account={fromAccount}
            onClick={() => setSheet("from")}
          />
          <SelectorRow label="To:" account={toAccount} onClick={() => setSheet("to")} />
        </div>

        <div className="flex flex-1 flex-col justify-center px-4 py-10 text-center">
          <p className="font-display text-5xl font-extrabold tracking-tight">
            {formatUSD(amount)}
          </p>
          {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}
          <div className="mt-6 flex items-start gap-2 text-left">
            <span className="font-display text-xs font-extrabold tracking-tight">FDIC</span>
            <p className="text-[12px] leading-snug text-muted-foreground">
              FDIC-Insured – Backed by the full faith and credit of the U.S. Government
            </p>
          </div>
        </div>

        <div className="px-4">
          <button
            disabled={!canContinue}
            onClick={() => setStep("review")}
            className="w-full rounded-md bg-muted py-3.5 text-sm font-bold text-muted-foreground disabled:opacity-100 enabled:bg-primary enabled:text-primary-foreground"
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-3 gap-y-2 px-2 pb-6 pt-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "del"].map((key) => (
            <button
              key={key}
              aria-label={key === "del" ? "Delete" : key}
              onClick={() => press(key)}
              className="flex h-12 items-center justify-center rounded-md text-xl font-medium active:bg-muted"
            >
              {key === "del" ? <Delete className="size-6" aria-hidden="true" /> : key}
            </button>
          ))}
        </div>

        {sheet && (
          <AccountSheet
            title={sheet === "from" ? "Transfer from" : "Transfer to"}
            accounts={accounts}
            disabledId={sheet === "from" ? to : from}
            onSelect={choose}
            onClose={() => setSheet(null)}
          />
        )}

        {step === "review" && fromAccount && toAccount && (
          <ReviewSheet
            amount={amount}
            from={fromAccount}
            to={toAccount}
            onClose={() => setStep("amount")}
            onConfirm={submit}
          />
        )}
      </div>
    </div>
  );
}

function VaroMark() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary font-display text-[10px] font-extrabold text-primary-foreground">
      Varo
    </span>
  );
}

function SelectorRow({
  label,
  account,
  onClick,
}: {
  label: string;
  account: VaroAccount | null;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-border py-3 text-left"
    >
      <span className="w-10 text-[13px] font-medium">{label}</span>
      {account ? <VaroMark /> : <Landmark className="size-7 text-muted-foreground" strokeWidth={1.5} />}
      <span className="flex-1 text-sm">
        {account ? (
          <>
            <span className="block font-medium">
              {account.name} • {account.last4}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Available: {formatUSD(account.balance)}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">Select an account</span>
        )}
      </span>
      <ChevronDown className="size-4 text-muted-foreground" />
    </button>
  );
}

function Sheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col justify-end">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40"
      />
      <div className="relative rounded-t-2xl bg-surface pb-6 pt-2">
        <div className="mx-auto h-1 w-10 rounded-full bg-border" />
        {children}
      </div>
    </div>
  );
}

function AccountSheet({
  title,
  accounts,
  disabledId,
  onSelect,
  onClose,
}: {
  title: string;
  accounts: VaroAccount[];
  disabledId: AccountId | null;
  onSelect: (id: AccountId) => void;
  onClose: () => void;
}) {
  return (
    <Sheet onClose={onClose}>
      <h2 className="px-4 pb-3 pt-4 text-lg font-bold">{title}</h2>
      <p className="section-label px-4 pb-1">Varo Accounts</p>
      <ul>
        {accounts.map((a) => (
          <li key={a.id}>
            <button
              disabled={a.id === disabledId}
              onClick={() => onSelect(a.id)}
              className="flex w-full items-center gap-3 border-t border-border px-4 py-3.5 text-left disabled:opacity-40"
            >
              <VaroMark />
              <span className="flex-1">
                <span className="block text-sm font-medium">
                  {a.name} • {a.last4}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  Available: {formatUSD(a.balance)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3 border-t border-border px-4 py-3.5">
        <CircleDollarSign className="size-7 text-foreground" strokeWidth={1.5} />
        <span className="flex-1 text-sm font-medium">Link an account</span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
    </Sheet>
  );
}

function ReviewSheet({
  amount,
  from,
  to,
  onClose,
  onConfirm,
}: {
  amount: number;
  from: VaroAccount;
  to: VaroAccount;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Sheet onClose={onClose}>
      <h2 className="px-4 pb-3 pt-4 text-lg font-bold">Review transfer</h2>
      <dl className="divide-y divide-border border-t border-border">
        <Row label="Amount" value={formatUSD(amount)} />
        <Row label="From" value={`${from.name} • ${from.last4}`} />
        <Row label="To" value={`${to.name} • ${to.last4}`} />
        <Row label="Arrives" value="Instantly" />
      </dl>
      <div className="px-4 pt-4">
        <button
          onClick={onConfirm}
          className="w-full rounded-md bg-primary py-3.5 text-sm font-bold text-primary-foreground"
        >
          Transfer money
        </button>
      </div>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-[13px] text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}
