import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { derive, parseColor, resolveTheme, BASE } from "../../mods/gentle-theme/derive.js";
import { BUILTIN } from "../../mods/gentle-theme/builtin.js";

const shipped = JSON.parse(readFileSync(new URL("../../themes/gentle-shell.json", import.meta.url), "utf8"));
const HEX = /^#[0-9a-f]{6}$/;
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

function assertComplete(t) {
  assert.equal(t.ansi.length, 16);
  for (const c of [t.background, t.foreground, t.selection, t.cursor, ...t.ansi, ...Object.values(t.colors)]) {
    assert.match(c, HEX);
  }
}

test("okhsl() matches Pi's own conversion", () => {
  const cases = {
    "okhsl(295 50% 67%)": "#a798d7",
    "okhsl(234 3% 89%)": "#dee0e1",
    "okhsl(262 14% 16%)": "#21252c",
    "okhsl(17 3% 94%)": "#efeeee",
    "okhsl(159 75% 46%)": "#337e58",
    "okhsl(20 91% 47%)": "#c8253d",
    "okhsl(83 99% 47%)": "#8f6802",
    "okhsl(337 81% 61%)": "#de54c1",
    "okhsl(120 100% 50%)": "#6d8200",
  };
  for (const [input, hex] of Object.entries(cases)) assert.equal(parseColor(input), hex, input);
});

test("okhsl() edges: white, black, gray, junk, hex passthrough", () => {
  assert.equal(parseColor("okhsl(10 50% 100%)"), "#ffffff");
  assert.equal(parseColor("okhsl(10 50% 0%)"), "#000000");
  const gray = parseColor("okhsl(200 0% 40%)");
  assert.equal(gray, "#5e5e5e");
  assert.equal(gray.slice(1, 3), gray.slice(3, 5));
  assert.equal(gray.slice(3, 5), gray.slice(5, 7));
  assert.equal(parseColor("#ABCDEF"), "#abcdef");
  for (const bad of ["okhsl(1 2)", "okhsl(10 150% 50%)", "red", "", 5, null]) assert.equal(parseColor(bad), null);
});

test("built-in themes derive to complete themes", () => {
  for (const name of ["dark", "light"]) {
    const t = derive(BUILTIN[name], shipped);
    assertComplete(t);
    assert.notDeepEqual(t, shipped);
  }
});

test("built-in dark: dark background from export.pageBg, mapped colors", () => {
  const t = derive(BUILTIN.dark, shipped);
  assert.equal(t.background, "#21252c");
  assert.ok(lum(t.background) < 0.5);
  assert.equal(t.colors.chrome, "#282c34");
  assert.equal(t.colors.surface, "#282c34");
  assert.equal(t.foreground, "#dee0e1");
  assert.equal(t.cursor, "#a798d7");
  assert.equal(t.colors.border, "#5fa8cc");
  assert.equal(t.selection, "#213b49");
  assert.equal(t.ansi[4], "#69add0"); // no info: mdLink
});

test("built-in light: light background, dark text, readable always-base fields", () => {
  const t = derive(BUILTIN.light, shipped);
  assert.equal(t.background, "#efeeee");
  assert.ok(lum(t.background) > 0.5);
  assert.equal(t.foreground, "#3b3f41");
  assert.ok(lum(t.foreground) < 0.5);
  assert.equal(t.colors.chrome, "#f7f6f6");
  assert.equal(t.ansi[1], "#c8253d");
  assert.ok(contrast(t.colors.accent_foreground, t.colors.accent) >= 4.5);
  assert.ok(contrast(t.colors.solid_foreground, t.colors.solid) >= 4.5);
  assert.ok(lum(t.ansi[0]) < 0.2);
  assert.equal(t.colors.unknown, "#879095"); // dim
});

test("fallbacks: borderMuted, bgSubtle, syntaxVariable, unknown from dim", () => {
  const t = derive({ vars: {}, colors: { borderMuted: "#111111", bgSubtle: "#222222", syntaxVariable: "#333333", dim: "#444444" } }, shipped);
  assert.equal(t.colors.border, "#111111");
  assert.equal(t.colors.surface, "#222222");
  assert.equal(t.ansi[6], "#333333");
  assert.equal(t.colors.unknown, "#444444");
});

test("dark themes keep the base always-base fields", () => {
  const t = derive(BUILTIN.dark, shipped);
  assert.equal(t.ansi[0], shipped.ansi[0]);
  assert.equal(t.colors.accent_foreground, shipped.colors.accent_foreground);
});

test("resolveTheme: file wins, builtin fills in, unknown name errors", () => {
  const file = JSON.stringify({ vars: { bg: "#010203" } });
  assert.deepEqual(resolveTheme("dark", [null, file], BUILTIN), { pi: { vars: { bg: "#010203" } } });
  assert.deepEqual(resolveTheme("dark", [null, null], BUILTIN), { pi: BUILTIN.dark, builtin: true });
  assert.deepEqual(resolveTheme("nope", [null], BUILTIN), { error: "theme file not found" });
  assert.deepEqual(resolveTheme("dark", ["{nope"], BUILTIN), { error: "theme file is invalid JSON" });
  assert.deepEqual(resolveTheme("toString", [null], BUILTIN), { error: "theme file not found" });
});

test("BASE still equals the shipped file", () => {
  assert.deepEqual(shipped, BASE);
});
