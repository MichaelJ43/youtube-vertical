import { describe, expect, it } from "vitest";
import { buildLayoutCss } from "../../src/content/layout-styles.js";

describe("buildLayoutCss", () => {
  it("embeds clamped width", () => {
    const css = buildLayoutCss(400);
    expect(css).toContain("400px");
  });

  it("clamps very large widths in output", () => {
    const css = buildLayoutCss(900);
    expect(css).toContain("520px");
  });

  it("uses html root selectors for overlay UI (backdrop lives under html)", () => {
    const css = buildLayoutCss(360);
    expect(css).toContain("html.ytvl-recs-open #ytvl-backdrop");
    expect(css).toContain("html.ytvl-recs-open #ytvl-recs-close");
  });
});
