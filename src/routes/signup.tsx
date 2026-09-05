import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthScreen, Field } from "@/components/varo/AuthShell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up for Varo — Open a Bank Account" },
      {
        name: "description",
        content:
          "Create your Varo account in minutes: no monthly fees, no minimum balance, and cashback on everyday spending.",
      },
      { property: "og:title", content: "Sign up for Varo — Open a Bank Account" },
      {
        property: "og:description",
        content: "Create your Varo account in minutes: no monthly fees and no minimum balance.",
      },
    ],
  }),
  component: SignupScreen,
});

function SignupScreen() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/", replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <AuthScreen>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
          navigate({ to: "/", replace: true });
        }}
      >
        <h1 className="mb-6 screen-title">Create your account</h1>
        <Field label="First name" value={firstName} onChange={setFirstName} />
        <Field label="Last name" value={lastName} onChange={setLastName} />
        <Field
          label="Email address or phone number"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <Field label="Create password" value={password} onChange={setPassword} reveal />

        <p className="text-[12px] leading-snug text-muted-foreground">
          By continuing you agree to the Varo Terms of Service and Privacy Policy. Varo Bank, N.A.
          Member FDIC.
        </p>

        <button
          type="submit"
          className="mt-6 h-14 w-full rounded-md bg-primary text-[15px] font-bold text-primary-foreground"
        >
          Continue
        </button>
        <Link
          to="/login"
          className="mt-3 flex h-14 w-full items-center justify-center rounded-md border border-primary text-[15px] font-bold text-primary"
        >
          I already have an account
        </Link>
      </form>
    </AuthScreen>
  );
}
