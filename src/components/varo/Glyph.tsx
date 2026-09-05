import { art } from "./art";

const glyphs = {
  fuel: art.cashbackCar,
  wallet: art.accountCard,
  savings: art.savingsBag,
  card: art.believeCard,
  phone: art.cashapp,
  cash: art.depositCash,
  bank: art.bankTransfer,
  sprout: art.advance,
  coins: art.lineOfCredit,
  transfer: art.transfer,
  send: art.varoToAnyone,
  applepay: art.applePay,
  hand: art.fundInstantly,
  bills: art.manageBills,
  zelle: art.zelle,
  check: art.depositCheck,
  deposit: art.directDeposit,
  addcash: art.addCash,
  atm: art.findAtm,
  history: art.transactionHistory,
  offers: art.myOffers,
  bag: art.heroDirectDeposit,
  gas: art.gasMoney,
  building: art.linkAccounts,
  friends: art.inviteFriends,
  catgas: art.catGas,
  catgrocery: art.catGrocery,
  catfood: art.catFood,
  catshopping: art.catShopping,
} as const;

export type GlyphName = keyof typeof glyphs;

export function Glyph({ name, size = "md" }: { name: GlyphName; size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-16 w-auto max-w-24" : "size-9";
  return (
    <img
      src={glyphs[name]}
      alt=""
      aria-hidden="true"
      className={`${box} shrink-0 object-contain`}
      loading="lazy"
    />
  );
}
