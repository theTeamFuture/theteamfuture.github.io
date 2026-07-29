// --- Types ---
export interface FmtNumOpts {
  base?: number;
  decimal?: number;
  units?: string;
  postfix?: string;
}

// --- Helpers ---
export const fmtNum = (x: number, opts: FmtNumOpts = {}) => {
  const { base = 1_000, decimal = 1, units = "kmb", postfix = "" } = opts;

  const isInt = Number.isInteger(x);
  let idx = -1;
  while (x >= base && idx + 1 < units.length) {
    x /= base;
    idx++;
  }

  return isInt && idx < 0
    ? `${x}${postfix}`
    : x.toFixed(decimal) + units[idx] + postfix;
};

export const splitNum = (x: number) => x.toLocaleString("en-US");
