import btcMarkets from "./btc-markets.json";
import coinJar from "./coinjar.json";
import coinSpot from "./coinspot.json";
import etoro from "./etoro.json";
import independentReserve from "./independent-reserve.json";
import kraken from "./kraken.json";
import swyftx from "./swyftx.json";
import { reviveSeedJson } from "../lib/json";

export const CRYPTO_EXCHANGES = [
  btcMarkets,
  coinJar,
  coinSpot,
  independentReserve,
  kraken,
  swyftx,
  etoro,
].map(reviveSeedJson);
