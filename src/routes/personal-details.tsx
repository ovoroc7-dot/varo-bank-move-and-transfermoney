import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Pencil } from "lucide-react";
import { isLoggedIn } from "@/lib/auth-guard";
import { DetailScreen, Toggle } from "@/components/varo/DetailScreen";
import { ACCOUNT } from "@/lib/account";

export const Route = createFileRoute("/personal-details")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Personal Details — Varo" },
      {
        name: "description",
        content:
          "View and update your Varo profile photo, name, home address, phone number, email and security settings.",
      },
      { property: "og:title", content: "Personal Details — Varo" },
      {
        property: "og:description",
        content:
          "View and update your Varo profile photo, name, home address, phone number, email and security settings.",
      },
    ],
  }),
  component: PersonalDetails,
});

const HOME_ADDRESS = "1720 Sandy Hollow Loop, Middleburg, FL, 32068, US";
const PHONE = "+1 (973) 570-8030";

function Field({
  label,
  value,
  editable = true,
}: {
  label: string;
  value: string;
  editable?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-3.5">
      <div className="flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-[15px] leading-snug">{value}</p>
      </div>
      {editable && (
        <button aria-label={`Edit ${label.toLowerCase()}`} className="mt-3 shrink-0">
          <Pencil className="size-5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

function PersonalDetails() {
  const [faceId, setFaceId] = useState(true);

  return (
    <DetailScreen title="Personal details">
      <div className="flex flex-col items-center pt-4">
        <div className="flex size-32 items-center justify-center rounded-full bg-[#e3d5f7]">
          <svg viewBox="0 0 48 48" className="size-24" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="22" stroke="#7c3aed" strokeWidth="2.5" />
            <circle cx="24" cy="19" r="6.5" stroke="#7c3aed" strokeWidth="2.5" />
            <path
              d="M9 38a15 15 0 0 1 30 0"
              stroke="#7c3aed"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <button className="mt-3 text-[13px] font-bold text-primary">Upload photo</button>
      </div>

      <div className="mt-4">
        <Field label="Name" value={ACCOUNT.fullName} editable={false} />
        <Field label="Home address" value={HOME_ADDRESS} />
        <Field label="Phone number" value={PHONE} />
        <Field label="Email address" value={ACCOUNT.email} />
      </div>

      <h2 className="mt-6 text-[15px] font-bold">Security</h2>
      <button className="mt-1 flex w-full items-center gap-3 border-b border-border py-4 text-left">
        <span className="flex-1 text-[15px]">Change password</span>
        <ChevronRight className="size-5" />
      </button>
      <div className="flex items-center gap-3 border-b border-border py-4">
        <span className="flex-1 text-[15px]">Face ID</span>
        <Toggle checked={faceId} onChange={setFaceId} label="Face ID" />
      </div>
    </DetailScreen>
  );
}
