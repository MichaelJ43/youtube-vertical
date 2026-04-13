import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { LayoutController, findWatchStructure } from "../../src/content/layout-controller.js";

const fixturePath = resolve(
  __dirname,
  "../fixtures/watch-page-min.html",
);

describe("LayoutController with fixture DOM", () => {
  beforeEach(() => {
    const html = readFileSync(fixturePath, "utf8");
    const parsed = new DOMParser().parseFromString(html, "text/html");
    document.body.innerHTML = parsed.body.innerHTML;
    window.happyDOM.setURL("https://www.youtube.com/watch?v=testvid");
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("detects watch structure", () => {
    const s = findWatchStructure(document);
    expect(s.hasApp).toBe(true);
    expect(s.hasPrimary).toBe(true);
    expect(s.hasSecondary).toBe(true);
  });

  it("applies enabled class to ytd-app on watch URL", () => {
    const c = new LayoutController({ enabled: true, panelWidthPx: 360 });
    c.start(document);
    const app = document.querySelector("ytd-app");
    expect(app?.classList.contains("ytvl-enabled")).toBe(true);
    c.stop();
  });

  it("toggles recommendations class", () => {
    const c = new LayoutController({ enabled: true, panelWidthPx: 360 });
    c.start(document);
    c.toggleRecs();
    const app = document.querySelector("ytd-app");
    expect(app?.classList.contains("ytvl-recs-open")).toBe(true);
    c.toggleRecs();
    expect(app?.classList.contains("ytvl-recs-open")).toBe(false);
    c.stop();
  });
});
