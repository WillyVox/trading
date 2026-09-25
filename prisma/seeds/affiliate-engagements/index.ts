import btcMarkets from "./btc-markets.json";
import coinJar from "./coinjar.json";
import coinSpot from "./coinspot.json";
import independentReserve from "./independent-reserve.json";
import kraken from "./kraken.json";
import swyftx from "./swyftx.json";
import { reviveSeedJson } from "../lib/json";

export const affiliateEngagementSeeds = [
  btcMarkets,
  coinJar,
  coinSpot,
  independentReserve,
  kraken,
  swyftx,
].map(reviveSeedJson);
