# Developer guide

## Layout

- `src/background/` — MV3 service worker (minimal; message ping).
- `src/content/` — YouTube content script, layout CSS builder, `LayoutController`, debounce, selectors.
- `src/popup/` — Toolbar popup UI and wiring to `storage.sync`.
- `src/shared/` — Types, message guards, storage keys, normalization (no `browser` in `storage-state.ts` for easy unit testing).
- `test/unit/` — Vitest unit tests.
- `test/integration/` — DOM fixtures + `LayoutController` behavior (happy-dom).
- `test/ui/` — Playwright tests with the unpacked Chrome extension.
- `scripts/extension-build.mjs` — **esbuild** bundles (IIFE, one file per entry, no shared chunks across entries).

## Build system

We use **esbuild** instead of Vite for the extension so each of `background`, `content/youtube`, and `popup` is a **standalone IIFE** (content scripts cannot rely on cross-origin chunk loading on `youtube.com`).

`npm run build` emits `dist-chrome` and `dist-firefox` and writes `manifest.json` from `manifest.chrome.json` / `manifest.firefox.json` with the version taken from `package.json`.

## Selectors and resilience

Stable hooks are centralized in `src/content/selectors.ts`. Layout rules live in `layout-styles.ts` as a string injected into a `<style id="ytvl-style">` element.

`LayoutController` uses a debounced `MutationObserver` plus `yt-navigate-finish` and `popstate` to re-apply state after SPA navigation.

When YouTube breaks selectors:

1. Inspect the watch page DOM (light DOM around `#primary` / `#secondary`).
2. Update `selectors.ts` and/or `layout-styles.ts`.
3. Extend `test/fixtures/watch-page-min.html` if structure assumptions change.
4. Run `npm test` and manually verify on a real watch page.

## Storage keys

| Key | Meaning |
|-----|---------|
| `ytvl_enabled` | Boolean: apply layout on watch pages. |
| `ytvl_panel_width_px` | Integer 280–520: flyout width. |

Normalization and clamping are in `src/shared/storage-state.ts`.

## Playwright UI tests

`test/ui/extension-popup.spec.ts` loads `dist-chrome` with `chromium.launchPersistentContext` and opens `chrome-extension://<id>/popup/popup.html`.

Set `PW_EXTENSION_HEADLESS=1` for headless Chromium (used in CI).

## Release artifacts

- **CI** (`.github/workflows/ci.yml`): on pushes and pull requests to `main` / `master`, runs lint, typecheck, tests, build, and UI tests.
- **Version bump + publish** (`.github/workflows/release-on-merge.yml`): when a PR is **merged**, reads the PR title for `+(semver:major|minor|patch)` (defaults to **patch** if missing), bumps `package.json`, commits, pushes tag `v*.*.*`, then in the **same workflow run** builds zips and creates the GitHub Release. (A separate `on: push: tags` workflow would **not** run for tags created with `GITHUB_TOKEN`—GitHub blocks that chain—so publishing must stay in this job.)
- **Release** (`.github/workflows/release.yml`): optional **manual** path—**Actions → Release → Run workflow** and enter an existing tag (e.g. `v0.1.1`) to build and publish zips; or triggers on tag push if the tag was pushed with credentials that allow workflow dispatch (e.g. a PAT from a maintainer’s machine).
