# YouTube Vertical Layout

Browser extension for **Chrome** and **Firefox** that improves watching YouTube in a **narrow vertical window** (for example, one quarter of an ultrawide monitor). The video stays **full width and pinned** while you scroll **comments** underneath. **Recommended videos** are hidden by default and open in a **right-side flyout**.

## Features

- Sticky player aligned under the YouTube header on watch pages.
- Primary column uses full width; the default right-hand recommendations column is hidden.
- Floating control (bottom-right) toggles the recommendations flyout; backdrop click closes it.
- Toolbar popup: enable/disable the layout and adjust flyout width (stored in sync storage).

## Install from GitHub Releases

Official builds are on **[GitHub Releases](https://github.com/MichaelJ43/youtube-vertical/releases)**.

1. Open the latest release and download **`youtube-vertical-chrome.zip`** or **`youtube-vertical-firefox.zip`**.

### Chrome / Edge (Chromium)

1. Unzip `youtube-vertical-chrome.zip` to a folder you keep permanently (the browser reads from that folder).
2. Open `chrome://extensions` (or Edge `edge://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the unzipped folder (the one that contains `manifest.json`).

### Firefox

1. Unzip `youtube-vertical-firefox.zip`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…** and choose **`manifest.json`** inside the unzipped folder.

   Temporary add-ons are removed when Firefox closes. For a permanent install you need a signed package from [Mozilla Add-ons](https://addons.mozilla.org/) or your own signing pipeline.

## Build from source

Requirements: **Node.js 20+** (22 recommended).

```bash
npm ci
npm run build
```

Outputs:

- `dist-chrome/` — load as unpacked in Chrome/Edge (Developer Mode).
- `dist-firefox/` — load temporary add-on or use “Load Add-on From File” in `about:debugging` (Firefox).

Single-target builds:

```bash
npm run build:chrome
npm run build:firefox
```

Development watch (Chrome output only):

```bash
npm run dev
```

Reload the extension in the browser after each rebuild.

### Icons

Default icons live under `public/icons/`. To regenerate on Windows (solid brand color):

```powershell
New-Item -ItemType Directory -Force -Path public/icons | Out-Null
Add-Type -AssemblyName System.Drawing
foreach ($s in @(48, 128)) {
  $bmp = New-Object System.Drawing.Bitmap $s, $s
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::FromArgb(255, 230, 33, 23))
  $g.Dispose()
  $bmp.Save("$PWD/public/icons/icon$s.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}
```

## Test

```bash
npm run lint
npx tsc --noEmit
npm test
```

UI tests (loads the unpacked Chrome extension; builds `dist-chrome` first):

```bash
# Headless (CI / default automation)
set PW_EXTENSION_HEADLESS=1
npm run test:ui
```

On Linux CI, headed mode can be used under Xvfb if needed; headless is preferred with `PW_EXTENSION_HEADLESS=1`.

## Documentation

- [User guide](docs/USER_GUIDE.md) — how to install and use the extension.
- [Developer guide](docs/DEVELOPER.md) — architecture, selectors, and release notes.
- [AGENTS.md](AGENTS.md) — context for AI-assisted work on this repo.

## Versioning and releases

- **`package.json` version** is copied into each build’s `manifest.json` when you run `npm run build`.
- **Automated releases**: when a pull request is **merged** into `main` or `master`, [`.github/workflows/release-on-merge.yml`](.github/workflows/release-on-merge.yml) bumps the version, commits, pushes a git tag, **builds the extension**, and creates the GitHub Release with zip artifacts in the **same** workflow run (GitHub does not run a second workflow when the default token pushes a tag).
- **Publish an existing tag** (e.g. tag exists but Release failed): in the repo go to **Actions** → **Release** → **Run workflow**, enter the tag (e.g. `v0.1.1`), and run.

### Semver bump from the PR title

Include **exactly one** of the following in the **PR title** so the merge workflow knows how to bump [semver](https://semver.org/):

| Marker in PR title | Version bump |
|--------------------|--------------|
| `+(semver:major)`  | `1.0.0` → `2.0.0` |
| `+(semver:minor)`  | `1.2.0` → `1.3.0` |
| `+(semver:patch)`  | `1.2.3` → `1.2.4` |

Example title: `Fix sticky player on theater mode +(semver:patch)`

If **none** of these markers appear, the workflow **defaults to a patch** bump and leaves a notice in the Actions log.

Manual tags are still possible, but the merge workflow is the intended path for continuous releases.

## License

This project is provided as-is for personal use; add a license file if you redistribute.
