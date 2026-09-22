import { CmcInvest } from "./cmc-invest";
import { CommSec } from "./commsec";
import { InteractiveBrokers } from "./interactive-brokers";
import { Stake } from "./stake";
import { Moomoo } from "./moomoo";
import { EtoroShareTrading } from "./etoro";

export const SHARE_TRADING_PLATFORMS = [
  CmcInvest,
  CommSec,
  Stake,
  InteractiveBrokers,
  Moomoo,
  EtoroShareTrading,
];
