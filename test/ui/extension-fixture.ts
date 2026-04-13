import { test as base, chromium, type BrowserContext } from "@playwright/test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const extensionPath = resolve(__dirname, "../../dist-chrome");

export const test = base.extend<{ extensionContext: BrowserContext }>({
  extensionContext: async (
    // eslint-disable-next-line no-empty-pattern -- Playwright fixture worker signature
    {},
    use,
  ) => {
    const userDataDir = mkdtempSync(join(tmpdir(), "ytvl-playwright-"));
    const headless = process.env.PW_EXTENSION_HEADLESS === "1";
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: "chromium",
      headless,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });
    try {
      await use(context);
    } finally {
      await context.close();
      rmSync(userDataDir, { recursive: true, force: true });
    }
  },
});

export const expect = test.expect;
