import browser from "webextension-polyfill";
import { readStorage, STORAGE_KEYS } from "../shared/storage.js";
import { isExtensionMessage } from "../shared/messages.js";
import { LayoutController } from "./layout-controller.js";

let controller: LayoutController | null = null;

async function syncFromStorage(): Promise<void> {
  const s = await readStorage();
  if (!controller) {
    controller = new LayoutController(s);
    controller.start(document);
  } else {
    controller.setState(s);
  }
}

void syncFromStorage();

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  if (STORAGE_KEYS.enabled in changes || STORAGE_KEYS.panelWidthPx in changes) {
    void syncFromStorage();
  }
});

browser.runtime.onMessage.addListener((message: unknown) => {
  if (!isExtensionMessage(message)) return;
  if (message.type === "SET_ENABLED" || message.type === "SET_PANEL_WIDTH") {
    void syncFromStorage();
  }
});
