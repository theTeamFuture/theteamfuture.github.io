import type { Element, Root } from "hast";
import type { Transformer } from "unified";
import { parseSelector } from "hast-util-parse-selector";
import { selectAll } from "hast-util-select";
import { visit } from "unist-util-visit";

// Type
export type Options = {
  selector: string;
  wrapper: string;
};

// Export plugin
export default function rehypeElementWrapper(opts: Options): Transformer<Root> {
  return (tree: Root): void => {
    selectAll(opts.selector, tree).forEach((el: Element): void => {
      visit(tree, el, (_, index?: number, parent?: Root | Element): void => {
        const wrapper: Element = parseSelector(opts.wrapper);
        wrapper.children = [el];
        parent!.children[index!] = wrapper;
      });
    });
  };
}
