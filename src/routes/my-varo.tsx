import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Screen, TitleHeader, SectionLabel } from "@/components/varo/Shell";
import { useAuth } from "@/lib/auth";
import { isLoggedIn } from "@/lib/auth-guard";


export const Route = createFileRoute("/my-varo")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "My Varo — Profile, Cards & Settings" },
      {
        name: "description",
        content:
          "Manage your Varo profile, cards, security settings, direct deposit details and support options.",
      },
      { property: "og:title", content: "My Varo — Profile, Cards & Settings" },
      {
        property: "og:description",
        content:
          "Manage your Varo profile, cards, security settings, direct deposit details and support options.",
      },
    ],
  }),
  component: MyVaroScreen,
});

const groups: { label?: string; rows: { title: string; pill?: string; tone?: "lime" | "mint" }[] }[] =
  [
    {
      rows: [
        { title: "Personal details" },
        { title: "Notification settings" },
        { title: "Manage cards and accounts" },
        { title: "Statements and documents" },
        { title: "Invite friends", pill: "Get $100", tone: "lime" },
      ],
    },
    {
      label: "Help",
      rows: [
        { title: "Help and support", pill: "Chat Available", tone: "mint" },
        { title: "Disputes" },
        { title: "Legal and privacy" },
        { title: "Log out" },
      ],
    },
  ];

function MyVaroScreen() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleRowClick = (title: string) => {
    if (title === "Log out") {
      logout();
      navigate({ to: "/login", replace: true });
    } else if (title === "Personal details") {
      navigate({ to: "/personal-details" });
    } else if (title === "Manage cards and accounts") {
      navigate({ to: "/manage-cards" });
    }
  };

  return (
    <Screen header={<TitleHeader title="My Varo" />}>
      <section className="flex items-center gap-3 py-2">
        <div
          className="flex size-12 items-center justify-center rounded-full text-base font-bold text-white"
          style={{ backgroundColor: "oklch(0.31 0.06 160)" }}
        >
          {user.initials}
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-semibold">{user.fullName}</p>
          <p className="text-[12px] text-muted-foreground">Joined July 2025</p>
        </div>
      </section>

      {groups.map((group, i) => (
        <div key={group.label ?? i}>
          {group.label && <SectionLabel>{group.label}</SectionLabel>}
          <ul>
            {group.rows.map((row) => (
              <li key={row.title}>
                <button
                  onClick={() => handleRowClick(row.title)}
                  className="flex w-full items-center gap-3 border-b border-border py-4 text-left last:border-b-0"
                >
                  <span className="flex-1 text-[15px]">{row.title}</span>
                  {row.pill && (
                    <span
                      className={
                        row.tone === "lime"
                          ? "rounded bg-lime px-2 py-1 text-[11px] font-semibold text-lime-foreground"
                          : "rounded bg-mint px-2 py-1 text-[11px] font-semibold text-mint-foreground"
                      }
                    >
                      {row.pill}
                    </span>
                  )}
                  <ChevronRight className="size-5 text-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <p className="mt-6 text-center text-[11px] text-muted-foreground">Varo Bank, N.A.</p>
    </Screen>
  );
}
