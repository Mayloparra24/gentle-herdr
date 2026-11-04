// Keeps herdr's `gentle-shell` theme in step with the active Gentle Shell (Pi) theme, and shows
// the sync state in a 30px row. Every 3 s it reads the theme name from settings.json, finds the
// Pi theme file, derives the herdr theme (derive.js) and rewrites themes/gentle-shell.json
// only when the result changed.
import { View, div } from "gpui-kit";
import { h_flex } from "gpui-base";
import { home, appHome, readTextFile, writeTextFile, theme } from "herdr";
import { derive, BASE } from "./derive.js";

const EVERY_MS = 3000;
const OUT = "gentle-shell";
const SAFE_NAME = /^[\w .-]+$/;

const parse = (text) => {
  try { return JSON.parse(text); } catch { return undefined; }
};

export default class GentleTheme extends View {
  init(_props, cx) {
    this.name = null;
    this.state = "waiting";
    this.reason = "";
    this.busy = false;
    this.check(cx);
    cx.timer.every(EVERY_MS, (cx) => this.check(cx));
  }

  set(state, reason, cx) {
    if (state !== this.state || reason !== this.reason) {
      this.state = state;
      this.reason = reason;
      cx.notify();
    }
  }

  async sync() {
    const h = home().replace(/[\/]+$/, "");
    const settings = parse(await readTextFile(`${h}/.gentle-shell/agent/settings.json`));
    if (settings === undefined) return { error: "settings.json missing or invalid" };
    const name = settings?.theme;
    if (typeof name !== "string" || !SAFE_NAME.test(name) || name.startsWith(".")) return { name: null, wait: "no theme set" };

    const files = [
      `${h}/.gentle-shell/agent/themes/${name}.json`,
      `${h}/.pi/agent/themes/${name}.json`,
      `${h}/.pi/agent/npm/node_modules/gentle-pi/themes/${name}.json`,
    ];
    let pi;
    for (const f of files) {
      const text = await readTextFile(f);
      if (text === null) continue;
      pi = parse(text);
      if (pi === undefined) return { name, error: "theme file is invalid JSON" };
      break;
    }
    if (pi === undefined) return { name, error: "theme file not found" };

    const out = `${appHome().replace(/[\/]+$/, "")}/themes/${OUT}.json`;
    const next = JSON.stringify(derive(pi, BASE), null, 2) + "\n";
    const current = await readTextFile(out);
    if (current !== next) await writeTextFile(out, next, current);
    return { name };
  }

  async check(cx) {
    if (this.busy) return;
    this.busy = true;
    try {
      const r = await this.sync();
      if (r.name !== undefined && r.name !== this.name) { this.name = r.name; cx.notify(); }
      if (r.error) this.set("error", r.error, cx);
      else if (r.wait) this.set("waiting", r.wait, cx);
      else this.set("synced", "", cx);
    } catch (e) {
      this.set("error", String(e?.message ?? e).slice(0, 60), cx);
    } finally {
      this.busy = false;
    }
  }

  render() {
    const t = theme();
    const color = { synced: t.done, waiting: t.muted, error: t.blocked }[this.state];
    const label = this.state === "error" || (this.state === "waiting" && this.reason)
      ? `${this.state}: ${this.reason}`
      : this.state;
    return h_flex().size_full().h(30).px(14).gap(8).items_center().bg(t.chrome).text_size(11.8)
      .child(div().flex_none().text_color(t.accent).child("✿"))
      .child(div().flex_none().text_color(t.muted).child("Theme"))
      .child(div().flex_1().truncate().text_color(t.foreground).child(this.name ?? "—"))
      .child(div().flex_none().text_color(color).child(label));
  }
}
