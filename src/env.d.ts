/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Rehype figure type define
declare module 'rehype-figure' {
  export default (option: any) => (tree: Root, file: VFile) => undefined;
}
