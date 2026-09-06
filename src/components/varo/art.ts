// Exact artwork lifted from the Varo screen recording.
import logo from "@/assets/varo/logo.png";
import heroDirectDeposit from "@/assets/varo/hero-direct-deposit.png";
import gasMoney from "@/assets/varo/gas-money.png";
import accountCard from "@/assets/varo/account-card.png";
import cashapp from "@/assets/varo/cashapp.png";
import depositCash from "@/assets/varo/deposit-cash.png";
import bankTransfer from "@/assets/varo/bank-transfer.png";
import savingsBag from "@/assets/varo/savings-bag.png";
import believeCard from "@/assets/varo/believe-card.png";
import advance from "@/assets/varo/advance.png";
import lineOfCredit from "@/assets/varo/line-of-credit.png";
import linkAccounts from "@/assets/varo/link-accounts.png";
import inviteFriends from "@/assets/varo/invite-friends.png";
import transfer from "@/assets/varo/transfer.png";
import varoToAnyone from "@/assets/varo/varo-to-anyone.png";
import applePay from "@/assets/varo/apple-pay.png";
import fundInstantly from "@/assets/varo/fund-instantly.png";
import manageBills from "@/assets/varo/manage-bills.png";
import zelle from "@/assets/varo/zelle.png";
import depositCheck from "@/assets/varo/deposit-check.png";
import directDeposit from "@/assets/varo/direct-deposit.png";
import addCash from "@/assets/varo/add-cash.png";
import findAtm from "@/assets/varo/find-atm.png";
import transactionHistory from "@/assets/varo/transaction-history.png";
import cashbackCar from "@/assets/varo/cashback-car.png";
import myOffers from "@/assets/varo/my-offers.png";
import papaJohns from "@/assets/varo/papa-johns.png";
import sonic from "@/assets/varo/sonic.png";
import catGas from "@/assets/varo/cat-gas.png";
import catGrocery from "@/assets/varo/cat-grocery.png";
import catFood from "@/assets/varo/cat-food.png";
import catShopping from "@/assets/varo/cat-shopping.png";
import navHome from "@/assets/varo/nav-home.png";
import navHomeActive from "@/assets/varo/nav-home-active.png";
import navMove from "@/assets/varo/nav-move.png";
import navMoveActive from "@/assets/varo/nav-move-active.png";
import navCashback from "@/assets/varo/nav-cashback.png";
import navCashbackActive from "@/assets/varo/nav-cashback-active.png";
import navVaro from "@/assets/varo/nav-varo.png";
import navVaroActive from "@/assets/varo/nav-varo-active.png";

export const art = {
  logo: logo,
  heroDirectDeposit: heroDirectDeposit,
  gasMoney: gasMoney,
  accountCard: accountCard,
  cashapp: cashapp,
  depositCash: depositCash,
  bankTransfer: bankTransfer,
  savingsBag: savingsBag,
  believeCard: believeCard,
  advance: advance,
  lineOfCredit: lineOfCredit,
  linkAccounts: linkAccounts,
  inviteFriends: inviteFriends,
  transfer: transfer,
  varoToAnyone: varoToAnyone,
  applePay: applePay,
  fundInstantly: fundInstantly,
  manageBills: manageBills,
  zelle: zelle,
  depositCheck: depositCheck,
  directDeposit: directDeposit,
  addCash: addCash,
  findAtm: findAtm,
  transactionHistory: transactionHistory,
  cashbackCar: cashbackCar,
  myOffers: myOffers,
  papaJohns: papaJohns,
  sonic: sonic,
  catGas: catGas,
  catGrocery: catGrocery,
  catFood: catFood,
  catShopping: catShopping,
  navHome: navHome,
  navHomeActive: navHomeActive,
  navMove: navMove,
  navMoveActive: navMoveActive,
  navCashback: navCashback,
  navCashbackActive: navCashbackActive,
  navVaro: navVaro,
  navVaroActive: navVaroActive,
} as const;

export type ArtName = keyof typeof art;
