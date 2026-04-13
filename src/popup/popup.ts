import browser from "webextension-polyfill";
import {
  readStorage,
  writeEnabled,
  writePanelWidthPx,
} from "../shared/storage.js";

const enabledEl = document.querySelector<HTMLInputElement>("#enabled");
const widthEl = document.querySelector<HTMLInputElement>("#width");
const widthValEl = document.querySelector<HTMLSpanElement>("#widthVal");

async function refreshUi(): Promise<void> {
  const s = await readStorage();
  if (enabledEl) enabledEl.checked = s.enabled;
  if (widthEl) widthEl.value = String(s.panelWidthPx);
  if (widthValEl) widthValEl.textContent = String(s.panelWidthPx);
}

function wire(): void {
  enabledEl?.addEventListener("change", async () => {
    await writeEnabled(Boolean(enabledEl?.checked));
  });
  widthEl?.addEventListener("input", async () => {
    const v = Number(widthEl?.value);
    if (widthValEl) widthValEl.textContent = String(v);
    await writePanelWidthPx(v);
  });
}

void refreshUi();
wire();

browser.storage.onChanged.addListener((_, area) => {
  if (area === "sync") void refreshUi();
});
