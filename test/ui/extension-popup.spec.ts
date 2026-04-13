import { test, expect } from "./extension-fixture";

test.describe("extension popup", () => {
  test("loads popup UI with controls", async ({ extensionContext }) => {
    let [sw] = extensionContext.serviceWorkers();
    if (!sw) {
      sw = await extensionContext.waitForEvent("serviceworker");
    }
    const extensionId = sw.url().split("/")[2];
    const page = await extensionContext.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup/popup.html`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("#enabled")).toBeVisible();
    await expect(page.locator("#width")).toBeVisible();
    await expect(page.locator("h3")).toContainText("YouTube Vertical");
  });
});
