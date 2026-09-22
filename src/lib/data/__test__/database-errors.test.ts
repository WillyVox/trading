import assert from "node:assert/strict";
import test from "node:test";

import { isDatabaseUnavailableError } from "../database-errors";

function codedError(code: string, message = "query failed") {
  return Object.assign(new Error(message), { code });
}

test("classifies known Prisma connectivity codes as unavailable", () => {
  for (const code of ["P1001", "P1002", "P1008", "P1017"]) {
    assert.equal(isDatabaseUnavailableError(codedError(code)), true, code);
  }
});

test("classifies the Prisma localhost connectivity message from the observed outage", () => {
  const error = new Error("Can't reach database server at `localhost:5432`");
  error.name = "PrismaClientInitializationError";
  assert.equal(isDatabaseUnavailableError(error), true);
});

test("does not hide authentication/configuration failures", () => {
  assert.equal(
    isDatabaseUnavailableError(codedError("P1000", "Authentication failed")),
    false
  );
});

test("does not hide invalid-query or ordinary programming errors", () => {
  assert.equal(
    isDatabaseUnavailableError(codedError("P2002", "Unique constraint failed")),
    false
  );
  assert.equal(
    isDatabaseUnavailableError(
      new TypeError("Cannot read properties of undefined")
    ),
    false
  );
});

test("does not classify every Prisma initialization error as an outage", () => {
  const error = new Error("Environment variable not found: DATABASE_URL");
  error.name = "PrismaClientInitializationError";
  assert.equal(isDatabaseUnavailableError(error), false);
});
