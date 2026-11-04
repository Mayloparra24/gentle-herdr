# Gentle Herdr

A [herdr](https://herdr.dev) app layout for the [Gentle Shell](https://gentlemanprogramming.com/gentle-shell/) community. It keeps herdr's own window and wears the Gentleman Programming palette. A small mod keeps herdr's colors in step with the theme you choose in Gentle Shell.

Status: work in progress. The layout and mod have structural tests but have not been loaded by herdr yet.

## What is inside

| Path | What it is |
|---|---|
| `layouts/gentle-herdr.json` | The layout: herdr's expanded-sidebar structure plus a theme row |
| `layouts/gentle-herdr.svg` | Preview shown in herdr's Settings |
| `themes/gentle-shell.json` | The default palette, rewritten by the mod |
| `mods/gentle-theme/` | Syncs the active Gentle Shell theme into `themes/gentle-shell.json` |
| `RECIPE.md` | The brief herdr's gallery expects: what it looks like and how it is built |

## Install

Planned: ask your herdr agent

```
Read ~/.config/herdr-app/AGENTS.md, then add this layout: <repository URL>
```

The agent copies `layouts/gentle-herdr.json` to `~/.config/herdr-app/layouts/`, `mods/gentle-theme/` to `mods/` and `themes/gentle-shell.json` to `themes/`, checks the mod and switches the layout. Your own layout stays; `ctrl-shift-l` switches back.

The `gentle-theme` mod reads `~/.gentle-shell/agent/settings.json` and the Pi theme file, and writes `themes/gentle-shell.json`. It runs no programs and uses no network.

## Develop

```sh
npm test
```

Runs the theme derivation tests and the layout structure tests with `node --test`.

## Publishing

Not done yet. Herdr's gallery lists public repositories with the topic `herdr-layout`; add `preview.png` (captured with `herdr-app shot`) before publishing.
