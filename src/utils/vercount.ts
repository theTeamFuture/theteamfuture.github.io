let nonce: number | null = null;

export const fetchAndShow = async (): Promise<void> => {
  try {
    const flag: number = Math.trunc(Math.random() * 1000000000);
    nonce = flag;

    const res: Response = await fetch("https://vercount.one/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: location.href }),
    });
    const data: Record<string, string> = await res.json();

    if (nonce !== flag) {
      return;
    }
    ["site_pv", "page_pv", "site_uv"].forEach((id: string): void => {
      const el: HTMLElement | null = document.querySelector(
        `#busuanzi_value_${id}`
      );
      if (el !== null) {
        el.textContent = data[id] || "0";
      }
    });
  } catch (err: unknown) {
    console.error("Error fetching visitor count:", err);
    ["site_pv", "page_pv", "site_uv"].forEach((id: string): void => {
      const el: HTMLElement | null = document.querySelector(
        `#busuanzi_value_${id}`
      );
      if (el !== null) {
        el.style.display = "none";
      }
    });
  }
};
