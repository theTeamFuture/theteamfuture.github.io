import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";
import { theme } from "unocss/preset-wind4";

// https://unocss.dev/config
export default defineConfig({
  presets: [
    presetIcons({
      collections: {
        local: FileSystemIconLoader("./src/assets/icons", (svg) =>
          svg.replace('fill="#000"', 'fill="transparent"'),
        ),
      },
    }),
    presetWind4({
      preflights: { reset: true },
    }),
    presetTypography({
      cssExtend: {
        a: {
          color: theme.colors.blue[500],
          "text-decoration": "none",
          "transition-property": "color",
          "transition-timing-function": theme.default.transition.timingFunction,
          "transition-duration": theme.default.transition.duration,
        },
        "a:hover": { color: theme.colors.red[500] },
        h2: {
          "border-bottom-width": "2px",
          "border-color": theme.colors.neutral[700],
        },
        figure: {
          "margin-top": "1.25rem",
          "margin-bottom": "1.25rem",
        },
        "figure figcaption": {
          "text-align": "center",
        },
        "figure img": {
          margin: "0 auto",
          "max-width": "75%",
        },
      },
    }),
  ],
  transformers: [
    transformerCompileClass(),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
