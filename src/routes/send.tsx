import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Delete, Info, Check, User } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import { useAccounts, spend, formatUSD } from "@/lib/balances";

export const Route = createFileRoute("/send")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Varo to Anyone — Send Money Instantly" },
      {
        name: "description",
        content:
          "Send money to anyone with just their email address or US phone number. No fees, arrives instantly.",
      },
      { property: "og:title", content: "Varo to Anyone — Send Money Instantly" },
      {
        property: "og:description",
        content:
          "Send money to anyone with just their email address or US phone number. No fees, arrives instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SendScreen,
});

const MIN = 1;

type Step = "intro" | "recipient" | "amount" | "review" | "done";

type Contact = { name: string; handle: string };

const CONTACTS: Contact[] = [
  { name: "Ava Johnson", handle: "ava.johnson@email.com" },
  { name: "Marcus Lee", handle: "(415) 555-0132" },
  { name: "Sofia Ramirez", handle: "sofia.ramirez@email.com" },
  { name: "Daniel Kim", handle: "(646) 555-0174" },
  { name: "Emily Carter", handle: "emily.carter@email.com" },
  { name: "Jamal Thompson", handle: "(312) 555-0198" },
  { name: "Grace Nguyen", handle: "grace.nguyen@email.com" },
  { name: "Chris Walker", handle: "(206) 555-0127" },
];

function contactMatches(c: Contact, q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const digits = query.replace(/\D/g, "");
  return (
    c.name.toLowerCase().includes(query) ||
    c.handle.toLowerCase().includes(query) ||
    (digits.length > 0 && c.handle.replace(/\D/g, "").includes(digits))
  );
}

function isValidRecipient(value: string) {
  const v = value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return true;
  const digits = v.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

function SendScreen() {
  const router = useRouter();
  const accounts = useAccounts();
  const bank = accounts.find((a) => a.id === "bank")!;

  const [step, setStep] = useState<Step>("intro");
  const [query, setQuery] = useState("");
  const [recipient, setRecipient] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [note, setNote] = useState("");
  const [cents, setCents] = useState(0);

  const amount = cents / 100;
  const showMin = cents > 0 && amount < MIN;
  const overLimit = amount > bank.balance;
  const canNext = amount >= MIN && !overLimit;

  function press(key: string) {
    if (key === "del") {
      setCents((c) => Math.floor(c / 10));
      return;
    }
    setCents((c) => {
      const next = Number(`${c}${key}`);
      return next > 99_999_999_99 ? c : next;
    });
  }

  function back() {
    if (step === "intro") router.history.back();
    else if (step === "recipient") setStep("intro");
    else if (step === "amount") setStep("recipient");
    else setStep("amount");
  }

  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-md flex-col">
          <div className="relative bg-mint px-4 pb-10 pt-4 text-mint-foreground">
            <button aria-label="Go back" onClick={back}>
              <ArrowLeft className="size-5" />
            </button>
            <p className="mt-6 text-center text-[13px] font-bold tracking-wide">
              VARO TO ANYONE
            </p>
            <h1 className="mt-1 text-center font-display text-5xl font-extrabold leading-[0.95] tracking-tight">
              SEND
              <br />
              MONEY TO
              <br />
              ANYONE
            </h1>
          </div>

          <div className="flex-1 bg-surface px-5 pt-6">
            <p className="text-center font-display text-base font-bold italic text-primary">
              FOR REAL
            </p>
            <h2 className="mt-2 text-xl font-bold leading-snug">
              All you need is their phone number or email.
            </h2>
            <ol className="mt-5 space-y-4 text-[13px] leading-snug">
              {[
                "Your friend will receive a text or email notification when you send the money.",
                "All they have to do is enter their debit card info. That's it!",
                "The money arrives in their bank account instantly, no fees. Just like that.",
              ].map((line, i) => (
                <li key={line} className="flex gap-3">
                  <span className="w-4 shrink-0 font-medium">{i + 1}.</span>
                  <span className="text-foreground">{line}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-border bg-surface px-4 py-4">
            <button
              onClick={() => setStep("recipient")}
              className="w-full rounded-md bg-primary py-3.5 text-sm font-bold text-primary-foreground"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "recipient") {
    const valid = isValidRecipient(query);
    const matches = CONTACTS.filter((c) => contactMatches(c, query));
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-surface">
          <SendHeader onBack={back} />
          <div className="px-4">
            <label htmlFor="to" className="text-[12px] font-bold">
              To
            </label>
            <input
              id="to"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter name, email, or phone"
              className="mt-1 w-full rounded-md border border-input px-3 py-3.5 text-sm outline-none focus:border-primary"
            />
          </div>

          {valid ? (
            <div className="mt-5 px-4">
              <p className="text-[12px] font-bold">New recipient</p>
              <button
                onClick={() => {
                  setRecipient(query.trim());
                  setStep("amount");
                }}
                className="mt-3 flex w-full items-center gap-3 text-left"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <User className="size-4" />
                </span>
                <span className="flex-1 text-sm">{query.trim()}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <div className="mt-10 px-5">
              <p className="text-center text-[13px] leading-snug text-foreground">
                To send money to someone new, enter their{" "}
                <span className="font-bold">email address</span> or{" "}
                <span className="font-bold">US phone number.</span>
              </p>
              <div className="card-surface mt-6 flex items-center gap-3 p-4">
                <span className="flex-1">
                  <span className="block text-[13px] leading-snug">
                    Add your contacts to send money to anyone instantly.
                  </span>
                  <span className="mt-1 block text-[12px] font-bold text-primary">
                    Allow access to contacts ›
                  </span>
                </span>
                <span className="text-2xl" aria-hidden="true">
                  🙌
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === "done" && recipient) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-8 pt-16 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-8" strokeWidth={3} />
          </div>
          <h1 className="screen-title mt-6">Money sent</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {formatUSD(amount)} is on its way to {nickname.trim() || recipient}.
          </p>
          <div className="card-surface mt-6 divide-y divide-border text-left">
            <Row label="To" value={recipient} />
            {nickname.trim() && <Row label="Nickname" value={nickname.trim()} />}
            {note.trim() && <Row label="For" value={note.trim()} />}
            <Row label="Amount" value={formatUSD(amount)} />
            <Row label="Varo Bank Account" value={formatUSD(bank.balance)} />
          </div>
          <div className="mt-auto pt-8">
            <button
              onClick={() => router.navigate({ to: "/" })}
              className="w-full rounded-md bg-primary py-3.5 text-sm font-bold text-primary-foreground"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // amount (+ review sheet)
  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-surface">
        <SendHeader onBack={back} />

        <div className="px-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <span className="w-8 text-[13px] font-medium">To:</span>
            <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <User className="size-4" />
            </span>
            <span className="flex-1">
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Add nickname"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <span className="block text-[12px] text-muted-foreground">{recipient}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 border-b border-border py-3">
            <span className="w-8 text-[13px] font-medium">For:</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center py-8 text-center">
          <p className="font-display text-5xl font-extrabold tracking-tight">
            {formatUSD(amount)}
          </p>
          {(showMin || overLimit) && (
            <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] font-medium text-destructive">
              {showMin
                ? "Minimum transfer amount is $1.00"
                : `Your limit for this transfer is ${formatUSD(bank.balance)}`}
              <Info className="size-3.5" aria-hidden="true" />
            </p>
          )}
        </div>

        <div className="px-4">
          <button
            disabled={!canNext}
            onClick={() => setStep("review")}
            className="w-full rounded-md bg-muted py-3.5 text-sm font-bold text-muted-foreground enabled:bg-primary enabled:text-primary-foreground"
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
              className="flex h-12 items-center justify-center rounded-md font-display text-xl font-bold active:bg-muted"
            >
              {key === "del" ? <Delete className="size-6" aria-hidden="true" /> : key}
            </button>
          ))}
        </div>

        {step === "review" && recipient && (
          <div className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col justify-end">
            <button
              aria-label="Close"
              onClick={() => setStep("amount")}
              className="absolute inset-0 bg-foreground/40"
            />
            <div className="relative rounded-t-2xl bg-surface pb-6 pt-2">
              <div className="mx-auto h-1 w-10 rounded-full bg-border" />
              <h2 className="px-4 pb-3 pt-4 text-lg font-bold">Review your transfer</h2>
              <dl className="divide-y divide-border border-t border-border">
                <Row label="Amount" value={formatUSD(amount)} />
                <Row label="To" value={nickname.trim() || recipient} />
                <Row label="Email or phone" value={recipient} />
                {note.trim() && <Row label="For" value={note.trim()} />}
                <Row label="From" value={`${bank.name} • ${bank.last4}`} />
                <Row label="Arrives" value="Instantly" />
              </dl>
              <div className="px-4 pt-4">
                <button
                  onClick={() => {
                    if (spend("bank", amount)) setStep("done");
                    else setStep("amount");
                  }}
                  className="w-full rounded-md bg-primary py-3.5 text-sm font-bold text-primary-foreground"
                >
                  Send money
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SendHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="flex items-center gap-4 px-4 py-4">
      <button aria-label="Go back" onClick={onBack} className="text-foreground">
        <ArrowLeft className="size-5" />
      </button>
      <span className="text-base font-bold">Varo to Anyone</span>
    </header>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-[13px] text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] truncate text-right text-sm font-medium">{value}</dd>
    </div>
  );
}
