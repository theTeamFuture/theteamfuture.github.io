import type { Image, ImageReference, Paragraph, Root } from "mdast";
import { visit } from "unist-util-visit";

// Export plugin
export default function remarkFigure() {
  return (tree: Root) => {
    let counter = 1;

    visit(tree, "image", (node) => {
      const data = node.data || (node.data = {});
      data.hProperties = { loading: "lazy" };
    });

    visit(tree, "containerDirective", (node) => {
      if (node.name === "figure") {
        const data = node.data || (node.data = {});

        // Get figure caption
        let caption: Paragraph | null = null;
        if (
          node.children[0]?.type === "paragraph" &&
          node.children[0].data?.directiveLabel
        ) {
          caption = node.children.shift() as Paragraph;
          const data = caption.data || (caption.data = {});
          data.hName = "figcaption";
        }

        // Strip paragraphs
        const images: Paragraph[] = node.children
          .flatMap((node) =>
            node.type === "paragraph"
              ? node.children.filter(
                  ({ type }) => type === "image" || type === "imageReference",
                )
              : [],
          )
          .map((node) => ({
            type: "paragraph",
            data: {
              hName: "a",
              hProperties: {
                className: ["glightbox", "not-content"],
                dataType: "image",
                dataGallery: `gallery-${counter}`,
                dataTitle: (node as Image | ImageReference).alt,
              },
            },
            children: [node],
          }));
        if (!images.length) {
          throw Error("figure cannot be empty");
        }

        // Update node
        data.hName = "figure";
        data.hProperties = { className: ["remark-figure"] };
        node.children = images;
        if (caption) {
          node.children.push(caption);
        }

        // Update counter
        counter++;
      }
    });
  };
}
