import { useSyncExternalStore } from "react";

export type AccountId = "bank" | "savings";

export type VaroAccount = {
  id: AccountId;
  name: string;
  last4: string;
  balance: number;
};

const STORAGE_KEY = "varo_balances";

const DEFAULTS: Record<AccountId, number> = {
  bank: 50500,
  savings: 0,
};

const META: Record<AccountId, { name: string; last4: string }> = {
  bank: { name: "Varo Bank Account", last4: "3046" },
  savings: { name: "Varo Savings Account", last4: "2987" },
};

let state: Record<AccountId, number> = { ...DEFAULTS };
let hydrated = false;

const listeners = new Set<() => void>();

function read(): Record<AccountId, number> {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<Record<AccountId, number>>;
    return {
      bank: typeof parsed.bank === "number" ? parsed.bank : DEFAULTS.bank,
      savings: typeof parsed.savings === "number" ? parsed.savings : DEFAULTS.savings,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    state = read();
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

let snapshot: VaroAccount[] = buildSnapshot();
let snapshotSource = state;

function buildSnapshot(): VaroAccount[] {
  return (Object.keys(META) as AccountId[]).map((id) => ({
    id,
    name: META[id].name,
    last4: META[id].last4,
    balance: state[id],
  }));
}

function getSnapshot(): VaroAccount[] {
  if (snapshotSource !== state) {
    snapshotSource = state;
    snapshot = buildSnapshot();
  }
  return snapshot;
}

const serverSnapshot: VaroAccount[] = (Object.keys(META) as AccountId[]).map((id) => ({
  id,
  name: META[id].name,
  last4: META[id].last4,
  balance: DEFAULTS[id],
}));

function getServerSnapshot(): VaroAccount[] {
  return serverSnapshot;
}

export function useAccounts(): VaroAccount[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function transfer(from: AccountId, to: AccountId, amount: number): boolean {
  if (!hydrated) {
    hydrated = true;
    state = read();
  }
  if (from === to || amount <= 0 || state[from] < amount) return false;
  state = { ...state, [from]: state[from] - amount, [to]: state[to] + amount };
  persist();
  emit();
  return true;
}

export function formatUSD(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
