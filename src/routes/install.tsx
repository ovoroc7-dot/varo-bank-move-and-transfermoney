import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Share, Plus } from "lucide-react";
import { art } from "@/components/varo/art";

export const Route = createFileRoute("/install")({
  head: () => ({
    meta: [
      { title: "Get the Varo App — Mobile Banking" },
      {
        name: "description",
        content:
          "Install the Varo mobile banking app to your home screen for instant access to your accounts, savings, and cashback.",
      },
      { property: "og:title", content: "Get the Varo App — Mobile Banking" },
      {
        property: "og:description",
        content:
          "Install the Varo app to your home screen for instant access to your accounts, savings, and cashback.",
      },
    ],
  }),
  component: InstallScreen,
});

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function InstallScreen() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isInStandaloneMode());
  const [ios] = useState(isIOS);

  useEffect(() => {
    if (isInStandaloneMode()) {
      setInstalled(true);
      return;
    }
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferred(null);
  };

  return (
    <div className="bg-splash flex min-h-screen flex-col items-center px-6 pb-10 text-center text-splash-foreground">
      <div className="flex flex-1 flex-col items-center justify-center">
        <img src={art.logo} alt="Varo" className="h-16 w-auto object-contain brightness-0 invert" />
        <h1 className="font-display mt-6 text-4xl font-black tracking-tight">Varo</h1>
        <p className="mt-3 max-w-xs text-[15px] leading-snug text-splash-foreground/80">
          Mobile banking that moves with you. Install the app for instant access to your accounts,
          savings, and cashback.
        </p>

        {installed ? (
          <div className="mt-8 w-full max-w-xs">
            <p className="text-[13px] font-medium text-splash-foreground/80">
              Varo is installed on this device.
            </p>
            <Link
              to="/login"
              className="mt-4 flex h-14 w-full items-center justify-center rounded-md bg-surface text-[15px] font-bold text-primary"
            >
              Open & log in
            </Link>
          </div>
        ) : ios ? (
          <div className="mt-8 w-full max-w-xs rounded-xl bg-surface/10 p-4 text-left text-[13px]">
            <p className="flex items-center gap-2">
              1. Tap the <Share className="size-4" /> Share button in Safari.
            </p>
            <p className="mt-2 flex items-center gap-2">
              2. Scroll down and tap <Plus className="size-4" /> "Add to Home Screen".
            </p>
            <p className="mt-2">3. Tap "Add" in the top right.</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={install}
            disabled={!deferred}
            className="mt-8 h-14 w-full max-w-xs rounded-md bg-surface text-[15px] font-bold text-primary transition-opacity disabled:opacity-70"
          >
            {deferred ? "Install app" : "Add Varo to your home screen"}
          </button>
        )}
      </div>
    </div>
  );
}
