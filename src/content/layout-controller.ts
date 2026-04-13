import type { StorageSchema } from "../shared/types.js";
import { buildLayoutCss } from "./layout-styles.js";
import { debounce } from "./debounce.js";
import { isWatchPageUrl, queryAppRoot, SELECTORS } from "./selectors.js";

const CLASS_ENABLED = "ytvl-enabled";
const CLASS_RECS_OPEN = "ytvl-recs-open";

export class LayoutController {
  private styleEl: HTMLStyleElement | null = null;
  private toggleBtn: HTMLButtonElement | null = null;
  private backdrop: HTMLDivElement | null = null;
  private recsOpen = false;
  private panelWidthPx: number;
  private enabled: boolean;
  private observer: MutationObserver | null = null;
  private readonly boundRefresh: () => void;

  constructor(initial: StorageSchema) {
    this.enabled = initial.enabled;
    this.panelWidthPx = initial.panelWidthPx;
    this.boundRefresh = debounce(() => this.refreshDom(), 120);
  }

  setState(next: StorageSchema): void {
    this.enabled = next.enabled;
    this.panelWidthPx = next.panelWidthPx;
    this.refreshDom();
  }

  start(doc: Document): void {
    this.ensureInjected(doc);
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
      btn.textContent = "»";
      btn.title = "Toggle recommendations";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleRecs();
      });
      doc.documentElement.appendChild(btn);
      this.toggleBtn = btn;
    }
    if (!this.backdrop) {
      const bd = doc.createElement("div");
      bd.id = "ytvl-backdrop";
      bd.addEventListener("click", () => {
        this.recsOpen = false;
        this.applyBodyClasses(doc);
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
      this.applyBodyClasses(doc);
    }
    this.updateToggleVisibility(doc, true);
  }

  private applyBodyClasses(doc: Document): void {
    const app = queryAppRoot(doc);
    if (!app?.classList.contains(CLASS_ENABLED)) return;
    app.classList.toggle(CLASS_RECS_OPEN, this.recsOpen);
    if (this.toggleBtn) {
      this.toggleBtn.textContent = this.recsOpen ? "×" : "»";
      this.toggleBtn.title = this.recsOpen ? "Close recommendations" : "Open recommendations";
    }
  }

  private updateToggleVisibility(_doc: Document, visible: boolean): void {
    if (this.toggleBtn) {
      this.toggleBtn.style.display = visible ? "" : "none";
    }
  }

  private teardownPage(doc: Document): void {
    const app = queryAppRoot(doc);
    app?.classList.remove(CLASS_ENABLED, CLASS_RECS_OPEN);
    this.recsOpen = false;
    this.updateToggleVisibility(doc, false);
    if (this.styleEl) {
      this.styleEl.textContent = "";
    }
  }

  private teardownUi(doc: Document): void {
    this.teardownPage(doc);
    this.styleEl?.remove();
    this.styleEl = null;
    this.toggleBtn?.remove();
    this.toggleBtn = null;
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
