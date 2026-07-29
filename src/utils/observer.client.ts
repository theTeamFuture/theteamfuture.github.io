import { fmtNum, splitNum, type FmtNumOpts } from "./number";

// --- Helpers ---
export const obFmtNum = (
  el: Element,
  fmtNumOpts: FmtNumOpts = {},
  once: boolean = true,
  persist: boolean = false,
) => {
  if (el.hasAttribute("data-ob-fmt-num")) return;
  el.setAttribute("data-ob-fmt-num", "1");

  const update = () => {
    const raw = el.textContent.trim() ?? "";
    const num = Number(raw);
    if (!Number.isFinite(num) || num < 0) return false;

    el.textContent = fmtNum(num, fmtNumOpts);
    el.setAttribute("title", splitNum(num));
    return true;
  };

  if (update() && once) return;
  const ob = new MutationObserver(() => {
    if (update() && once) ob.disconnect();
  });
  ob.observe(el, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  if (persist) return;
  const cleanup = () => {
    ob.disconnect();
    document.removeEventListener("astro:before-swap", cleanup);
  };
  document.addEventListener("astro:before-swap", cleanup, { once: true });
};
