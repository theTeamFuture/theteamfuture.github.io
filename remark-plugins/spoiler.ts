import type { Html, Root, Text } from "mdast";
import type { Transformer } from "unified";
import { findAndReplace } from "mdast-util-find-and-replace";

// Export plugin
export default function remarkSpoiler(): Transformer<Root> {
  return (tree: Root): void => {
    findAndReplace(tree, [
      [
        /(?<!\\)\|\|((?:\\\||[^|])+?)\|\|/g,
        (_, content: string): Html => {
          const tmp: string = content.replace(/\\\|/g, "|");
          return {
            type: "html",
            value: `<span class="spoiler">${tmp}</span>`,
          };
        },
      ],
      [/\\\|\|/g, (): Text => ({ type: "text", value: "||" })],
    ]);
  };
}
