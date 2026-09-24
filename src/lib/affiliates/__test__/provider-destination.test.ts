import assert from "node:assert/strict";
import test from "node:test";
import { resolveProviderDestination } from "../provider-destination";

const base = {
  providerSlug: "example-provider",
  officialWebsite: "https://example.com",
  officialWebsiteVerified: true,
};

test("active affiliate relationship always uses the tracked affiliate route", () => {
  assert.deepEqual(
    resolveProviderDestination({
      ...base,
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

test("verified official website is the fallback when no affiliate is active", () => {
  assert.deepEqual(
    resolveProviderDestination({
      ...base,
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

test("unverified official website fails closed when no affiliate is active", () => {
  assert.equal(
    resolveProviderDestination({
      ...base,
      officialWebsiteVerified: false,
      hasActiveAffiliate: false,
      placement: "browse",
    }),
    null
  );
});

test("active affiliate remains available even when the stored official website is unverified", () => {
  assert.equal(
    resolveProviderDestination({
      ...base,
      officialWebsiteVerified: false,
      hasActiveAffiliate: true,
      placement: "browse",
    })?.type,
    "affiliate"
  );
});

test("no outbound destination is invented when neither branch is available", () => {
  assert.equal(
    resolveProviderDestination({
      providerSlug: "example-provider",
      officialWebsite: null,
      officialWebsiteVerified: false,
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
        officialWebsiteVerified: true,
        hasActiveAffiliate: false,
        placement: "browse",
      }),
      null
    );
  }
});
