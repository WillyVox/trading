import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTENT_OPPORTUNITIES,
  PUBLISHED_CONTENT_OPPORTUNITY_IDS,
} from "../content-opportunities";
import { PHASE_9_3_GUIDES } from "../../guides/phase9-3-guides";

test("Phase 9.3 publishes eight intentional guides", () => {
  assert.equal(Object.keys(PHASE_9_3_GUIDES).length, 8);
  assert.equal(PUBLISHED_CONTENT_OPPORTUNITY_IDS.size, 8);
});

test("published opportunity IDs exist in the editorial roadmap", () => {
  const ids = new Set(CONTENT_OPPORTUNITIES.map((item) => item.id));
  for (const id of PUBLISHED_CONTENT_OPPORTUNITY_IDS)
    assert.ok(ids.has(id), `Unknown opportunity: ${id}`);
});

test("every Phase 9.3 guide has sources and product next steps", () => {
  for (const guide of Object.values(PHASE_9_3_GUIDES)) {
    assert.ok(guide.sources.length > 0, `${guide.path} needs sources`);
    assert.ok(guide.next.length > 0, `${guide.path} needs next steps`);
    assert.ok(
      guide.sections.length >= 4,
      `${guide.path} needs substantive sections`
    );
  }
});
