/**
 * Reads PR_TITLE for +(semver:major|minor|patch). Defaults to patch if absent.
 * Writes the new version to package.json and prints it to stdout.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import semver from "semver";

const title = process.env.PR_TITLE ?? "";
const match = title.match(/\+\(semver:(major|minor|patch)\)/i);
const bump = match ? match[1].toLowerCase() : "patch";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = resolve(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const current = pkg.version;
const next = semver.inc(current, bump);

if (!next || !semver.valid(next)) {
  console.error(`Cannot bump from ${current} with release type ${bump}`);
  process.exit(1);
}

pkg.version = next;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
process.stdout.write(next);
