// Pure Pi theme -> herdr theme derivation. No imports, no I/O.
//
// A Pi theme has `vars` (name -> #hex) and `colors` (Pi UI key -> var name or #hex).
// A source is looked up by name: `colors[name]` first (a var name or a hex), then `vars[name]`.
// The first candidate that resolves to #rrggbb wins; otherwise the `base` value is kept.
//
// herdr field                                  <- Pi sources (first match wins)
// background, colors.background                <- bg
// foreground, colors.foreground, solid         <- text
// selection, colors.selection, selected, hover <- selection, selectedBg
// cursor, colors.accent, ansi5 (magenta)       <- accent
// colors.chrome, colors.canvas, popover        <- bgPanel
// colors.surface, colors.input                 <- bgElement, bgSubtle
// colors.raised                                <- userMessageBg
// colors.border                                <- border
// colors.muted, idle, ansi7                    <- muted
// colors.dim, ansi8                            <- dim
// colors.working                               <- accent
// colors.blocked, ansi1/ansi9 (red)            <- error
// colors.done, ansi2/ansi10 (green)            <- success
// ansi3/ansi11 (yellow)                        <- warning
// ansi4/ansi12 (blue)                          <- info
// ansi6/ansi14 (cyan)                          <- cyan
// ansi13 (bright magenta)                      <- activePink
// ansi15 (bright white)                        <- text
// Everything else (ansi0, accent_foreground, solid_foreground, unknown) keeps `base`.

export const BASE = {
  background: "#140a12",
  foreground: "#f6eff3",
  selection: "#342230",
  cursor: "#f095c8",
  ansi: [
    "#20161e", "#ff718f", "#b4e7c7", "#e0c27a", "#a9c7ee", "#ff76c3", "#d7a0b8", "#a78e9b",
    "#76616b", "#ff718f", "#b4e7c7", "#f2b86d", "#a9c7ee", "#ffb1dd", "#d7a0b8", "#f6eff3",
  ],
  colors: {
    background: "#140a12",
    foreground: "#f6eff3",
    chrome: "#100a0e",
    canvas: "#100a0e",
    surface: "#20161e",
    popover: "#20161e",
    raised: "#241822",
    hover: "#241822",
    selected: "#342230",
    border: "#342230",
    input: "#1a1218",
    muted: "#a78e9b",
    dim: "#76616b",
    accent: "#f095c8",
    accent_foreground: "#140a12",
    solid: "#f6eff3",
    solid_foreground: "#140a12",
    selection: "#342230",
    working: "#f095c8",
    blocked: "#ff718f",
    done: "#b4e7c7",
    idle: "#a78e9b",
    unknown: "#76616b",
  },
};

const HEX = /^#[0-9a-fA-F]{6}$/;
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

// [herdr color name, Pi sources] for `colors`.
const COLORS = [
  ["background", ["bg"]],
  ["foreground", ["text"]],
  ["chrome", ["bgPanel"]],
  ["canvas", ["bgPanel"]],
  ["popover", ["bgPanel"]],
  ["surface", ["bgElement", "bgSubtle"]],
  ["input", ["bgElement", "bgSubtle"]],
  ["raised", ["userMessageBg"]],
  ["hover", ["selection", "selectedBg"]],
  ["selected", ["selection", "selectedBg"]],
  ["selection", ["selection", "selectedBg"]],
  ["border", ["border"]],
  ["muted", ["muted"]],
  ["idle", ["muted"]],
  ["dim", ["dim"]],
  ["accent", ["accent"]],
  ["working", ["accent"]],
  ["blocked", ["error"]],
  ["done", ["success"]],
  ["solid", ["text"]],
];

// [ansi index, Pi sources].
const ANSI = [
  [1, ["error"]], [9, ["error"]],
  [2, ["success"]], [10, ["success"]],
  [3, ["warning"]], [11, ["warning"]],
  [4, ["info"]], [12, ["info"]],
  [5, ["accent"]], [13, ["activePink"]],
  [6, ["cyan"]], [14, ["cyan"]],
  [7, ["muted"]], [8, ["dim"]], [15, ["text"]],
];

export function derive(piTheme, base = BASE) {
  if (!isObject(piTheme) || (!isObject(piTheme.vars) && !isObject(piTheme.colors))) return base;
  const vars = isObject(piTheme.vars) ? piTheme.vars : {};
  const pi = isObject(piTheme.colors) ? piTheme.colors : {};

  const hex = (v) => (typeof v === "string" && HEX.test(v) ? v.toLowerCase() : null);
  const resolve = (name) => {
    for (const source of [pi, vars]) {
      const v = source[name];
      const found = hex(v) ?? (typeof v === "string" && Object.hasOwn(vars, v) ? hex(vars[v]) : null);
      if (found) return found;
    }
    return null;
  };
  const pick = (names, fallback) => {
    for (const n of names) {
      const c = resolve(n);
      if (c) return c;
    }
    return fallback;
  };

  const baseColors = isObject(base.colors) ? base.colors : {};
  const out = {
    background: pick(["bg"], base.background),
    foreground: pick(["text"], base.foreground),
    selection: pick(["selection", "selectedBg"], base.selection),
    cursor: pick(["accent"], base.cursor),
    ansi: [...base.ansi],
    colors: { ...baseColors },
  };
  for (const [i, names] of ANSI) out.ansi[i] = pick(names, base.ansi[i]);
  for (const [name, names] of COLORS) out.colors[name] = pick(names, baseColors[name]);
  return out;
}
