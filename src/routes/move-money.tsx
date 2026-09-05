import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Screen, TitleHeader, Pill } from "@/components/varo/Shell";
import { Glyph, type GlyphName } from "@/components/varo/Glyph";
import { isLoggedIn } from "@/lib/auth-guard";

export const Route = createFileRoute("/move-money")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Move Money — Transfer, Zelle & Direct Deposit" },
      {
        name: "description",
        content:
          "Transfer between accounts, send money to anyone instantly, pay bills, use Zelle, add cash or set up direct deposit.",
      },
      { property: "og:title", content: "Move Money — Transfer, Zelle & Direct Deposit" },
      {
        property: "og:description",
        content:
          "Transfer between accounts, send money to anyone instantly, pay bills, use Zelle, add cash or set up direct deposit.",
      },
    ],
  }),
  component: MoveMoneyScreen,
});

const primary: { glyph: GlyphName; title: string; sub: string; tag?: string }[] = [
  { glyph: "transfer", title: "Transfer", sub: "Move money between your accounts" },
  { glyph: "send", title: "Varo to Anyone", sub: "Send money to anyone instantly" },
  { glyph: "applepay", title: "Apple Pay", sub: "Add money instantly", tag: "✦ New" },
  {
    glyph: "hand",
    title: "Fund instantly",
    sub: "Add money to your account from a debit card",
    tag: "⚡ Instant",
  },
  { glyph: "bills", title: "Manage bills", sub: "View and pay bills" },
  { glyph: "zelle", title: "Zelle®", sub: "Send and receive money fast with Zelle®" },
];

const more: { glyph: GlyphName; title: string }[] = [
  { glyph: "check", title: "Deposit check" },
  { glyph: "deposit", title: "Direct deposit" },
  { glyph: "addcash", title: "Add cash" },

  { glyph: "atm", title: "Find ATM" },
  { glyph: "history", title: "Transaction history" },
];

function MoveMoneyScreen() {
  return (
    <Screen header={<TitleHeader title="Move Money" />}>
      <ul className="card-surface overflow-hidden">
        {primary.map((row) => (
          <li key={row.title}>
            {(() => {
              const inner = (
                <>
                  <Glyph name={row.glyph} />
                  <span className="flex-1">
                    <span className="block text-sm font-bold">{row.title}</span>
                    <span className="block text-[12px] leading-snug text-muted-foreground">
                      {row.sub}
                    </span>
                  </span>
                  {row.tag && <Pill>{row.tag}</Pill>}
                  <ChevronRight className="size-4 text-muted-foreground" />
                </>
              );
              const cls =
                "flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left last:border-b-0";
              const href =
                row.title === "Transfer"
                  ? "/transfer"
                  : row.title === "Manage bills"
                    ? "/pay-bills"
                    : null;
              return href ? (
                <Link to={href} className={cls}>
                  {inner}
                </Link>
              ) : (
                <button className={cls}>{inner}</button>
              );
            })()}
          </li>
        ))}
      </ul>

      <h2 className="mb-2 mt-6 text-sm font-bold">More ways to move money</h2>
      <ul className="card-surface overflow-hidden">
        {more.map((row) => (
          <li key={row.title}>
            <button className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left last:border-b-0">
              <Glyph name={row.glyph} />
              <span className="flex-1 text-sm font-medium">{row.title}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  );
}
