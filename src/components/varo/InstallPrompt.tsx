import { useEffect, useState } from "react";
import { X, Share, Plus } from "lucide-react";

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

const DISMISS_KEY = "varo_install_dismissed";

/**
 * Install-to-home-screen prompt.
 * - Android/Chrome: captures `beforeinstallprompt` and triggers the native install dialog.
 * - iPhone/Safari: shows "Share → Add to Home Screen" instructions.
 * - Hidden when already installed or previously dismissed.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [ios] = useState(isIOS);

  useEffect(() => {
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // iOS never fires beforeinstallprompt — show manual instructions instead.
    if (isIOS()) setVisible(true);

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferred(null);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-6">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-5 shadow-[0_-4px_30px_rgba(0,0,0,0.25)] ring-1 ring-border">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/icon-192.png"
              alt="Varo app icon"
              className="h-12 w-12 rounded-xl"
            />
            <div>
              <p className="text-[15px] font-bold text-foreground">Install the Varo app</p>
              <p className="text-[12px] text-muted-foreground">
                Add Varo to your home screen for quick access.
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Dismiss install prompt"
            onClick={dismiss}
            className="rounded-full p-1 text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {ios ? (
          <div className="mt-4 space-y-2 text-[13px] text-foreground">
            <p className="flex items-center gap-2">
              1. Tap the <Share className="h-4 w-4 text-primary" /> Share button in Safari.
            </p>
            <p className="flex items-center gap-2">
              2. Scroll down and tap <Plus className="h-4 w-4 text-primary" /> "Add to Home Screen".
            </p>
            <p className="flex items-center gap-2">3. Tap "Add" in the top right.</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={install}
            disabled={!deferred}
            className="mt-4 h-12 w-full rounded-md bg-primary text-[15px] font-bold text-primary-foreground disabled:opacity-60"
          >
            Install app
          </button>
        )}
      </div>
    </div>
  );
}
