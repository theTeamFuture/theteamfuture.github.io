import type { CAudioPlayer } from "./audio-player";
import { CDialog } from "./dialog-container";

// --- Export class ---
export class CQueryResult extends CDialog {
  private minTimeout: Promise<void> | null = null;

  public open() {
    this.minTimeout = new Promise((res) => setTimeout(res, 1000));
    this.showSection("querying");
    super.open();
  }

  public async notFound() {
    await this.minTimeout;
    this.dataset.closeable = "true";
    this.showSection("not-found");
  }

  public async text(name: string, data: string) {
    await this.minTimeout;
    this.querySelector("#text-title")!.textContent = name;
    this.querySelector("#text-content")!.textContent = data;
    this.dataset.closeable = "true";
    this.showSection("text");
  }

  public async image(name: string, data: string) {
    await this.minTimeout;
    this.querySelector("#image-title")!.textContent = name;
    this.querySelector<HTMLImageElement>("#image-el")!.src = data;
    this.dataset.closeable = "true";
    this.showSection("image");
  }

  public async audio(name: string, data: string) {
    await this.minTimeout;

    const ap = this.querySelector<CAudioPlayer>("c-audio-player")!;
    ap.init(name, data);

    this.addEventListener("close", () => ap.stop());
    this.dataset.closeable = "true";
    this.showSection("audio");
  }

  private showSection(id: string) {
    this.querySelectorAll("section").forEach(
      (el) => (el.style.display = "none"),
    );
    this.querySelector<HTMLElement>(`#${id}`)!.style.display = "block";
  }
}

// Register element
customElements.define("c-query-result", CQueryResult);
