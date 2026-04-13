import browser from "webextension-polyfill";
import { isExtensionMessage } from "../shared/messages.js";

browser.runtime.onInstalled.addListener(() => {
  // Placeholder for future migrations (e.g. default storage seeding).
});

browser.runtime.onMessage.addListener((message: unknown) => {
  if (!isExtensionMessage(message)) return undefined;
  if (message.type === "PING") {
    return Promise.resolve({ ok: true as const });
  }
  return undefined;
});
