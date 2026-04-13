/**
 * Pins the watch player below the masthead while scrolling. YouTube often uses a
 * non-document scroll container or overflow chains that break CSS position:sticky,
 * so we toggle fixed positioning from scroll + resize observers.
 */
const SENTINEL_ID = "ytvl-pin-sentinel";
const SPACER_ID = "ytvl-pin-spacer";
const PINNED_CLASS = "ytvl-player-pinned";

function toolbarHeight(doc: Document): number {
  const raw = doc.defaultView
    ?.getComputedStyle(doc.documentElement)
    .getPropertyValue("--ytd-toolbar-height")
    .trim();
  if (raw?.endsWith("px")) {
    const n = parseFloat(raw);
    if (Number.isFinite(n)) return n;
  }
  return 56;
}

function pickPlayerRoot(doc: Document): HTMLElement | null {
  return (
    (doc.querySelector("#player-wide-container") as HTMLElement | null) ??
    (doc.querySelector("#player-container-outer") as HTMLElement | null) ??
    (doc.querySelector("#player-container-inner") as HTMLElement | null)
  );
}

function scrollRootEl(doc: Document): HTMLElement {
  const se = doc.scrollingElement;
  if (se instanceof HTMLElement) return se;
  return doc.documentElement;
}

export function attachPlayerPin(doc: Document): () => void {
  const win = doc.defaultView;
  if (!win) return () => undefined;
  const view: Window = win;

  let sentinel: HTMLDivElement | null = null;
  let spacer: HTMLDivElement | null = null;
  let io: IntersectionObserver | null = null;
  let ro: ResizeObserver | null = null;

  const header = () => toolbarHeight(doc);
  const root = scrollRootEl(doc);

  function readPinGeometry(player: HTMLElement): { left: number; width: number } {
    const r = player.getBoundingClientRect();
    return { left: r.left, width: r.width };
  }

  function applyPinned(player: HTMLElement, pinned: boolean): void {
    const app = doc.querySelector("ytd-app");
    if (!app) return;

    if (pinned) {
      if (!spacer) {
        spacer = doc.createElement("div");
        spacer.id = SPACER_ID;
        spacer.style.flexShrink = "0";
        player.parentElement?.insertBefore(spacer, player);
      }
      spacer.style.height = `${player.offsetHeight}px`;

      const { left, width } = readPinGeometry(player);
      doc.documentElement.style.setProperty("--ytvl-pin-left", `${left}px`);
      doc.documentElement.style.setProperty("--ytvl-pin-width", `${width}px`);
      app.classList.add(PINNED_CLASS);
    } else {
      app.classList.remove(PINNED_CLASS);
      doc.documentElement.style.removeProperty("--ytvl-pin-left");
      doc.documentElement.style.removeProperty("--ytvl-pin-width");
      spacer?.remove();
      spacer = null;
    }
  }

  function ensureSentinel(player: HTMLElement): HTMLDivElement {
    let s = doc.getElementById(SENTINEL_ID) as HTMLDivElement | null;
    if (!s) {
      s = doc.createElement("div");
      s.id = SENTINEL_ID;
      s.setAttribute("aria-hidden", "true");
      s.style.width = "1px";
      s.style.height = "1px";
      s.style.marginBottom = "-1px";
      s.style.pointerEvents = "none";
      player.parentElement?.insertBefore(s, player);
    }
    return s;
  }

  function syncFromIntersection(isIntersecting: boolean): void {
    const app = doc.querySelector("ytd-app");
    const player = pickPlayerRoot(doc);
    if (!app?.classList.contains("ytvl-enabled") || !player) {
      app?.classList.remove(PINNED_CLASS);
      doc.documentElement.style.removeProperty("--ytvl-pin-left");
      doc.documentElement.style.removeProperty("--ytvl-pin-width");
      doc.getElementById(SPACER_ID)?.remove();
      spacer = null;
      return;
    }
    /* Pin when sentinel has scrolled above the toolbar band */
    const pin = !isIntersecting;
    applyPinned(player, pin);
  }

  function setup(): void {
    teardownInner();
    const player = pickPlayerRoot(doc);
    if (!player) return;

    sentinel = ensureSentinel(player);
    const h = header();

    io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e) syncFromIntersection(e.isIntersecting);
      },
      {
        root: root === doc.documentElement ? null : root,
        rootMargin: `-${h}px 0px 0px 0px`,
        threshold: 0,
      },
    );
    io.observe(sentinel);
    queueMicrotask(() => {
      const entries = io?.takeRecords() ?? [];
      if (entries.length > 0) {
        const last = entries[entries.length - 1];
        syncFromIntersection(last.isIntersecting);
        return;
      }
      if (sentinel) {
        const r = sentinel.getBoundingClientRect();
        const hPx = header();
        syncFromIntersection(r.top >= hPx - 2 && r.bottom > hPx);
      }
    });

    ro = new ResizeObserver(() => {
      const p = pickPlayerRoot(doc);
      if (!p || !doc.querySelector("ytd-app")?.classList.contains(PINNED_CLASS)) return;
      const { left, width } = readPinGeometry(p);
      doc.documentElement.style.setProperty("--ytvl-pin-left", `${left}px`);
      doc.documentElement.style.setProperty("--ytvl-pin-width", `${width}px`);
      if (spacer) spacer.style.height = `${p.offsetHeight}px`;
    });
    ro.observe(player);

    view.addEventListener("resize", onResize, { passive: true });
  }

  function onResize(): void {
    const p = pickPlayerRoot(doc);
    if (!p || !doc.querySelector("ytd-app")?.classList.contains(PINNED_CLASS)) return;
    const { left, width } = readPinGeometry(p);
    doc.documentElement.style.setProperty("--ytvl-pin-left", `${left}px`);
    doc.documentElement.style.setProperty("--ytvl-pin-width", `${width}px`);
    if (spacer) spacer.style.height = `${p.offsetHeight}px`;
  }

  function teardownInner(): void {
    io?.disconnect();
    io = null;
    ro?.disconnect();
    ro = null;
    view.removeEventListener("resize", onResize);
    doc.getElementById(SENTINEL_ID)?.remove();
    sentinel = null;
    doc.querySelector("ytd-app")?.classList.remove(PINNED_CLASS);
    doc.documentElement.style.removeProperty("--ytvl-pin-left");
    doc.documentElement.style.removeProperty("--ytvl-pin-width");
    doc.getElementById(SPACER_ID)?.remove();
    spacer = null;
  }

  setup();

  return () => {
    teardownInner();
  };
}
