/**
 * LAST UPDATED ON 2026-09-19
 *
 * Milestone 1 seed set (see docs/ROADMAP.md "Offering foundation"). Only
 * two offerings to start -- proving the schema shape against two real,
 * structurally different brokers (CMC Invest's ASX brokerage is $0 on a
 * first-buy-per-day basis then greater-of; CommSec's ASX brokerage is tiered
 * by settlement channel with a time-boxed promo) matters more right now than
 * seeding every AU broker at once. Fees (Phase 2) live in each offering's
 * `fees` array; research manifests are in docs/research/offerings/.
 * Stake and Interactive Brokers Australia are the next two per the master
 * prompt's own initial validation set.
 */
import { CmcInvest } from "./cmc-invest";
import { CommSec } from "./commsec";

export const SEED_OFFERINGS = [CmcInvest, CommSec];
