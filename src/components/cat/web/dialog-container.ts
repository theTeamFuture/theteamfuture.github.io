import { animate } from "animejs";

// --- Export class ---
export class CDialog extends HTMLElement {
  public static readonly observedAttributes = ["data-closeable"];

  public connectedCallback() {
    this.querySelector<HTMLButtonElement>("#btn-close")?.addEventListener(
      "click",
      () => this.close(),
    );
    this.updateCloseButton();
  }

  public attributeChangedCallback(name: string) {
    if (name === "data-closeable") this.updateCloseButton();
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
    this.dispatchEvent(new Event("close"));
    animate(this.querySelector("#content")!, {
      scaleY: [1, 0],
      duration: 100,
      onComplete: () => {
        this.style.display = "none";
      },
    });
  }

  public setCloseable(value?: boolean) {
    if (value === undefined) {
      this.updateCloseButton();
      return;
    }

    this.dataset.closeable = String(value);
  }

  private updateCloseButton() {
    const closeButton = this.querySelector<HTMLButtonElement>("#btn-close");
    if (!closeButton) return;

    closeButton.style.display =
      (this.dataset.closeable ?? "true") === "true" ? "block" : "none";
  }
}

// Register element
customElements.define("c-dialog", CDialog);
