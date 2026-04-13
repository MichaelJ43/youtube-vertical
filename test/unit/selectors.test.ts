import { describe, expect, it } from "vitest";
import { isWatchPageUrl } from "../../src/content/selectors.js";

describe("isWatchPageUrl", () => {
  it("accepts watch URLs with v param", () => {
    expect(
      isWatchPageUrl("https://www.youtube.com/watch?v=abc123"),
    ).toBe(true);
  });

  it("rejects non-youtube hosts", () => {
    expect(isWatchPageUrl("https://example.com/watch?v=1")).toBe(false);
  });

  it("rejects paths without watch", () => {
    expect(isWatchPageUrl("https://www.youtube.com/feed")).toBe(false);
  });
});
