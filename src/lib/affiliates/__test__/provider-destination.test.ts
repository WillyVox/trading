import assert from "node:assert/strict";
import test from "node:test";
import { resolveProviderDestination } from "../provider-destination";

test("active affiliate relationship overrides the official website", () => {
  assert.deepEqual(
    resolveProviderDestination({
      providerSlug: "example-provider",
      officialWebsite: "https://example.com",
      hasActiveAffiliate: true,
      placement: "compare mobile",
    }),
    {
      href: "/go/example-provider?placement=compare%20mobile",
      type: "affiliate",
      isAffiliate: true,
      providerSlug: "example-provider",
      placement: "compare mobile",
    }
  );
});

test("official website is used when no affiliate relationship is active", () => {
  assert.deepEqual(
    resolveProviderDestination({
      providerSlug: "example-provider",
      officialWebsite: "https://example.com",
      hasActiveAffiliate: false,
      placement: "profile-hero",
    }),
    {
      href: "https://example.com",
      type: "official",
      isAffiliate: false,
      providerSlug: "example-provider",
      placement: "profile-hero",
    }
  );
});

test("no outbound destination is invented when neither branch is available", () => {
  assert.equal(
    resolveProviderDestination({
      providerSlug: "example-provider",
      officialWebsite: null,
      hasActiveAffiliate: false,
      placement: "browse",
    }),
    null
  );
});

test("unsafe or malformed official URLs fail closed", () => {
  for (const officialWebsite of ["javascript:alert(1)", "not-a-url", ""]) {
    assert.equal(
      resolveProviderDestination({
        providerSlug: "example-provider",
        officialWebsite,
        hasActiveAffiliate: false,
        placement: "browse",
      }),
      null
    );
  }
});
