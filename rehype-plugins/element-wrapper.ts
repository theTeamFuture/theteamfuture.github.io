import type { Element, Root } from "hast";
import { parseSelector } from "hast-util-parse-selector";
import { selectAll } from "hast-util-select";
import { visit } from "unist-util-visit";

// Options
interface Options {
  selector?: string;
  wrapper?: string;
  transformer?: (el: Element) => void;
}

// Export plugin
export default function rehypeElementWrapper({
  selector,
  wrapper,
  transformer,
}: Options = {}) {
  if (!selector) {
    throw Error("selector cannot be empty");
  }
  if (!wrapper) {
    throw Error("wrapper cannot be empty");
  }

  return (tree: Root) =>
    selectAll(selector, tree).forEach((el) => {
      const wrap = parseSelector(wrapper);
      visit(tree, el, (_, index, parent) => {
        wrap.children = [el];
        transformer?.(wrap);
        parent!.children[index!] = wrap;
      });
    });
}
