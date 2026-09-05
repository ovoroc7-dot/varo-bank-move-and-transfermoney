// Exact artwork lifted from the Varo screen recording.
import logo from "@/assets/varo/logo.png.asset.json";
import heroDirectDeposit from "@/assets/varo/hero-direct-deposit.png.asset.json";
import gasMoney from "@/assets/varo/gas-money.png.asset.json";
import accountCard from "@/assets/varo/account-card.png.asset.json";
import cashapp from "@/assets/varo/cashapp.png.asset.json";
import depositCash from "@/assets/varo/deposit-cash.png.asset.json";
import bankTransfer from "@/assets/varo/bank-transfer.png.asset.json";
import savingsBag from "@/assets/varo/savings-bag.png.asset.json";
import believeCard from "@/assets/varo/believe-card.png.asset.json";
import advance from "@/assets/varo/advance.png.asset.json";
import lineOfCredit from "@/assets/varo/line-of-credit.png.asset.json";
import linkAccounts from "@/assets/varo/link-accounts.png.asset.json";
import inviteFriends from "@/assets/varo/invite-friends.png.asset.json";
import transfer from "@/assets/varo/transfer.png.asset.json";
import varoToAnyone from "@/assets/varo/varo-to-anyone.png.asset.json";
import applePay from "@/assets/varo/apple-pay.png.asset.json";
import fundInstantly from "@/assets/varo/fund-instantly.png.asset.json";
import manageBills from "@/assets/varo/manage-bills.png.asset.json";
import zelle from "@/assets/varo/zelle.png.asset.json";
import depositCheck from "@/assets/varo/deposit-check.png.asset.json";
import directDeposit from "@/assets/varo/direct-deposit.png.asset.json";
import addCash from "@/assets/varo/add-cash.png.asset.json";
import findAtm from "@/assets/varo/find-atm.png.asset.json";
import transactionHistory from "@/assets/varo/transaction-history.png.asset.json";
import cashbackCar from "@/assets/varo/cashback-car.png.asset.json";
import myOffers from "@/assets/varo/my-offers.png.asset.json";
import papaJohns from "@/assets/varo/papa-johns.png.asset.json";
import sonic from "@/assets/varo/sonic.png.asset.json";
import catGas from "@/assets/varo/cat-gas.png.asset.json";
import catGrocery from "@/assets/varo/cat-grocery.png.asset.json";
import catFood from "@/assets/varo/cat-food.png.asset.json";
import catShopping from "@/assets/varo/cat-shopping.png.asset.json";
import navHome from "@/assets/varo/nav-home.png.asset.json";
import navHomeActive from "@/assets/varo/nav-home-active.png.asset.json";
import navMove from "@/assets/varo/nav-move.png.asset.json";
import navMoveActive from "@/assets/varo/nav-move-active.png.asset.json";
import navCashback from "@/assets/varo/nav-cashback.png.asset.json";
import navCashbackActive from "@/assets/varo/nav-cashback-active.png.asset.json";
import navVaro from "@/assets/varo/nav-varo.png.asset.json";
import navVaroActive from "@/assets/varo/nav-varo-active.png.asset.json";

export const art = {
  logo: logo.url,
  heroDirectDeposit: heroDirectDeposit.url,
  gasMoney: gasMoney.url,
  accountCard: accountCard.url,
  cashapp: cashapp.url,
  depositCash: depositCash.url,
  bankTransfer: bankTransfer.url,
  savingsBag: savingsBag.url,
  believeCard: believeCard.url,
  advance: advance.url,
  lineOfCredit: lineOfCredit.url,
  linkAccounts: linkAccounts.url,
  inviteFriends: inviteFriends.url,
  transfer: transfer.url,
  varoToAnyone: varoToAnyone.url,
  applePay: applePay.url,
  fundInstantly: fundInstantly.url,
  manageBills: manageBills.url,
  zelle: zelle.url,
  depositCheck: depositCheck.url,
  directDeposit: directDeposit.url,
  addCash: addCash.url,
  findAtm: findAtm.url,
  transactionHistory: transactionHistory.url,
  cashbackCar: cashbackCar.url,
  myOffers: myOffers.url,
  papaJohns: papaJohns.url,
  sonic: sonic.url,
  catGas: catGas.url,
  catGrocery: catGrocery.url,
  catFood: catFood.url,
  catShopping: catShopping.url,
  navHome: navHome.url,
  navHomeActive: navHomeActive.url,
  navMove: navMove.url,
  navMoveActive: navMoveActive.url,
  navCashback: navCashback.url,
  navCashbackActive: navCashbackActive.url,
  navVaro: navVaro.url,
  navVaroActive: navVaroActive.url,
} as const;

export type ArtName = keyof typeof art;
