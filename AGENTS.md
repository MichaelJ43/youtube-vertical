# AGENTS.md — AI worker context

## Purpose

This repository implements a **WebExtension** that rearranges **YouTube watch pages** for **narrow vertical windows**: sticky full-width player, scrollable comments, and a **collapsible recommendations flyout** on the right.

## Repository map

| Path | Role |
|------|------|
| `src/content/` | Content script entry `youtube.ts`, `LayoutController`, injected CSS (`layout-styles.ts`), selectors |
| `src/popup/` | Extension popup HTML + `popup.ts` |
| `src/background/` | Service worker |
| `src/shared/` | Types, `messages.ts` (runtime validation), `storage.ts`, `storage-state.ts` |
| `test/unit/` | Vitest unit tests |
| `test/integration/` | Fixture HTML + layout integration tests (happy-dom) |
| `test/ui/` | Playwright + unpacked `dist-chrome` |
| `scripts/extension-build.mjs` | esbuild orchestration, manifest version patch, static copies |
| `manifest.chrome.json` / `manifest.firefox.json` | Source manifests (version `0.0.0` placeholder until build) |
| `docs/` | User and developer documentation |
| `.github/workflows/release-on-merge.yml` | On merged PR: semver bump from PR title, commit + tag |
| `.github/workflows/release.yml` | On `v*.*.*` tag: build zips and GitHub Release |

Merged PR titles may include **`+(semver:major|minor|patch)`** to choose the bump; otherwise CI defaults to **patch** (see README).

## Commands

```bash
npm ci
npm run build          # dist-chrome + dist-firefox
npm run build:chrome
npm run build:firefox
npm run dev            # watch build → dist-chrome
npm run lint
npx tsc --noEmit
npm test               # Vitest
PW_EXTENSION_HEADLESS=1 npm run test:ui   # Playwright (also runs build:chrome)
```

## Conventions

- **TypeScript** throughout; runtime messages validated with `isExtensionMessage()` — do not assume `unknown` payloads are well-typed.
- **No cross-entry shared runtime bundles**: each esbuild entry must remain self-contained (polyfill may duplicate).
- **CSS-first** layout; avoid heavy DOM cloning. Prefer toggling classes on `ytd-app` and reusing `#secondary` in a fixed flyout.
- **Tests**: add unit tests for pure logic; extend `test/fixtures` for DOM changes; keep Playwright scoped to extension pages unless explicitly testing live YouTube.

## Do not

- Commit secrets, API keys, or personal YouTube credentials.
- Add broad `host_permissions` beyond what the feature requires.
- Use `eval` or string `Function()` in content scripts.
- Edit the user’s plan file in `.cursor/plans/` when implementing features unless they ask.

## Product intent (from project owner)

Git-enabled project; sources in `./src`, tests in `./test`; Chrome + Firefox; documentation and `AGENTS.md` maintained; quality bar includes unit, integration/component-style, and UI tests; release pipeline with versioning (see GitHub workflows).
