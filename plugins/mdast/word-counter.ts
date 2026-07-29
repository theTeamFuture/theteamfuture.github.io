import type { MdastNode, MdastVisitorContext } from "satteri";
import { defineMdastPlugin } from "satteri";

// --- Types ---
export interface Options {
  outputField?: string;
  fallbackLocal?: string;
}

// --- Constants ---
const segmenters = new Map<string, Intl.Segmenter>();

// --- Helpers ---
const getFrontmatter = (ctx: MdastVisitorContext) =>
  ctx.data.astro?.frontmatter ?? ctx.data;

const getSegmenter = (locale: string, fallback: string) => {
  const loc = Intl.Segmenter.supportedLocalesOf([locale])[0] ?? fallback;
  if (!segmenters.has(loc)) {
    segmenters.set(loc, new Intl.Segmenter(loc, { granularity: "word" }));
  }
  return segmenters.get(loc)!;
};

const countWords = (text: string, locale: string, fallback: string) => {
  const seg = getSegmenter(locale, fallback);
  let count = 0;
  for (const part of seg.segment(text)) {
    if (part.isWordLike) count++;
  }
  return count;
};

// --- Export plugin ---
export default ({
  outputField = "wordCount",
  fallbackLocal = "en",
}: Options = {}) => {
  let total = 0;

  const countBlock = (node: MdastNode, ctx: MdastVisitorContext) => {
    const fm = getFrontmatter(ctx);
    const locale = String(fm.language ?? fallbackLocal);
    const text = ctx.textContent(node, {
      includeHtml: false,
      includeImageAlt: false,
    });

    total += countWords(text, locale, fallbackLocal);
    fm[outputField] = total;
  };

  return defineMdastPlugin({
    name: "word-counter",
    paragraph: countBlock,
    heading: countBlock,
    tableCell: countBlock,
  });
};
