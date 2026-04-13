import type { StorageSchema } from "../shared/types.js";
import { buildLayoutCss } from "./layout-styles.js";
import { debounce } from "./debounce.js";
import { attachPlayerPin } from "./player-pin.js";
import { isWatchPageUrl, queryAppRoot, SELECTORS } from "./selectors.js";

const CLASS_ENABLED = "ytvl-enabled";
const CLASS_RECS_OPEN = "ytvl-recs-open";

const ICON_SIDEBAR = `<svg class="ytvl-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 8h4V4H4v4zm6 12h12v-4H10v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h12v-4H10v4zm6-10v4h6V4h-6z"/></svg>`;

const ICON_CLOSE = `<svg class="ytvl-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

export class LayoutController {
  private styleEl: HTMLStyleElement | null = null;
  private toggleBtn: HTMLButtonElement | null = null;
  private recsCloseBtn: HTMLButtonElement | null = null;
  private backdrop: HTMLDivElement | null = null;
  private recsOpen = false;
  private panelWidthPx: number;
  private enabled: boolean;
  private observer: MutationObserver | null = null;
  private pinCleanup: (() => void) | null = null;
  private readonly boundRefresh: () => void;
  private readonly boundRebindPin: () => void;
  private readonly onKeyDown: (e: KeyboardEvent) => void;

  constructor(initial: StorageSchema) {
    this.enabled = initial.enabled;
    this.panelWidthPx = initial.panelWidthPx;
    this.boundRefresh = debounce(() => this.refreshDom(), 120);
    this.boundRebindPin = debounce(() => {
      this.pinCleanup?.();
      this.pinCleanup = null;
      if (!this.enabled || !isWatchPageUrl(document.location.href)) return;
      this.pinCleanup = attachPlayerPin(document);
    }, 350);
    this.onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (!this.recsOpen) return;
      e.preventDefault();
      e.stopPropagation();
      this.recsOpen = false;
      this.applyBodyClasses(document);
    };
  }

  setState(next: StorageSchema): void {
    this.enabled = next.enabled;
    this.panelWidthPx = next.panelWidthPx;
    this.refreshDom();
  }

  start(doc: Document): void {
    this.ensureInjected(doc);
    doc.addEventListener("keydown", this.onKeyDown, true);
    this.refreshDom();
    this.observer = new MutationObserver(() => this.boundRefresh());
    this.observer.observe(doc.documentElement, { childList: true, subtree: true });
    doc.addEventListener("yt-navigate-finish", () => this.boundRefresh());
    window.addEventListener("popstate", () => this.boundRefresh());
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.teardownUi(document);
  }

  toggleRecs(): void {
    this.recsOpen = !this.recsOpen;
    this.applyBodyClasses(document);
  }

  closeRecs(): void {
    if (!this.recsOpen) return;
    this.recsOpen = false;
    this.applyBodyClasses(document);
  }

  private ensureInjected(doc: Document): void {
    if (!this.styleEl) {
      const el = doc.createElement("style");
      el.id = "ytvl-style";
      doc.documentElement.appendChild(el);
      this.styleEl = el;
    }
    if (!this.toggleBtn) {
      const btn = doc.createElement("button");
      btn.id = "ytvl-floating-toggle";
      btn.type = "button";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleRecs();
      });
      doc.documentElement.appendChild(btn);
      this.toggleBtn = btn;
    }
    if (!this.recsCloseBtn) {
      const close = doc.createElement("button");
      close.id = "ytvl-recs-close";
      close.type = "button";
      close.setAttribute("aria-label", "Close recommendations");
      close.innerHTML = ICON_CLOSE;
      close.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeRecs();
      });
      doc.documentElement.appendChild(close);
      this.recsCloseBtn = close;
    }
    if (!this.backdrop) {
      const bd = doc.createElement("div");
      bd.id = "ytvl-backdrop";
      bd.setAttribute("role", "presentation");
      bd.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.closeRecs();
      });
      bd.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeRecs();
      });
      doc.documentElement.appendChild(bd);
      this.backdrop = bd;
    }
  }

  private refreshDom(): void {
    const doc = document;
    if (!isWatchPageUrl(doc.location.href)) {
      this.teardownPage(doc);
      return;
    }
    if (!this.enabled) {
      this.teardownPage(doc);
      return;
    }
    this.ensureInjected(doc);
    if (this.styleEl) {
      this.styleEl.textContent = buildLayoutCss(this.panelWidthPx);
    }
    const app = queryAppRoot(doc);
    if (app) {
      app.classList.add(CLASS_ENABLED);
      doc.documentElement.classList.add(CLASS_ENABLED);
      this.updateSecondaryEmpty(doc);
      this.applyBodyClasses(doc);
    }
    this.updateToggleVisibility(doc, true);
    this.boundRebindPin();
  }

  /** When #secondary has no related list (typical on narrow), hide empty flyout shell. */
  private updateSecondaryEmpty(doc: Document): void {
    const app = queryAppRoot(doc);
    if (!app?.classList.contains(CLASS_ENABLED)) return;
    const sec = doc.querySelector("#secondary.ytd-watch-flexy");
    const hasSecondary = Boolean(
      sec?.querySelector(
        "ytd-watch-next-secondary-results-renderer, ytd-compact-video-renderer, ytd-item-section-renderer, #related ytd-compact-video-renderer, ytd-compact-playlist-renderer",
      ),
    );
    app.classList.toggle("ytvl-secondary-empty", !hasSecondary);
  }

  private applyBodyClasses(doc: Document): void {
    const app = queryAppRoot(doc);
    if (!app?.classList.contains(CLASS_ENABLED)) return;
    app.classList.toggle(CLASS_RECS_OPEN, this.recsOpen);
    /* Overlay controls are attached to <html>; mirror classes so CSS can target them. */
    doc.documentElement.classList.toggle(CLASS_RECS_OPEN, this.recsOpen);
    this.renderToggleLabel();
  }

  private renderToggleLabel(): void {
    if (!this.toggleBtn) return;
    if (this.recsOpen) {
      this.toggleBtn.innerHTML = `${ICON_CLOSE}<span>Close</span>`;
      this.toggleBtn.title = "Close recommendations panel";
    } else {
      this.toggleBtn.innerHTML = `${ICON_SIDEBAR}<span>Related</span>`;
      this.toggleBtn.title = "Show related videos";
    }
  }

  private updateToggleVisibility(_doc: Document, visible: boolean): void {
    if (this.toggleBtn) {
      this.toggleBtn.style.display = visible ? "" : "none";
    }
  }

  private teardownPage(doc: Document): void {
    this.pinCleanup?.();
    this.pinCleanup = null;
    const app = queryAppRoot(doc);
    app?.classList.remove(
      CLASS_ENABLED,
      CLASS_RECS_OPEN,
      "ytvl-secondary-empty",
      "ytvl-player-pinned",
    );
    doc.documentElement.classList.remove(CLASS_ENABLED, CLASS_RECS_OPEN);
    this.recsOpen = false;
    this.updateToggleVisibility(doc, false);
    if (this.styleEl) {
      this.styleEl.textContent = "";
    }
  }

  private teardownUi(doc: Document): void {
    doc.removeEventListener("keydown", this.onKeyDown, true);
    this.teardownPage(doc);
    this.styleEl?.remove();
    this.styleEl = null;
    this.toggleBtn?.remove();
    this.toggleBtn = null;
    this.recsCloseBtn?.remove();
    this.recsCloseBtn = null;
    this.backdrop?.remove();
    this.backdrop = null;
  }
}

export function findWatchStructure(doc: Document): {
  hasApp: boolean;
  hasColumns: boolean;
  hasPrimary: boolean;
  hasSecondary: boolean;
} {
  const app = queryAppRoot(doc);
  return {
    hasApp: Boolean(app),
    hasColumns: Boolean(app?.querySelector(SELECTORS.columns)),
    hasPrimary: Boolean(app?.querySelector(SELECTORS.primary)),
    hasSecondary: Boolean(app?.querySelector(SELECTORS.secondary)),
  };
}
