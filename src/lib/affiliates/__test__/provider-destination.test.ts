import assert from "node:assert/strict";
import test from "node:test";

import { resolveProviderDestination } from "../provider-destination";

const base = {
  providerSlug: "example-provider",
  offeringSlug: "example-offering",
  officialWebsite: "https://example.com",
};

test("active affiliate relationship always uses the tracked affiliate route", () => {
  assert.deepEqual(
    resolveProviderDestination({
      ...base,
      hasActiveAffiliate: true,
      placement: "compare mobile",
    }),
    {
      href: "/go/example-offering?placement=compare%20mobile",
      type: "affiliate",
      isAffiliate: true,
      providerSlug: "example-provider",
      offeringSlug: "example-offering",
      placement: "compare mobile",
    }
  );
});

test("official website is used when no affiliate relationship is active", () => {
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
      offeringSlug: "example-offering",
      placement: "profile-hero",
    }
  );
});

test("active affiliate takes precedence over the official website", () => {
  assert.deepEqual(
    resolveProviderDestination({
      ...base,
      hasActiveAffiliate: true,
      placement: "browse",
    }),
    {
      href: "/go/example-offering?placement=browse",
      type: "affiliate",
      isAffiliate: true,
      providerSlug: "example-provider",
      offeringSlug: "example-offering",
      placement: "browse",
    }
  );
});

test("active affiliate remains available when no official website exists", () => {
  assert.deepEqual(
    resolveProviderDestination({
      providerSlug: "example-provider",
      offeringSlug: "example-offering",
      officialWebsite: null,
      hasActiveAffiliate: true,
      placement: "browse",
    }),
    {
      href: "/go/example-offering?placement=browse",
      type: "affiliate",
      isAffiliate: true,
      providerSlug: "example-provider",
      offeringSlug: "example-offering",
      placement: "browse",
    }
  );
});

test("no outbound destination is returned when no affiliate or official website exists", () => {
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

test("unsafe or malformed official URLs fail closed when no affiliate is active", () => {
  for (const officialWebsite of [
    "javascript:alert(1)",
    "not-a-url",
    "",
    "ftp://example.com",
  ]) {
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

test("https official website is accepted when no affiliate is active", () => {
  assert.deepEqual(
    resolveProviderDestination({
      ...base,
      hasActiveAffiliate: false,
      placement: "browse",
    }),
    {
      href: "https://example.com",
      type: "official",
      isAffiliate: false,
      providerSlug: "example-provider",
      offeringSlug: "example-offering",
      placement: "browse",
    }
  );
});

test("unsafe official website does not affect an active affiliate destination", () => {
  assert.deepEqual(
    resolveProviderDestination({
      providerSlug: "example-provider",
      offeringSlug: "example-offering",
      officialWebsite: "javascript:alert(1)",
      hasActiveAffiliate: true,
      placement: "comparison",
    }),
    {
      href: "/go/example-offering?placement=comparison",
      type: "affiliate",
      isAffiliate: true,
      providerSlug: "example-provider",
      offeringSlug: "example-offering",
      placement: "comparison",
    }
  );
});

test("provider slug and placement are URL encoded for affiliate destinations", () => {
  assert.deepEqual(
    resolveProviderDestination({
      providerSlug: "example provider",
      offeringSlug: "example offering",
      officialWebsite: "https://example.com",
      hasActiveAffiliate: true,
      placement: "compare mobile / table",
    }),
    {
      href: "/go/example%20offering?placement=compare%20mobile%20%2F%20table",
      type: "affiliate",
      isAffiliate: true,
      providerSlug: "example provider",
      offeringSlug: "example offering",
      placement: "compare mobile / table",
    }
  );
});
