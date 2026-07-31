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

  public async text(name: string, content: string) {
    await this.minTimeout;
    this.querySelector("#text-name")!.textContent = name;
    this.querySelector("#text-content")!.textContent = content;
    this.dataset.closeable = "true";
    this.showSection("text");
  }

  public async image(name: string, src: string) {
    await this.minTimeout;
    this.querySelector("#image-name")!.textContent = name;
    this.querySelector<HTMLImageElement>("#image-el")!.src = src;
    this.dataset.closeable = "true";
    this.showSection("image");
  }

  public async audio(name: string, src: string) {
    await this.minTimeout;

    const ap = this.querySelector<CAudioPlayer>("c-audio-player")!;
    ap.init(name, src);

    this.addEventListener("close", () => ap.stop());
    this.dataset.closeable = "true";
    this.showSection("audio");
  }

  public async blob(name: string, blob: Blob) {
    await this.minTimeout;
    this.querySelector("#blob-name")!.textContent = name;
    this.dataset.closeable = "true";
    this.showSection("blob");

    const el = document.createElement("a");
    const url = URL.createObjectURL(blob);
    el.href = url;
    el.download = name;
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    el.remove();
    URL.revokeObjectURL(url);
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
