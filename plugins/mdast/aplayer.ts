import type { MdastNode, MdastVisitorContext } from "satteri";
import { defineMdastPlugin } from "satteri";
import * as cheerio from "cheerio";

// --- Helpers ---
const replaceNode = (
  node: MdastNode,
  ctx: MdastVisitorContext,
  attrs: Record<string, unknown>,
) => {
  const rawOpts = {
    ...attrs,
    volume: attrs.volume ? Number(attrs.volume) : undefined,
    audio: [
      {
        name: attrs.name || "audio",
        artist: attrs.artist,
        url: attrs.url,
        cover: attrs.cover,
        lrc: attrs.lrc,
        theme: attrs.theme,
        type: attrs.type,
      },
    ],
  };
  const opts = btoa(JSON.stringify(rawOpts));

  const id = "aplayer-" + Math.random().toString(16).slice(2);
  ctx.replaceNode(node, {
    type: "leafDirective",
    name: "__aplayer",
    data: {
      hName: "div",
      hProperties: { id },
    },
    children: [
      {
        type: "html",
        value: `<script>
  (() => {
    const f = () => {
      const el = document.querySelector("#${id}");
      const opts = JSON.parse(
        new TextDecoder().decode(
          Uint8Array.from(atob("${opts}"), (s) => s.charCodeAt(0))
        )
      );
      new APlayer({ ...opts, container: el });
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", f);
    } else {
      f();
    }
  })();
</script>`,
      },
    ],
  });
};

// --- Export plugin ---
export default () =>
  defineMdastPlugin({
    name: "aplayer",
    leafDirective(node, ctx) {
      if (node.name !== "aplayer") return;

      const attrs = node.attributes ?? {};
      replaceNode(node, ctx, attrs);
    },
    html(node, ctx) {
      const $ = cheerio.load(node.value, null, false);
      const els = $.root().children();
      if (els.length !== 1 || !els.first().is("audio")) return;

      const src = els.first().attr("src");
      if (!src) return;

      const attrs = els.first().data();
      attrs.url = src;
      replaceNode(node, ctx, attrs);
    },
  });
