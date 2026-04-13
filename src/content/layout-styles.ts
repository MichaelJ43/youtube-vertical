/** Injected layout rules; keep CSS-first for performance on the live page. */
export function buildLayoutCss(panelWidthPx: number): string {
  const w = Math.min(520, Math.max(280, Math.round(panelWidthPx)));
  return `
ytd-app.ytvl-enabled ytd-watch-flexy[flexy] #columns.ytd-watch-flexy {
  display: flex !important;
  flex-direction: column !important;
  max-width: 100% !important;
}

ytd-app.ytvl-enabled ytd-watch-flexy #primary.ytd-watch-flexy {
  width: 100% !important;
  max-width: 100% !important;
}

ytd-app.ytvl-enabled ytd-watch-flexy #secondary.ytd-watch-flexy {
  display: none !important;
}

ytd-app.ytvl-enabled.ytvl-recs-open ytd-watch-flexy #secondary.ytd-watch-flexy {
  display: block !important;
  position: fixed !important;
  top: var(--ytd-toolbar-height, 56px) !important;
  right: 0 !important;
  bottom: 0 !important;
  width: ${w}px !important;
  max-width: min(${w}px, 92vw) !important;
  z-index: 9998 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  background: var(--yt-spec-base-background, #0f0f0f) !important;
  box-shadow: -10px 0 36px rgba(0,0,0,0.55) !important;
  margin: 0 !important;
  padding: 8px 12px 24px !important;
  box-sizing: border-box !important;
}

ytd-app.ytvl-enabled ytd-watch-flexy #player-wide-container,
ytd-app.ytvl-enabled ytd-watch-flexy #player-container-outer,
ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner > ytd-player,
ytd-app.ytvl-enabled ytd-watch-flexy #movie_player {
  position: sticky !important;
  top: var(--ytd-toolbar-height, 56px) !important;
  z-index: 1000 !important;
}

ytd-app.ytvl-enabled ytd-watch-flexy #primary-inner {
  background: var(--yt-spec-base-background, #0f0f0f) !important;
}

#ytvl-floating-toggle {
  position: fixed;
  right: 10px;
  bottom: 88px;
  z-index: 9997;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(15,15,15,0.92);
  color: #f1f1f1;
  font: 600 18px/1 system-ui, sans-serif;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,0.35);
}

#ytvl-floating-toggle:hover {
  background: rgba(40,40,40,0.95);
}

#ytvl-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9996;
  background: rgba(0,0,0,0.35);
  display: none;
}

ytd-app.ytvl-enabled.ytvl-recs-open #ytvl-backdrop {
  display: block;
}
`.trim();
}
