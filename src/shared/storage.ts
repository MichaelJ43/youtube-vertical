import browser from "webextension-polyfill";
import { normalizeStorage, STORAGE_KEYS } from "./storage-state.js";

export { normalizeStorage, STORAGE_KEYS };

export async function readStorage() {
  const raw = await browser.storage.sync.get([
    STORAGE_KEYS.enabled,
    STORAGE_KEYS.panelWidthPx,
  ]);
  return normalizeStorage(raw as Record<string, unknown>);
}

export async function writeEnabled(enabled: boolean): Promise<void> {
  await browser.storage.sync.set({ [STORAGE_KEYS.enabled]: enabled });
}

export async function writePanelWidthPx(widthPx: number): Promise<void> {
  await browser.storage.sync.set({
    [STORAGE_KEYS.panelWidthPx]: clamp(Math.round(widthPx), 280, 520),
  });
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
