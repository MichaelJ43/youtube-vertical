import { describe, expect, it } from "vitest";
import { STORAGE_DEFAULTS } from "../../src/shared/defaults.js";
import {
  normalizeStorage,
  STORAGE_KEYS,
} from "../../src/shared/storage-state.js";

describe("normalizeStorage", () => {
  it("uses defaults when keys missing", () => {
    expect(normalizeStorage({})).toEqual(STORAGE_DEFAULTS);
  });

  it("reads boolean enabled", () => {
    expect(
      normalizeStorage({ [STORAGE_KEYS.enabled]: false }),
    ).toMatchObject({ enabled: false });
  });

  it("clamps panel width", () => {
    expect(
      normalizeStorage({ [STORAGE_KEYS.panelWidthPx]: 900 }),
    ).toMatchObject({ panelWidthPx: 520 });
    expect(
      normalizeStorage({ [STORAGE_KEYS.panelWidthPx]: 100 }),
    ).toMatchObject({ panelWidthPx: 280 });
  });
});
