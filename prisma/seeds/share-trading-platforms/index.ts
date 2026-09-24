import cmcInvest from "./cmc-invest.json";
import commsec from "./commsec.json";
import etoro from "./etoro.json";
import interactiveBrokers from "./interactive-brokers.json";
import moomoo from "./moomoo.json";
import stake from "./stake.json";
import { reviveSeedJson } from "../lib/json";

export const SHARE_TRADING_PLATFORMS = [
  cmcInvest,
  commsec,
  etoro,
  interactiveBrokers,
  moomoo,
  stake,
].map(reviveSeedJson);
