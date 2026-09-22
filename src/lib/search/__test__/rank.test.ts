import assert from "node:assert/strict";
import test from "node:test";
import { rankSearchDocuments } from "../rank";
import type { SearchDocument } from "../types";
const docs: SearchDocument[] = [
  {
    id: "1",
    title: "Brokerage calculator",
    description: "Estimate brokerage",
    href: "/tools/brokerage-calculator",
    type: "TOOL",
    source: "STATIC",
    keywords: ["brokerage"],
  },
  {
    id: "2",
    title: "Trading costs explained",
    description: "Includes brokerage and FX",
    href: "/guides/trading-costs",
    type: "GUIDE",
    source: "STATIC",
  },
  {
    id: "3",
    title: "Duplicate brokerage",
    description: "Brokerage",
    href: "/tools/brokerage-calculator",
    type: "ARTICLE",
    source: "DATABASE",
  },
];
test("exact/title brokerage relevance outranks description-only matches", () => {
  const r = rankSearchDocuments(docs, "brokerage");
  assert.equal(r[0]?.title, "Brokerage calculator");
});
test("deduplicates destinations", () => {
  const r = rankSearchDocuments(docs, "brokerage");
  assert.equal(
    r.filter((x) => x.href === "/tools/brokerage-calculator").length,
    1
  );
});
test("empty query returns no results", () =>
  assert.deepEqual(rankSearchDocuments(docs, "   "), []));
