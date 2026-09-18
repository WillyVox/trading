/**
 * LAST UPDATED ON 2026-09-17
 *
 * Milestone 1 seed set (see docs/ROADMAP.md "Offering foundation"). Only
 * two offerings to start -- proving the schema shape against two real,
 * structurally different brokers (CMC Invest's international holdings are
 * custodial with no per-market fee data yet; CommSec's ASX brokerage is
 * tiered with an active time-boxed promo) matters more right now than
 * seeding every AU broker at once. Stake and Interactive Brokers Australia
 * are the next two per the master prompt's own initial validation set.
 */
import { CmcInvest } from "./cmc-invest";
import { CommSec } from "./commsec";

export const SEED_OFFERINGS = [CmcInvest, CommSec];
