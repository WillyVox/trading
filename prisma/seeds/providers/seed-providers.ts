import { BtcMarkets } from './btc-markets';
import { CoinJar } from './coinjar';
import { CoinSpot } from './coinspot';
import { IndependentReserve } from './independent-reserve';
import { Kraken } from './kraken';
import { Swyftx } from './swyftx';

// Seed only facts that have actually been researched. Anything not
// independently verified stays UNVERIFIED with a sourceUrl attached so an
// editor can check it before publication -- never guessed values.
//
// CoinSpot and Independent Reserve below were researched against official
// sources (coinspot.com.au/fees, CoinSpot's own Zendesk help articles,
// independentreserve.com's FAQ) plus, where no official page states a
// figure directly, reputable third-party reviews -- those are marked
// UNVERIFIED with the reviewing source attached rather than upgraded to
// VERIFIED on secondhand reporting. Checked 11 Sep 2026. Australia's crypto
// licensing regime changed materially in 2026 (AUSTRAC's expanded VASP
// scope from 31 March 2026; ASIC's AFSL "no-action" deadline of 30 June
// 2026 under the Digital Assets Framework) -- re-verify regulatory facts on

// a short cycle rather than treating this seed as a one-time task.

export const SEED_PROVIDERS = [
  BtcMarkets,
  CoinJar,
  CoinSpot,
  IndependentReserve,
  Kraken,
  Swyftx,
];
