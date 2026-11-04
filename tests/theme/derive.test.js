import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { derive, BASE } from "../../mods/gentle-theme/derive.js";

const load = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), "utf8"));
const shipped = load("../../themes/gentle-shell.json");
const sexy = load("./fixtures/Gentleman-Sexy.json");
const HEX = /^#[0-9a-f]{6}$/;
const NAMES = new Set([
  "background", "surface", "canvas", "chrome", "popover", "raised", "hover", "selected", "border", "input",
  "foreground", "muted", "dim", "accent", "accent_foreground", "solid", "solid_foreground", "selection",
  "working", "blocked", "done", "idle", "unknown", ...Array.from({ length: 16 }, (_, i) => `ansi${i}`),
]);

function assertComplete(t) {
  assert.equal(t.ansi.length, 16);
  for (const c of [t.background, t.foreground, t.selection, t.cursor, ...t.ansi, ...Object.values(t.colors)]) {
    assert.match(c, HEX);
  }
  for (const k of Object.keys(t.colors)) assert.ok(NAMES.has(k), `unknown color name ${k}`);
}

test("shipped theme file is valid and equals the embedded BASE", () => {
  assertComplete(shipped);
  assert.deepEqual(shipped, BASE);
});

test("derives the Gentleman-Sexy fixture", () => {
  const t = derive(sexy, shipped);
  assertComplete(t);
  assert.equal(t.background, "#060407");
  assert.equal(t.foreground, "#f6eff3");
  assert.equal(t.selection, "#28121e");
  assert.equal(t.cursor, "#f43888");
  assert.equal(t.ansi[1], "#ff718f"); // error
  assert.equal(t.ansi[3], "#f2b86d"); // warning
  assert.equal(t.ansi[2], "#d2cbd0"); // success -> pearl, resolved through vars
  assert.equal(t.ansi[5], "#f43888"); // accent
  assert.equal(t.ansi[4], shipped.ansi[4]); // no info: base
  assert.equal(t.colors.chrome, "#100a0f");
  assert.equal(t.colors.border, "#563040");
  assert.equal(t.colors.accent, "#f43888");
  assert.equal(t.colors.blocked, "#ff718f");
});

test("missing vars fall back to base", () => {
  const t = derive({ vars: { text: "#ffffff" }, colors: {} }, shipped);
  assertComplete(t);
  assert.equal(t.foreground, "#ffffff");
  assert.equal(t.background, shipped.background);
  assert.deepEqual(t.ansi.slice(0, 15), shipped.ansi.slice(0, 15));
  assert.equal(t.ansi[15], "#ffffff");
  assert.equal(t.colors.chrome, shipped.colors.chrome);
});

test("a colors entry resolves a var name, a hex, and ignores junk", () => {
  const t = derive({ vars: { rosy: "#aabbcc" }, colors: { accent: "rosy", error: "#112233", warning: "nope" } }, shipped);
  assert.equal(t.cursor, "#aabbcc");
  assert.equal(t.ansi[1], "#112233");
  assert.equal(t.ansi[3], shipped.ansi[3]);
});

test("invalid input returns the base unchanged", () => {
  for (const bad of [null, undefined, 42, "x", [], {}, { vars: 1, colors: 2 }]) {
    assert.deepEqual(derive(bad, shipped), shipped);
  }
});

test("non-hex output is rejected per field", () => {
  const t = derive({ vars: { bg: "red", text: "#12345" }, colors: {} }, shipped);
  assert.equal(t.background, shipped.background);
  assert.equal(t.foreground, shipped.foreground);
});

test("derive does not mutate base", () => {
  const copy = structuredClone(shipped);
  derive(sexy, shipped);
  assert.deepEqual(shipped, copy);
});
