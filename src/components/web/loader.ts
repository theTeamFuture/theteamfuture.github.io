import type { TransitionBeforePreparationEvent } from "astro:transitions/client";
import type { JSAnimation } from "animejs";
import { animate } from "animejs";

// --- Export class ---
export class FLoader extends HTMLElement {
  private animation: JSAnimation | null = null;

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

    // --- Stop old animation ---
    if (this.animation !== null) {
      this.animation.complete();
      this.animation = null;
    }

    // --- Start new animation ---
    this.animation = animate(this, {
      width: ["0%", "90%"],
      duration: 5000,
      ease: "outCubic",
      onBegin: () => {
        this.style.display = "block";
        this.style.opacity = "1";
      },
      onComplete: () => {
        this.animation = null;
      },
    });
  };

  private onAfterSwap = () => {
    // --- Stop old animation ---
    if (this.animation !== null) {
      this.animation.cancel();
      this.animation = null;
    }

    // --- Start new animation ---
    this.animation = animate(this, {
      width: {
        to: "100%",
        duration: 500,
      },
      opacity: {
        to: "0",
        duration: 100,
        delay: 500,
      },
      ease: "linear",
      onComplete: (): void => {
        this.style.display = "none";
        this.animation = null;
      },
    });
  };
}

// Register element
customElements.define("f-loader", FLoader);
