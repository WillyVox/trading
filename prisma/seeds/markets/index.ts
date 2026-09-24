import asx from "./asx.json";
import hkex from "./hkex.json";
import nasdaq from "./nasdaq.json";
import nyse from "./nyse.json";

/** Reusable market catalogue. One market per JSON file. */
export const SEED_MARKETS = [asx, nyse, nasdaq, hkex];
