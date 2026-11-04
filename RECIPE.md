# Gentle Herdr

The herdr app window, unchanged in structure, in the colors of Gentle Shell. It is herdr's own expanded-sidebar layout with a plum palette and a pink accent, and a small row in the sidebar that keeps herdr's colors in step with the theme you pick in Gentle Shell.

![Gentle Herdr](preview.png)

## What you see

The same window as herdr's default layout, with no system title bar:

1. **The sidebar**, 268px, `chrome` color: the brand row, then Spaces and Agents lists, then a 30px **theme row**, then Settings and Add machine.
2. **The theme row**, 30px: a pink `✿`, "Theme", the active Gentle Shell theme name, and a state on the right: `synced` (done color), `waiting` or `error: <reason>`.
3. **The tab bar**, 42px, over the work area.
4. **The pane**, one rounded terminal frame (radius 10) with a pink focus border (`accent`).
5. **The right panel**, hidden until opened: Files and Changes, 368px.
6. **The status bar**, 28px, after the sidebar.

Colors come from the `gentle-shell` theme. Shipped values: base `#1a1218`, terminal `#140a12`, rail `#100a0e`, surfaces `#20161e`, `#241822`, `#342230`, text `#f6eff3`, muted `#a78e9b`, accent `#f095c8`, done `#b4e7c7`, blocked `#ff718f`.

## How it behaves

- Every panel is a shipped herdr mod (`workspace-chrome`, `spaces`, `agents`, `tabs`, `pane`, `files`, `changes`, `workspace-status`), so a mod the person replaces keeps working here.
- The `gentle-theme` mod reads `theme` from `~/.gentle-shell/agent/settings.json` every 3 seconds, finds that Pi theme file, derives a herdr theme and rewrites `themes/gentle-shell.json` only when the result changed.
- Agent statuses (working, blocked, done, idle) use the theme's `working`, `blocked`, `done` and `idle` colors.
- Missing or invalid files never crash the mod; the theme row shows `waiting` or `error` instead.

## Built from

- **The layout** (`layouts/gentle-herdr.json`): the node tree of herdr's `main` layout, byte for byte, plus root `theme: "gentle-shell"`, root `preview: "layouts/gentle-herdr.svg"` and one added block `gentle-theme-status` (30px, mod `gentle-theme`) between `sidebar-lists` and `sidebar-footer`. No color is written as hex in the layout.
- **The theme** (`themes/gentle-shell.json`): `background`, `foreground`, `selection`, `cursor`, 16 `ansi` colors and `colors` overrides by herdr color name. It is the fallback and is rewritten by the mod.
- **One mod** (`mods/gentle-theme/`): `mod.json` is `{ "place": "none" }`. `derive.js` is a pure function `derive(piTheme, base)` mapping Pi theme variables to herdr colors (table in its header comment). `main.js` uses `home()`, `appHome()`, `readTextFile()`, `writeTextFile()`, `theme()` and a 3 second `cx.timer.every`.
- **Shipped parts:** all the other mods are herdr's.

## Watch out

- The mod **reads files outside its folder** (`~/.gentle-shell/agent/settings.json`, and the Pi theme file under `~/.gentle-shell/agent/themes`, `~/.pi/agent/themes` or `gentle-pi/themes`) and **writes `themes/gentle-shell.json`** in the herdr home. It runs no programs and uses no network.
- Confirmed on herdr-app 0.1.12 (Windows): the layout loads with no errors, `herdr-app check mods/gentle-theme` passes, `home()` resolves the Gentle Shell and Pi paths, and herdr applies a rewritten `themes/gentle-shell.json` live (an edited accent was shown within a second and reverted by the mod within three).
- The derived colors follow the Gentle Shell theme, so they differ from the shipped palette. With `Gentleman-Sexy` the accent is `#F43888`.
- `ansi0`, `accent_foreground`, `solid_foreground` and `unknown` always keep the shipped values.
- `themes/gentle-shell.json` is overwritten by the mod; edits made by hand are lost.
- `preview.png` is not included yet; it has to be captured with `herdr-app shot` from a running window.

## Done when

- `npm test` passes (`node --test tests/theme/ tests/layout/`).
- `herdr-app check mods/gentle-theme` passes.
- After `layout.switch {name: "gentle-herdr"}`, the window shows the plum palette and the theme row says `synced`.
- Changing the theme in Gentle Shell changes the colors of herdr within a few seconds.
- `ctrl-shift-l` goes back to the person's own layout.
