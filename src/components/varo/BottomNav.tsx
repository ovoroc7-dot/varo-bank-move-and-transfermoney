import { Link } from "@tanstack/react-router";
import { art } from "./art";

const tabs = [
  { to: "/", label: "Home", icon: art.navHome, active: art.navHomeActive },
  { to: "/move-money", label: "Move Money", icon: art.navMove, active: art.navMoveActive },
  { to: "/cashback", label: "Cashback", icon: art.navCashback, active: art.navCashbackActive },
  { to: "/my-varo", label: "My Varo", icon: art.navVaro, active: art.navVaroActive },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {tabs.map(({ to, label, icon, active }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1 rounded-md px-1 py-1.5 text-muted-foreground [&.active]:text-foreground"
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? active : icon}
                    alt=""
                    aria-hidden="true"
                    className="size-6 object-contain"
                  />
                  <span
                    className={
                      isActive
                        ? "text-[10px] font-bold leading-none"
                        : "text-[10px] font-medium leading-none"
                    }
                  >
                    {label}
                  </span>
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
