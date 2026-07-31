// --- Export class ---
export class CDatabaseQueryForm extends HTMLElement {
  private get form() {
    return this.querySelector("form")!;
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

      switch (data.get("executor")) {
        case "public":
          console.log("p");
          break;
        case "classified":
          console.log("c");
          break;
        case "legacy":
          console.log("l");
          break;
      }
    });
  }
}

// Register element
customElements.define("c-database-query-form", CDatabaseQueryForm);
