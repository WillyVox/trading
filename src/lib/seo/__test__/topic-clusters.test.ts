import assert from "node:assert/strict";
import test from "node:test";
import { TOPIC_CLUSTERS } from "../topic-clusters";

test("topic clusters have unique hub URLs and meaningful research paths", () => {
  const clusters = Object.values(TOPIC_CLUSTERS);
  assert.equal(
    new Set(clusters.map((cluster) => cluster.hubHref)).size,
    clusters.length
  );
  for (const cluster of clusters) {
    assert.ok(cluster.links.length >= 5);
    assert.equal(
      new Set(cluster.links.map((link) => link.href)).size,
      cluster.links.length
    );
    assert.ok(cluster.links.some((link) => link.kind === "guide"));
    assert.ok(cluster.links.some((link) => link.kind === "tool"));
    assert.ok(cluster.links.some((link) => link.kind === "research"));
    assert.ok(cluster.links.some((link) => link.kind === "compare"));
  }
});

test("topic-cluster links use descriptive internal URLs", () => {
  for (const cluster of Object.values(TOPIC_CLUSTERS)) {
    for (const link of cluster.links) {
      assert.ok(link.href.startsWith("/"));
      assert.ok(link.title.length > 4);
      assert.ok(link.description.length > 20);
    }
  }
});
