import { BtcMarkets } from "./btc-markets";
import { CoinJar } from "./coinjar";
import { CoinSpot } from "./coinspot";
import { IndependentReserve } from "./independent-reserve";
import { Kraken } from "./kraken";
import { Swyftx } from "./swyftx";

export const CRYPTO_EXCHANGES = [
  BtcMarkets,
  CoinJar,
  CoinSpot,
  IndependentReserve,
  Kraken,
  Swyftx,
];
