import type { KatexOptions } from "katex";
import type { MdastNode, MdastVisitorContext } from "satteri";
import { defineMdastPlugin } from "satteri";
import { renderToString } from "katex";
import escapeHTML from "escape-html";

// --- Types ---
type MathLikeNode = Extract<MdastNode, { type: "math" | "inlineMath" }>;

// --- Helpers ---
const renderError = (val: string, err: unknown, opts: KatexOptions) => {
  const title = escapeHTML(String(err));
  const color = escapeHTML(opts.errorColor ?? "#cc0000");
  const content = escapeHTML(val);
  const el = `<span class="katex-error" style="color:${color}" title="${title}">${content}</span>`;

  return opts.displayMode ? `<span class="katex-display">${el}</span>` : el;
};

const renderMath = (
  node: MathLikeNode,
  displayMode: boolean,
  opts: KatexOptions,
  ctx: MdastVisitorContext,
) => {
  try {
    return renderToString(node.value, {
      ...opts,
      displayMode,
      throwOnError: true,
    });
  } catch (err) {
    const cause = err instanceof Error ? err : new Error(String(err));
    ctx.report({
      node,
      severity: "error",
      message: `Could not render math with KaTeX: ${cause.message}`,
    });

    return renderError(node.value, err, { ...opts, displayMode });
  }
};

// --- Export plugin ---
export default (opts: KatexOptions = {}) =>
  defineMdastPlugin({
    name: "katex",
    math(node, ctx) {
      return { raw: renderMath(node, true, opts, ctx), mdxExpressions: false };
    },
    inlineMath(node, ctx) {
      return { raw: renderMath(node, false, opts, ctx), mdxExpressions: false };
    },
  });
