/**
 * LAST UPDATED ON 2026-09-19
 *
 * Milestone 1 seed set (see docs/ROADMAP.md "Offering foundation") plus the
 * Phase 2 fee data for all four initial validation-set brokers. CommSec and
 * CMC Invest were seeded first to prove the schema shape against two real,
 * structurally different fee schedules; Stake and Interactive Brokers
 * Australia are added here as the next two per the master prompt's own
 * initial validation set. Fees (Phase 2) live in each offering's `fees`
 * array; research manifests are in prisma/seeds/offerings/<slug>.md.
 *
 * Interactive Brokers Australia's seed intentionally models only its Fixed
 * pricing plan, and leaves two documented schema seams open (a per-share
 * fee shape, and named pricing plans) -- see interactive-brokers.md before
 * treating this offering as "complete" the way CommSec/CMC Invest are.
 */
import { CmcInvest } from "./cmc-invest";
import { CommSec } from "./commsec";
import { InteractiveBrokers } from "./interactive-brokers";
import { Stake } from "./stake";

export const SEED_OFFERINGS = [CmcInvest, CommSec, Stake, InteractiveBrokers];