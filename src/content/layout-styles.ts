/** Injected layout rules; keep CSS-first for performance on the live page. */
export function buildLayoutCss(panelWidthPx: number): string {
  const w = Math.min(520, Math.max(280, Math.round(panelWidthPx)));
  const chipsBand = "min(132px, 22vh)";
  return `
/* --- Scroll / overflow: helps native sticky; real pin uses JS + .ytvl-player-pinned --- */
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

/* Sidebar: hidden in document flow until flyout opens (wide layout may still populate it) */
ytd-app.ytvl-enabled:not(.ytvl-recs-open) ytd-watch-flexy #secondary.ytd-watch-flexy {
  display: none !important;
  order: 2 !important;
}

/*
 * Narrow layouts: recommendations live in #primary. Hide them only while flyout is CLOSED.
 * When OPEN, the same nodes get position:fixed so the panel is not empty.
 */
ytd-app.ytvl-enabled:not(.ytvl-recs-open) ytd-watch-flexy #primary-inner > ytd-rich-grid-renderer,
ytd-app.ytvl-enabled:not(.ytvl-recs-open) ytd-watch-flexy #primary-inner ytd-watch-next-secondary-results-renderer,
ytd-app.ytvl-enabled:not(.ytvl-recs-open) ytd-watch-flexy #primary-inner #related,
ytd-app.ytvl-enabled:not(.ytvl-recs-open) ytd-watch-flexy #primary-inner ytd-related-shelf-renderer,
ytd-app.ytvl-enabled:not(.ytvl-recs-open) ytd-watch-flexy #primary-inner > ytd-related-chip-cloud-renderer {
  display: none !important;
}

/* --- JS-assisted pin (IntersectionObserver + fixed + spacer) --- */
ytd-app.ytvl-enabled.ytvl-player-pinned #player-wide-container,
ytd-app.ytvl-enabled.ytvl-player-pinned #player-container-outer {
  position: fixed !important;
  top: var(--ytd-toolbar-height, 56px) !important;
  left: var(--ytvl-pin-left, 0) !important;
  width: var(--ytvl-pin-width, 100%) !important;
  max-width: var(--ytvl-pin-width, 100%) !important;
  z-index: 2040 !important;
  background: var(--yt-spec-base-background, #fff) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.18) !important;
}

/* Before JS pins, keep a best-effort sticky for simple scroll roots */
ytd-app.ytvl-enabled:not(.ytvl-player-pinned) ytd-watch-flexy #player-wide-container,
ytd-app.ytvl-enabled:not(.ytvl-player-pinned) ytd-watch-flexy #player-container-outer {
  position: sticky !important;
  top: var(--ytd-toolbar-height, 56px) !important;
  z-index: 2030 !important;
  align-self: flex-start !important;
  background: var(--yt-spec-base-background, #fff) !important;
  box-shadow: 0 1px 0 var(--yt-spec-10-percent-layer, rgba(0,0,0,0.08)) !important;
}

ytd-app.ytvl-enabled ytd-watch-flexy #player-container-inner,
ytd-app.ytvl-enabled ytd-watch-flexy #movie_player,
ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner > ytd-player,
ytd-app.ytvl-enabled ytd-watch-flexy ytd-player#ytd-player {
  position: relative !important;
  z-index: 0 !important;
}

ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner {
  background: var(--yt-spec-base-background, #fff) !important;
}

/* --- Flyout: real #secondary (when it has list content) --- */
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
  background: var(--yt-spec-base-background, #fff) !important;
  color: var(--yt-spec-text-primary, #0f0f0f) !important;
  border-left: 1px solid var(--yt-spec-10-percent-layer, rgba(0,0,0,0.1)) !important;
  box-shadow: -4px 0 24px rgba(0,0,0,0.18) !important;
  margin: 0 !important;
  padding: 48px 12px 24px 12px !important;
  box-sizing: border-box !important;
}

/* If #secondary is empty (common on narrow), hide it so the primary flyout shows through */
ytd-app.ytvl-enabled.ytvl-secondary-empty.ytvl-recs-open ytd-watch-flexy #secondary.ytd-watch-flexy {
  display: none !important;
}

/* --- Flyout: primary-column related (chips + grid) when sidebar is empty --- */
ytd-app.ytvl-enabled.ytvl-recs-open ytd-watch-flexy #primary-inner > ytd-related-chip-cloud-renderer {
  display: flex !important;
  position: fixed !important;
  top: calc(var(--ytd-toolbar-height, 56px) + 44px) !important;
  right: 0 !important;
  width: ${w}px !important;
  max-width: min(${w}px, 92vw) !important;
  max-height: ${chipsBand} !important;
  z-index: 2301 !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  background: var(--yt-spec-base-background, #fff) !important;
  color: var(--yt-spec-text-primary, #0f0f0f) !important;
  border-left: 1px solid var(--yt-spec-10-percent-layer, rgba(0,0,0,0.1)) !important;
  padding: 8px 12px !important;
  box-sizing: border-box !important;
  box-shadow: -2px 4px 12px rgba(0,0,0,0.12) !important;
}

ytd-app.ytvl-enabled.ytvl-recs-open ytd-watch-flexy #primary-inner > ytd-rich-grid-renderer,
ytd-app.ytvl-enabled.ytvl-recs-open ytd-watch-flexy #primary-inner ytd-watch-next-secondary-results-renderer,
ytd-app.ytvl-enabled.ytvl-recs-open ytd-watch-flexy #primary-inner #related {
  display: block !important;
  position: fixed !important;
  top: calc(var(--ytd-toolbar-height, 56px) + 44px + ${chipsBand}) !important;
  bottom: 0 !important;
  right: 0 !important;
  width: ${w}px !important;
  max-width: min(${w}px, 92vw) !important;
  z-index: 2300 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  background: var(--yt-spec-base-background, #fff) !important;
  color: var(--yt-spec-text-primary, #0f0f0f) !important;
  border-left: 1px solid var(--yt-spec-10-percent-layer, rgba(0,0,0,0.1)) !important;
  margin: 0 !important;
  padding: 8px 12px 24px 12px !important;
  box-sizing: border-box !important;
  box-shadow: -4px 0 24px rgba(0,0,0,0.18) !important;
}

ytd-app.ytvl-enabled.ytvl-recs-open ytd-watch-flexy #primary-inner ytd-related-shelf-renderer {
  display: block !important;
  position: fixed !important;
  top: calc(var(--ytd-toolbar-height, 56px) + 44px + ${chipsBand}) !important;
  bottom: 0 !important;
  right: 0 !important;
  width: ${w}px !important;
  max-width: min(${w}px, 92vw) !important;
  z-index: 2300 !important;
  overflow-y: auto !important;
  background: var(--yt-spec-base-background, #fff) !important;
  border-left: 1px solid var(--yt-spec-10-percent-layer, rgba(0,0,0,0.1)) !important;
  padding: 8px 12px 24px !important;
  box-sizing: border-box !important;
}

/* YouTube-style "Related" launcher */
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
  color: var(--yt-spec-text-primary, #0f0f0f);
  background: var(--yt-spec-badge-chip, rgba(0,0,0,0.06));
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

#ytvl-recs-close:hover {
  background: var(--yt-spec-touch-response, rgba(0,0,0,0.1));
}

html.ytvl-recs-open #ytvl-recs-close {
  display: inline-flex !important;
}

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
