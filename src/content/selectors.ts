/** Light-DOM hooks for YouTube watch layout (may change; centralize here). */
export const SELECTORS = {
  appRoot: "ytd-app",
  watchFlexy: "ytd-watch-flexy",
  columns: "#columns.ytd-watch-flexy",
  primary: "#primary.ytd-watch-flexy",
  secondary: "#secondary.ytd-watch-flexy",
} as const;

export function queryAppRoot(doc: Document): HTMLElement | null {
  return doc.querySelector(SELECTORS.appRoot);
}

export function isWatchPageUrl(href: string): boolean {
  try {
    const u = new URL(href);
    if (!u.hostname.endsWith("youtube.com")) return false;
    return u.pathname === "/watch" && u.searchParams.has("v");
  } catch {
    return false;
  }
}
