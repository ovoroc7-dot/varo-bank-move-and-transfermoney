import { createFileRoute, redirect } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import { DetailScreen } from "@/components/varo/DetailScreen";

export const Route = createFileRoute("/linked-accounts")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Linked Cards and Accounts — Varo" },
      {
        name: "description",
        content:
          "Link an external debit card or bank account to move money in and out of your Varo Bank Account.",
      },
      { property: "og:title", content: "Linked Cards and Accounts — Varo" },
      {
        property: "og:description",
        content:
          "Link an external debit card or bank account to move money in and out of your Varo Bank Account.",
      },
    ],
  }),
  component: LinkedAccounts,
});

function LinkedAccounts() {
  return (
    <DetailScreen title="Linked cards and accounts">
      <p className="pt-2 text-[14px] leading-snug text-muted-foreground">
        You haven&apos;t linked any cards or accounts yet. Link one to move money between Varo and
        your other banks.
      </p>
      <button className="mt-5 flex w-full items-center gap-3 border-b border-t border-border py-4 text-left">
        <Plus className="size-5 text-primary" />
        <span className="flex-1 text-[15px] font-bold text-primary">Link a card or account</span>
      </button>
    </DetailScreen>
  );
}
