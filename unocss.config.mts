import {
  defineConfig,
  presetIcons,
  presetWind4,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

// https://unocss.dev/config
export default defineConfig({
  presets: [
    presetIcons({ autoInstall: true }),
    presetWind4({
      preflights: { reset: true },
    }),
  ],
  transformers: [
    transformerCompileClass(),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
