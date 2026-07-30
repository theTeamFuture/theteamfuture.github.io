import { animate } from "animejs";

// --- Export class ---
export class FPreloader extends HTMLElement {
  private done = false;

  public connectedCallback() {
    if (this.done) return;
    this.done = true;

    if (document.readyState === "complete") {
      this.close();
    } else {
      window.addEventListener("load", () => this.close(), { once: true });
    }
  }

  private close() {
    animate(this, {
      opacity: [1, 0],
      duration: 500,
      delay: 1000,
      ease: "inOutCubic",
      onComplete: () => {
        this.style.display = "none";
      },
    });
  }
}

// Register element
customElements.define("f-preloader", FPreloader);
