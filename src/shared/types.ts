export type ExtensionMessage =
  | { type: "PING" }
  | { type: "SET_ENABLED"; enabled: boolean }
  | { type: "SET_RECS_OPEN"; open: boolean }
  | { type: "SET_PANEL_WIDTH"; widthPx: number };

export type ExtensionMessageResponse =
  | { ok: true }
  | { ok: false; error: string };

export type StorageSchema = {
  enabled: boolean;
  /** Width of the recommendations flyout in CSS pixels */
  panelWidthPx: number;
};
