/** Injected layout rules; keep CSS-first for performance on the live page. */
export function buildLayoutCss(panelWidthPx: number): string {
  const w = Math.min(520, Math.max(280, Math.round(panelWidthPx)));
  return `
/* --- Scroll / overflow: sticky breaks if any ancestor clips (overflow not visible) --- */
ytd-app.ytvl-enabled ytd-watch-flexy[flexy],
ytd-app.ytvl-enabled ytd-watch-flexy #columns.ytd-watch-flexy,
ytd-app.ytvl-enabled ytd-watch-flexy #primary.ytd-watch-flexy,
ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner {
  overflow-x: visible !important;
  overflow-y: visible !important;
}

ytd-app.ytvl-enabled #content.ytd-app {
  overflow-x: visible !important;
}

ytd-app.ytvl-enabled ytd-watch-flexy[flexy] #columns.ytd-watch-flexy {
  display: flex !important;
  flex-direction: column !important;
  max-width: 100% !important;
}

ytd-app.ytvl-enabled ytd-watch-flexy #primary.ytd-watch-flexy {
  width: 100% !important;
  max-width: 100% !important;
  order: 1 !important;
}

/* Sidebar column: hidden in flow; content shown only in flyout when open */
ytd-app.ytvl-enabled ytd-watch-flexy #secondary.ytd-watch-flexy {
  display: none !important;
  order: 2 !important;
}

/* --- Narrow / single-column: related grid & shelves that YouTube moves into primary --- */
ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner > ytd-rich-grid-renderer,
ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner ytd-watch-next-secondary-results-renderer,
ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner #related,
ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner ytd-related-shelf-renderer,
ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner ytd-shelf-renderer:first-of-type {
  display: none !important;
}

/* Chips row that often precedes the below-the-fold related grid */
ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner > ytd-related-chip-cloud-renderer {
  display: none !important;
}

/* --- Pinned player: sticky on the outer player box + solid backdrop while scrolling --- */
ytd-app.ytvl-enabled ytd-watch-flexy #player-wide-container,
ytd-app.ytvl-enabled ytd-watch-flexy #player-container-outer {
  position: sticky !important;
  top: var(--ytd-toolbar-height, 56px) !important;
  z-index: 2030 !important;
  align-self: flex-start !important;
  background: var(--yt-spec-base-background, #0f0f0f) !important;
  box-shadow: 0 1px 0 var(--yt-spec-10-percent-layer, rgba(255,255,255,0.08)) !important;
}

ytd-app.ytvl-enabled ytd-watch-flexy #player-container-inner,
ytd-app.ytvl-enabled ytd-watch-flexy #movie_player,
ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner > ytd-player,
ytd-app.ytvl-enabled ytd-watch-flexy ytd-player#ytd-player {
  position: relative !important;
  z-index: 0 !important;
}

ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner {
  background: var(--yt-spec-base-background, #0f0f0f) !important;
}

/* --- Flyout panel --- */
ytd-app.ytvl-enabled.ytvl-recs-open ytd-watch-flexy #secondary.ytd-watch-flexy {
  display: block !important;
  position: fixed !important;
  top: var(--ytd-toolbar-height, 56px) !important;
  right: 0 !important;
  bottom: 0 !important;
  width: ${w}px !important;
  max-width: min(${w}px, 92vw) !important;
  z-index: 2300 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  background: var(--yt-spec-base-background, #0f0f0f) !important;
  border-left: 1px solid var(--yt-spec-10-percent-layer, rgba(255,255,255,0.1)) !important;
  box-shadow: -4px 0 24px rgba(0,0,0,0.45) !important;
  margin: 0 !important;
  padding: 48px 12px 24px 12px !important;
  box-sizing: border-box !important;
}

/* YouTube-style "Related" launcher (toolbar-adjacent pill) */
#ytvl-floating-toggle {
  position: fixed;
  right: 12px;
  bottom: 24px;
  z-index: 2200;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 14px 0 12px;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  font-family: "Roboto", "Arial", sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--yt-spec-text-primary, #f1f1f1);
  background: var(--yt-spec-badge-chip, rgba(255,255,255,0.1));
  box-shadow: 0 1px 2px rgba(0,0,0,0.33), 0 0 0 1px var(--yt-spec-10-percent-layer, rgba(255,255,255,0.08));
  transition: background 0.15s ease;
}

#ytvl-floating-toggle:hover {
  background: var(--yt-spec-touch-response, rgba(255,255,255,0.15));
}

#ytvl-floating-toggle:focus-visible {
  outline: 2px solid var(--yt-spec-themed-blue, #3ea6ff);
  outline-offset: 2px;
}

#ytvl-floating-toggle .ytvl-toggle-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  opacity: 0.9;
}

/* Close control: matches flyout top bar (node lives under <html>, not ytd-app) */
#ytvl-recs-close {
  position: fixed;
  top: calc(var(--ytd-toolbar-height, 56px) + 8px);
  right: 12px;
  z-index: 2310;
  width: 40px;
  height: 40px;
  padding: 0;
  display: none;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--yt-spec-text-primary, #f1f1f1);
  background: var(--yt-spec-badge-chip, rgba(255,255,255,0.08));
  box-shadow: 0 1px 2px rgba(0,0,0,0.4);
}

#ytvl-recs-close:hover {
  background: var(--yt-spec-touch-response, rgba(255,255,255,0.14));
}

html.ytvl-recs-open #ytvl-recs-close {
  display: inline-flex !important;
}

/* Dim main content; must sit above page but below panel + close */
#ytvl-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2290;
  background: rgba(0,0,0,0.45);
  display: none;
  pointer-events: auto;
  cursor: default;
}

html.ytvl-recs-open #ytvl-backdrop {
  display: block;
}
`.trim();
}
