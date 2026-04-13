import { describe, expect, it } from "vitest";
import { isExtensionMessage } from "../../src/shared/messages.js";

describe("isExtensionMessage", () => {
  it("validates known shapes", () => {
    expect(isExtensionMessage({ type: "PING" })).toBe(true);
    expect(isExtensionMessage({ type: "SET_ENABLED", enabled: true })).toBe(
      true,
    );
    expect(isExtensionMessage({ type: "SET_RECS_OPEN", open: false })).toBe(
      true,
    );
    expect(isExtensionMessage({ type: "SET_PANEL_WIDTH", widthPx: 320 })).toBe(
      true,
    );
  });

  it("rejects invalid payloads", () => {
    expect(isExtensionMessage({ type: "SET_ENABLED" })).toBe(false);
    expect(isExtensionMessage({ type: "SET_PANEL_WIDTH", widthPx: NaN })).toBe(
      false,
    );
    expect(isExtensionMessage({ type: "OTHER" })).toBe(false);
    expect(isExtensionMessage(null)).toBe(false);
  });
});
