import type { CQueryResult } from "./query-result";
import { queryLegacy } from "@/utils/cat/legacy.client";

// --- Export class ---
export class CDatabaseQueryForm extends HTMLElement {
  private get form() {
    return this.querySelector("form")!;
  }
  private get qryResult() {
    return document.querySelector<CQueryResult>("#dialog-query-result")!;
  }

  public connectedCallback() {
    this.form
      .querySelector<HTMLSelectElement>("[name=executor]")
      ?.addEventListener("change", (ev) => {
        this.form
          .querySelectorAll("section")
          .forEach((el) => (el.style.display = "none"));
        this.form.querySelectorAll("input").forEach((el) => {
          el.value = "";
          el.removeAttribute("required");
        });

        const target = ev.target as HTMLSelectElement;
        const sec = this.form.querySelector<HTMLDivElement>(
          `#s-${target.value}`,
        );
        if (!sec) return;

        sec.style.display = "flex";
        sec
          .querySelectorAll("input")
          .forEach((el) => el.setAttribute("required", ""));
      });

    this.form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(this.form);

      this.qryResult.open();
      switch (data.get("executor")) {
        case "public":
          this.qryResult.error("Not Found");
          break;
        case "classified":
          this.qryResult.error("Not Found");
          break;
        case "legacy":
          this.handleLegacy(data);
          break;
      }
    });
  }

  private async handleLegacy(data: FormData) {
    const id = data.get("s-legacy-id") as string;
    const pass = data.get("s-legacy-password") as string;

    try {
      const result = await queryLegacy(id, pass);
      this.qryResult.show(result);
    } catch (err) {
      if (typeof err === "string") {
        this.qryResult.error(err);
      } else {
        this.qryResult.error("Unexpected Error");
      }
    }
  }
}

// Register element
customElements.define("c-database-query-form", CDatabaseQueryForm);
