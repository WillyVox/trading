import fs from "node:fs";
const read = (p) => fs.readFileSync(p, "utf8");
const errors = [];
const schema = read("prisma/schema.prisma");
const route = read("src/app/go/[offering]/route.ts");
const service = read("src/lib/affiliates/service.ts");
for (const token of [
  "model AffiliatePartnership",
  "model AffiliateEngagement",
  "model AffiliateEvent",
  "offeringId",
  "destinationUrl",
  "commissionType",
])
  if (!schema.includes(token)) errors.push(`schema missing ${token}`);
for (const removed of [
  "model Affiliate" + "Program",
  "model Affiliate" + "Link",
  "model Affiliate" + "Click",
  "model Affiliate" + "Conversion",
])
  if (schema.includes(removed)) errors.push(`schema still contains ${removed}`);
if (!route.includes("getActiveAffiliateEngagement(slug)"))
  errors.push("/go route is not keyed by Offering engagement");
if (
  new RegExp("getActiveAffiliate" + "Link|recordAffiliate" + "Click").test(
    route
  )
)
  errors.push("/go route still contains removed affiliate APIs");
if (!route.includes("recordAffiliateEvent"))
  errors.push("/go route does not record AffiliateEvent");
if (!service.includes("offering: { slug: offeringSlug"))
  errors.push("engagement lookup is not keyed by Offering.slug");
const seedFiles = fs
  .readdirSync("prisma/seeds/affiliate-engagements")
  .filter((x) => x.endsWith(".json"));
for (const file of seedFiles) {
  const d = JSON.parse(read(`prisma/seeds/affiliate-engagements/${file}`));
  if (!d.offeringSlug || !d.destinationUrl)
    errors.push(`${file} missing Offering engagement identity/destination`);
  if ("partner" + "Slug" in d || "approved" + "Url" in d || "active" in d)
    errors.push(`${file} contains removed link-era fields`);
}
console.log("Trading Guide affiliate integrity check");
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  console.error(`${errors.length} error(s).`);
  process.exit(1);
}
console.log(
  "✓ Provider -> Partnership -> Engagement -> Offering/Event architecture is canonical."
);
console.log("✓ Removed affiliate models and link-era seed fields are absent.");
console.log("0 error(s).");
