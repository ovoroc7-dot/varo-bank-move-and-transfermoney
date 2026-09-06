import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import badgeFee from "@/assets/varo/badge-fee.png";
import badgeDollar from "@/assets/varo/badge-dollar.png";
import retailers from "@/assets/varo/retailers.png";

export const Route = createFileRoute("/add-cash")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Deposit Cash at 90,000+ Locations — Varo" },
      {
        name: "description",
        content:
          "Add cash to your Varo Bank Account at over 90,000 locations, with fee-free options at 7,500 CVS and Kroger stores.",
      },
      { property: "og:title", content: "Deposit Cash at 90,000+ Locations — Varo" },
      {
        property: "og:description",
        content:
          "Add cash to your Varo Bank Account at over 90,000 locations, with fee-free options at 7,500 CVS and Kroger stores.",
      },
    ],
  }),
  component: AddCash,
});

function AddCash() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-md">
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur">
          <button onClick={() => router.history.back()} aria-label="Back">
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="flex-1 text-base font-bold">Add cash</h1>
          <button className="text-[13px] font-bold text-primary">FAQ</button>
        </header>

        <div className="px-4 pt-8">
          <h2 className="font-display text-[30px] font-extrabold uppercase leading-[1.05] tracking-tight">
            Add cash at 90,000+ locations
          </h2>
          <p className="mt-5 text-[15px] leading-snug">
            Ask the cashier to scan your barcode¹ or swipe your Varo Debit Card.
          </p>

          <ul className="mt-6">
            <li className="flex items-start gap-4 border-b border-border py-4">
              <img src={badgeFee} alt="" aria-hidden="true" className="size-10 shrink-0" />
              <div>
                <p className="text-[15px] leading-snug">
                  Enjoy fee-free options at 7,500 CVS® and Kroger® locations²
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">Add up to $1,500 daily.</p>
              </div>
            </li>
            <li className="flex items-start gap-4 border-b border-border py-4">
              <img src={badgeDollar} alt="" aria-hidden="true" className="size-10 shrink-0" />
              <div>
                <p className="text-[15px] leading-snug">
                  Or add cash for a fee at other participating retailers
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  Retail service fee up to $4.95 and limits may apply.
                </p>
              </div>
            </li>
          </ul>

          <img
            src={retailers}
            alt="CVS, 7-Eleven, Kroger and Walgreens"
            className="mt-6 w-full object-contain"
          />

          <div className="mt-6 space-y-2 text-[11px] leading-snug text-muted-foreground">
            <p>¹Availability to add cash with barcode varies by location.</p>
            <p>
              ²Available at all stand-alone CVS location with a cashier in the US, except for
              locations on military bases, within hospitals, or inside Target. Adding cash via
              barcode is free at the Kroger Family of Stores (excluding Harris Teeter stores) from
              7/22/26 until 9/22/26. A retail service fee of up to $4.95 may be charged for adding
              cash with card swipe, and after 9/22/26, a retail service fee of up to $4.95 may be
              charged for all cash adds at the Kroger Family of Stores. Transaction amounts must be
              between $20 and $500. Limits and a retail service fee of up to $4.95 may apply when
              adding cash at other retail locations. ©Copyright 2026{" "}
              <span className="font-bold text-primary underline">CVS.com</span>.
            </p>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md bg-background px-4 pb-6 pt-3">
          <button className="w-full rounded-md bg-primary py-3.5 text-sm font-bold text-primary-foreground">
            Show locations
          </button>
        </div>
      </div>
    </div>
  );
}
