import type { TransitionBeforePreparationEvent } from "astro:transitions/client";

// --- Export class ---
export class CLoader extends HTMLElement {
  public connectedCallback() {
    document.addEventListener(
      "astro:before-preparation",
      this.onBeforePreparation,
    );
    document.addEventListener("astro:after-swap", this.onAfterSwap);
  }

  public disconnectedCallback() {
    document.removeEventListener(
      "astro:before-preparation",
      this.onBeforePreparation,
    );
    document.removeEventListener("astro:after-swap", this.onAfterSwap);
  }

  private onBeforePreparation = (ev: TransitionBeforePreparationEvent) => {
    // Not show load bar when get assets
    if (ev.to.pathname.startsWith("/assets")) return;

    // --- Start new animation ---
    this.style.display = "flex";
  };

  private onAfterSwap = () => {
    this.style.display = "none";
  };
}

// Register element
customElements.define("c-loader", CLoader);
