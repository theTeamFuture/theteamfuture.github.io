/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type anime from 'animejs';

// Window type inject
declare global {
  // Anime.js
  declare module anime {
    export = anime;
    export as namespace anime;
  }
}
