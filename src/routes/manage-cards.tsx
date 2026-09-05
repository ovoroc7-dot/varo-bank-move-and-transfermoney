import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import { DetailScreen } from "@/components/varo/DetailScreen";

export const Route = createFileRoute("/manage-cards")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Manage Cards and Accounts — Varo" },
      {
        name: "description",
        content:
          "Find your Varo account and routing numbers, manage your Varo Debit Card, and see linked cards and accounts.",
      },
      { property: "og:title", content: "Manage Cards and Accounts — Varo" },
      {
        property: "og:description",
        content:
          "Find your Varo account and routing numbers, manage your Varo Debit Card, and see linked cards and accounts.",
      },
    ],
  }),
  component: ManageCards,
});

const rows = [
  { title: "Account numbers", href: "/account-numbers" },
  { title: "Varo cards", href: "/varo-card" },
  { title: "Linked cards and accounts", href: "/linked-accounts" },
] as const;

function ManageCards() {
  return (
    <DetailScreen title="Manage cards and accounts">
      <ul>
        {rows.map((row) => (
          <li key={row.title}>
            <Link
              to={row.href}
              className="flex items-center gap-3 border-b border-border py-4 text-left"
            >
              <span className="flex-1 text-[15px]">{row.title}</span>
              <ChevronRight className="size-5" />
            </Link>
          </li>
        ))}
      </ul>
    </DetailScreen>
  );
}
