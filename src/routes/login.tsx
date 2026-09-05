import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AuthScreen, Field, Splash } from "@/components/varo/AuthShell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in to Varo — Mobile Banking" },
      {
        name: "description",
        content:
          "Log in to your Varo account with your email address or phone number, or sign up for a new Varo Bank Account.",
      },
      { property: "og:title", content: "Log in to Varo — Mobile Banking" },
      {
        property: "og:description",
        content: "Log in to your Varo account, or sign up for a new Varo Bank Account.",
      },
    ],
  }),
  component: LoginScreen,
});

function LoginScreen() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [splash, setSplash] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/", replace: true });
  }, [isAuthenticated, navigate]);

  const onSplashDone = useCallback(() => setSplash(false), []);

  if (splash) return <Splash onDone={onSplashDone} />;

  return (
    <AuthScreen>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (login(email, password)) {
            setError("");
            navigate({ to: "/", replace: true });
          } else {
            setError("That email or password doesn't match our records.");
          }
        }}
      >
        <Field
          label="Email address or phone number"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <Field label="Password" value={password} onChange={setPassword} reveal />

        {error && (
          <p role="alert" className="mb-4 text-[13px] font-medium text-destructive">
            {error}
          </p>
        )}


        <button type="button" className="text-[13px] font-bold text-primary underline">
          Forgot password
        </button>

        <button
          type="submit"
          className="mt-7 h-14 w-full rounded-md bg-primary text-[15px] font-bold text-primary-foreground"
        >
          Log in
        </button>
        <Link
          to="/signup"
          className="mt-3 flex h-14 w-full items-center justify-center rounded-md border border-primary text-[15px] font-bold text-primary"
        >
          Sign up
        </Link>
      </form>
    </AuthScreen>
  );
}
