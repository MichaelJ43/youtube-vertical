import { STORAGE_DEFAULTS } from "./defaults.js";
import type { StorageSchema } from "./types.js";

export const STORAGE_KEYS = {
  enabled: "ytvl_enabled",
  panelWidthPx: "ytvl_panel_width_px",
} as const;

export function normalizeStorage(raw: Record<string, unknown>): StorageSchema {
  const enabledRaw = raw[STORAGE_KEYS.enabled];
  const enabled =
    typeof enabledRaw === "boolean" ? enabledRaw : STORAGE_DEFAULTS.enabled;
  let panelWidthPx = STORAGE_DEFAULTS.panelWidthPx;
  if (
    typeof raw[STORAGE_KEYS.panelWidthPx] === "number" &&
    Number.isFinite(raw[STORAGE_KEYS.panelWidthPx])
  ) {
    panelWidthPx = clamp(
      Math.round(raw[STORAGE_KEYS.panelWidthPx] as number),
      280,
      520,
    );
  }
  return { enabled, panelWidthPx };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
