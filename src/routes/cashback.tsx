import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Screen, TitleHeader } from "@/components/varo/Shell";
import { Glyph, type GlyphName } from "@/components/varo/Glyph";
import { art } from "@/components/varo/art";

import { isLoggedIn } from "@/lib/auth-guard";

export const Route = createFileRoute("/cashback")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Cashback Offers — Activate Deals Near You" },
      {
        name: "description",
        content:
          "Track lifetime cashback earnings and activate top offers near you, from gas bonuses to restaurant deals.",
      },
      { property: "og:title", content: "Cashback Offers — Activate Deals Near You" },
      {
        property: "og:description",
        content:
          "Track lifetime cashback earnings and activate top offers near you, from gas bonuses to restaurant deals.",
      },
    ],
  }),
  component: CashbackScreen,
});

const offers = [
  { brand: "Papa Johns", rate: "14% back", distance: "0.9 mi", logo: art.papaJohns },
  { brand: "Sonic", rate: "16% back", distance: "1.1 mi", logo: art.sonic },
];

const categories: { label: string; glyph: GlyphName }[] = [
  { label: "Gas", glyph: "catgas" },
  { label: "Grocery", glyph: "catgrocery" },
  { label: "Food", glyph: "catfood" },
  { label: "Shopping", glyph: "catshopping" },
];


function CashbackScreen() {
  const [activated, setActivated] = useState<string[]>([]);
  const toggle = (brand: string) =>
    setActivated((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );

  return (
    <Screen header={<TitleHeader title="Cashback" />}>
      <section className="card-surface flex items-center gap-3 p-4">
        <Glyph name="fuel" size="lg" />
        <div className="flex-1">
          <p className="text-[13px] leading-snug">
            A 25¢/gal bonus is included on your next redeemed gas offer.
          </p>
          <button className="mt-1 text-[13px] font-bold text-primary">Learn more</button>
        </div>
      </section>

      <button className="card-surface mt-3 flex w-full items-center gap-3 p-4 text-left">
        <div className="flex-1">
          <p className="text-[13px] text-muted-foreground">My cashback</p>
          <p className="screen-title mt-1">$0.00</p>
          <p className="text-[11px] text-muted-foreground">Lifetime earnings</p>
        </div>
        <ChevronRight className="size-5 text-muted-foreground" />
      </button>

      <button className="card-surface mt-3 flex w-full items-center gap-3 p-4 text-left">
        <Glyph name="offers" />
        <span className="flex-1">
          <span className="block text-sm font-medium">My offers</span>
          <span className="block text-[11px] text-muted-foreground">
            {activated.length} activated
          </span>
        </span>
        <ChevronRight className="size-5 text-muted-foreground" />
      </button>

      <h2 className="mb-2 mt-6 text-sm font-bold">Top Offers for you</h2>
      <div className="grid grid-cols-2 gap-3">
        {offers.map((o) => {
          const on = activated.includes(o.brand);
          return (
            <div key={o.brand} className="card-surface p-3 text-center">
              <div className="flex items-start justify-end">
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {o.distance}
                </span>
              </div>
              <img src={o.logo} alt={o.brand} className="mx-auto mt-3 h-6 w-auto object-contain" />
              <p className="mt-3 text-sm font-bold">{o.brand}</p>

              <p className="text-[12px] text-muted-foreground">{o.rate}</p>
              <button
                onClick={() => toggle(o.brand)}
                className={
                  on
                    ? "mt-3 w-full rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                    : "mt-3 w-full rounded-full border border-primary px-3 py-1.5 text-xs font-bold text-primary"
                }
              >
                {on ? "Activated" : "Activate"}
              </button>
            </div>
          );
        })}
      </div>

      <button className="mt-6 flex w-full items-center justify-between text-left">
        <h2 className="text-sm font-bold">Offers near you</h2>
        <ChevronRight className="size-5 text-muted-foreground" />
      </button>
      <div className="card-surface mt-2 overflow-hidden">
        <div
          className="h-40"
          style={{
            backgroundColor: "oklch(0.95 0.03 90)",
            backgroundImage:
              "linear-gradient(oklch(0.88 0.02 90) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.02 90) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="flex gap-3 p-3">
          {offers.map((o) => (
            <div key={o.brand} className="flex flex-1 items-center gap-2">
              <img src={o.logo} alt={o.brand} className="h-5 w-auto object-contain" />
              <span className="text-[12px] text-muted-foreground">{o.rate}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mb-2 mt-6 text-sm font-bold">Categories</h2>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((c) => (
          <div key={c.label} className="card-surface p-4">
            <Glyph name={c.glyph} />
            <p className="mt-3 text-sm font-medium">{c.label}</p>
          </div>
        ))}
      </div>

    </Screen>
  );
}
