import { animate } from "animejs";

// --- Export class ---
export class CDialog extends HTMLElement {
  public connectedCallback() {
    this.querySelector<HTMLButtonElement>("#btn-close")?.addEventListener(
      "click",
      () => this.close(),
    );
  }

  public open() {
    animate(this.querySelector("#content")!, {
      scaleY: [0, 1],
      duration: 100,
      onBegin: () => {
        this.style.display = "flex";
      },
    });
  }

  public close() {
    animate(this.querySelector("#content")!, {
      scaleY: [1, 0],
      duration: 100,
      onComplete: () => {
        this.style.display = "none";
      },
    });
  }
}

// Register element
customElements.define("c-dialog", CDialog);
