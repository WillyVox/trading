/**
 * Promote a user to Role.ADMIN by email.
 *
 * Deliberately a standalone script rather than an in-app action — admin
 * escalation should never be something reachable from the registration
 * form or a regular authenticated session (see src/lib/auth/actions.ts).
 * This runs with direct DB access outside the app's request/session flow,
 * the same way prisma/seed.ts does.
 *
 * Usage:
 *   npm run promote:admin -- user@example.com
 *
 * If no user with that email exists yet, pass --create (and optionally
 * --password / --name) to create one directly as ADMIN, e.g. for the very
 * first admin account before anyone has registered:
 *
 *   npm run promote:admin -- admin@ausmarket.example --create --password "Sup3r-Secret!" --name "Site Admin"
 *
 * To demote back to a regular user:
 *
 *   npm run promote:admin -- user@example.com --demote
 */
import { prisma } from "@/lib/prisma";
import { hashPassword, isPasswordAcceptable } from "@/lib/auth/password";
import { Role } from "@prisma/client";

interface CliArgs {
  email?: string;
  create: boolean;
  demote: boolean;
  password?: string;
  name?: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { create: false, demote: false };
  const VALUE_FLAGS = new Set(["--password", "--name"]);

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--create") {
      args.create = true;
    } else if (token === "--demote") {
      args.demote = true;
    } else if (token === "--password") {
      args.password = argv[++i];
    } else if (token === "--name") {
      args.name = argv[++i];
    } else if (!token.startsWith("--") && !args.email) {
      args.email = token;
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.email) {
    console.error("Usage: npm run promote:admin -- <email> [--create --password <pw> --name <name>] [--demote]");
    process.exitCode = 1;
    return;
  }
  const email = args.email.trim().toLowerCase();

  if (args.create && args.demote) {
    console.error("--create and --demote can't be used together.");
    process.exitCode = 1;
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    if (!args.create) {
      console.error(`No user found with email "${email}". Pass --create to create a new ADMIN account.`);
      process.exitCode = 1;
      return;
    }
    if (!args.password || !isPasswordAcceptable(args.password)) {
      console.error("--password is required with --create and must be at least 8 characters.");
      process.exitCode = 1;
      return;
    }

    const passwordHash = await hashPassword(args.password);
    const created = await prisma.user.create({
      data: { email, name: args.name ?? null, passwordHash, role: Role.ADMIN },
    });
    console.log(`Created new ADMIN user: ${created.email} (id: ${created.id})`);
    return;
  }

  if (args.demote && existing.role === Role.USER) {
    console.log(`${email} is already a USER — nothing to do.`);
    return;
  }
  if (!args.demote && existing.role === Role.ADMIN) {
    console.log(`${email} is already an ADMIN — nothing to do.`);
    return;
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: args.demote ? Role.USER : Role.ADMIN },
  });
  console.log(`${updated.email} is now ${updated.role}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
