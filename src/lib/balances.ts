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

export function spend(from: AccountId, amount: number): boolean {
  if (!hydrated) {
    hydrated = true;
    state = read();
  }
  if (amount <= 0 || state[from] < amount) return false;
  state = { ...state, [from]: state[from] - amount };
  persist();
  emit();
  return true;
}

// --- Transaction ledger (persisted) ---

export type Txn = {
  id: string;
  accountId: AccountId;
  title: string;
  detail: string;
  amount: number;
  direction: "out" | "in";
  date: string; // ISO
};

const TX_KEY = "varo_transactions";

let txState: Txn[] = [];
let txHydrated = false;
const txListeners = new Set<() => void>();
let txSnapshot: Txn[] = [];
const txServerSnapshot: Txn[] = [];

function txRead(): Txn[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Txn[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function txSubscribe(listener: () => void) {
  if (!txHydrated) {
    txHydrated = true;
    txState = txRead();
    txSnapshot = txState;
  }
  txListeners.add(listener);
  return () => {
    txListeners.delete(listener);
  };
}

export function useTransactions(): Txn[] {
  return useSyncExternalStore(txSubscribe, () => txSnapshot, () => txServerSnapshot);
}

export function addTransaction(tx: Omit<Txn, "id" | "date">) {
  if (!txHydrated) {
    txHydrated = true;
    txState = txRead();
  }
  const entry: Txn = {
    ...tx,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
  };
  txState = [entry, ...txState];
  txSnapshot = txState;
  try {
    window.localStorage.setItem(TX_KEY, JSON.stringify(txState));
  } catch {
    /* ignore */
  }
  for (const l of txListeners) l();
}

export function formatUSD(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
