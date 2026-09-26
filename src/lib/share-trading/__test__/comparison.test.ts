import assert from "node:assert/strict";
import test from "node:test";
import { buildFeatureRows } from "../comparison";

test("share comparison renders a verified feature without inventing support for missing providers", () => {
  const offerings = [
    {
      features: [
        {
          featureType: "COPY_TRADING",
          label: null,
          value: null,
          available: true,
        },
      ],
    },
    { features: [] },
  ] as never;
  const rows = buildFeatureRows(offerings);
  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.label, "Copy Trading");
  assert.deepEqual(rows[0]?.values, ["✓", null]);
});

test("share comparison preserves explicit unavailable and unknown feature states", () => {
  const offerings = [
    {
      features: [
        {
          featureType: "MOBILE_APP",
          label: null,
          value: null,
          available: false,
        },
      ],
    },
    {
      features: [
        {
          featureType: "MOBILE_APP",
          label: null,
          value: null,
          available: null,
        },
      ],
    },
  ] as never;
  const rows = buildFeatureRows(offerings);
  assert.deepEqual(rows[0]?.values, ["Not supported", "Not verified"]);
});
