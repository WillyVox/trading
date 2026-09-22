import assert from "node:assert/strict";
import test from "node:test";
import { isDatabaseUnavailableError } from "../database-errors";

test("recognises database reachability messages", () => {
  assert.equal(
    isDatabaseUnavailableError(
      new Error("Can't reach database server at localhost:5432")
    ),
    true
  );
  assert.equal(
    isDatabaseUnavailableError(new Error("connection refused")),
    true
  );
});

test("does not hide ordinary application errors", () => {
  assert.equal(
    isDatabaseUnavailableError(
      new Error("Cannot read properties of undefined")
    ),
    false
  );
});
