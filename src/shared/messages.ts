import type { ExtensionMessage } from "./types.js";

export function isExtensionMessage(value: unknown): value is ExtensionMessage {
  if (value === null || typeof value !== "object") return false;
  const t = (value as { type?: unknown }).type;
  if (t === "PING") return true;
  if (t === "SET_ENABLED") {
    return typeof (value as { enabled?: unknown }).enabled === "boolean";
  }
  if (t === "SET_RECS_OPEN") {
    return typeof (value as { open?: unknown }).open === "boolean";
  }
  if (t === "SET_PANEL_WIDTH") {
    const w = (value as { widthPx?: unknown }).widthPx;
    return typeof w === "number" && Number.isFinite(w);
  }
  return false;
}
