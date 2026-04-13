# User guide — YouTube Vertical Layout

## What it does

On **youtube.com** watch pages (`/watch?v=…`), the extension:

1. Makes the **main column** use the full width of your window.
2. Keeps the **video player sticky** under the top bar so it stays visible while you scroll.
3. Lets you scroll **title, description, and comments** below the player.
4. **Hides** the default right-hand “Up next” column.
5. Provides a **floating button** (bottom-right, « / ×) to open or close recommendations in a **slide-out panel** on the right. Clicking the dimmed **backdrop** also closes the panel.

## Installing (development build)

### Chrome / Edge

1. Run `npm ci` and `npm run build:chrome`.
2. Open `chrome://extensions`, enable **Developer mode**.
3. **Load unpacked** and choose the `dist-chrome` folder.

### Firefox

1. Run `npm run build:firefox`.
2. Open `about:debugging#/runtime/this-firefox`.
3. **Load Temporary Add-on** and select `dist-firefox/manifest.json`.

## Using the extension

1. Open any normal **watch** page (not Shorts; those use a different layout).
2. Optionally dock your browser to a **narrow** strip on your monitor.
3. Use the **toolbar icon** → popup to:
   - Turn the layout **on or off** for watch pages.
   - Change **flyout width** (recommendations panel).
4. On the page, use the **floating control** to show or hide recommendations.

## Limitations

- **YouTube changes its page structure** from time to time. If layout breaks after a YouTube update, check for an extension update or file an issue with a screenshot and your browser version.
- **Shorts** and some **embedded** or **special** players may not match the same DOM; behavior there is best-effort only.
- The extension only runs on **https://www.youtube.com/** as declared in the manifest.

## Privacy

The extension uses **storage** only for your preferences (enabled flag, panel width). It does not send data to external servers. Code is open source in this repository.
