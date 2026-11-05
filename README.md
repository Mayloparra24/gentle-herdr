# Gentle Herdr

A [herdr](https://herdr.dev) app layout for the [Gentle Shell](https://gentlemanprogramming.com/gentle-shell/) community. It keeps herdr's own window and wears the Gentleman Programming palette. A small mod keeps herdr's colors in step with the theme you choose in Gentle Shell.

Status: work in progress. Tested on herdr-app 0.1.12 on Windows: the layout loads, the three mods pass `herdr-app check`, and switching the Gentle Shell theme (including `light` and `dark`) is reflected in herdr within about a second.

## What is inside

| Path | What it is |
|---|---|
| `layouts/gentle-herdr.json` | The layout: herdr's expanded-sidebar structure plus a theme row |
| `layouts/gentle-herdr.svg` | Preview shown in herdr's Settings |
| `themes/gentle-shell.json` | The default palette, rewritten by the mod |
| `mods/gentle-theme/` | Syncs the active Gentle Shell theme (custom, built-in `dark`/`light`, `system`) into `themes/gentle-shell.json`; also holds the flower icon |
| `mods/gentle-chrome/` | Copy of herdr's `workspace-chrome` with the "Gentle Herdr" brand row |
| `mods/gentle-tabs/` | Copy of herdr's `tabs` with a right-panel toggle before `+` |
| `programs.json` | Gives the Gentle Shell agent a flower icon; merge it into your own `programs.json` |
| `RECIPE.md` | The brief herdr's gallery expects: what it looks like and how it is built |

## Install

Planned: ask your herdr agent

```
Read ~/.config/herdr-app/AGENTS.md, then add this layout: <repository URL>
```

The agent copies `layouts/gentle-herdr.json` to `~/.config/herdr-app/layouts/`, the three folders in `mods/` to `mods/` and `themes/gentle-shell.json` to `themes/`, merges `programs.json` into yours, checks the mods and switches the layout. Your own layout stays; `ctrl-shift-l` switches back.

The `gentle-theme` mod reads `~/.gentle-shell/agent/settings.json` and the Pi theme file, and writes `themes/gentle-shell.json`. It runs no programs and uses no network.

## Develop

```sh
npm test
```

Runs the theme derivation tests and the layout structure tests with `node --test`.

## Publishing

Herdr's gallery lists public repositories with the topic `herdr-layout`. `preview.png` (captured with `herdr-app shot`) is in the repository root; add the topic when publishing.
