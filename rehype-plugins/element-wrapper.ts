/// Element wrapper rehype plugin
import type { Element, Root } from 'hast';
import { parseSelector } from 'hast-util-parse-selector';
import { selectAll } from 'hast-util-select';
import { visit } from 'unist-util-visit';

// Types
type Options = {
  selector: string;
  wrapper: string;
};

// Export plugin
export default function rehypeElementWrapper(opt: Options) {
  return (tree: Root): void => {
    const els: Element[] = selectAll(opt.selector, tree);

    els.forEach((el: Element): void => {
      const wrap: Element = parseSelector(opt.wrapper);
      visit(
        tree,
        el,
        (_: Element, index?: number, parent?: Root | Element): void => {
          wrap.children = [el];
          parent!.children[index!] = wrap;
        }
      );
    });
  };
}
