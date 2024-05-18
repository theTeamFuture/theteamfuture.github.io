/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type anime from 'animejs';

// Rehype figure type define
declare module 'rehype-figure' {
  export default (option: any) => (tree: Root, file: VFile) => undefined;
}

// Global type inject
declare global {
  // Anime.js
  declare module anime {
    export = anime;
    export as namespace anime;
  }
}
