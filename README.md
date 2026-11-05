# Gentle Herdr

A [herdr](https://herdr.dev) app layout for the [Gentle Shell](https://gentlemanprogramming.com/gentle-shell/) community. It keeps herdr's own window and wears the Gentleman Programming palette. A small mod keeps herdr's colors in step with the theme you choose in Gentle Shell.

Status: work in progress. Tested on herdr-app 0.1.12 on Windows: the layout loads, the six mods pass `herdr-app check`, and switching the Gentle Shell theme (including `light` and `dark`) is reflected in herdr within about a second.

Not yet tested: macOS and Linux, and remote machines. The Files panel and the editor tab (`gentle-files`, `gentle-editor`) have only been exercised on a local Windows machine; files on a remote machine are meant to open view-only but that path has not been tried.

## What is inside

| Path | What it is |
|---|---|
| `layouts/gentle-herdr.json` | The layout: herdr's expanded-sidebar structure plus a theme row |
| `layouts/gentle-herdr.svg` | Preview shown in herdr's Settings |
| `themes/gentle-shell.json` | The default palette, rewritten by the mod |
| `mods/gentle-theme/` | Syncs the active Gentle Shell theme (custom, built-in `dark`/`light`, `system`) into `themes/gentle-shell.json`; also holds the flower icon |
| `mods/gentle-chrome/` | Copy of herdr's `workspace-chrome` with the "Gentle Herdr" brand row |
| `mods/gentle-tabs/` | Copy of herdr's `tabs` with a right-panel toggle before `+` |
| `mods/gentle-files/` | Copy of herdr's `files` with file-type icons; a file opens in its own tab |
| `mods/gentle-changes/` | Copy of herdr's `changes` that keeps its folder when an editor tab takes focus |
| `mods/gentle-editor/` | The tab a file opens in: View and Edit modes, Save with a stale-write guard |
| `programs.json` | Gives the Gentle Shell agent a flower icon; merge it into your own `programs.json` |
| `RECIPE.md` | The brief herdr's gallery expects: what it looks like and how it is built |

## Requirements

- **herdr app** (`herdr-app`), installed.
- **Gentle Shell**, installed from the web installer (the packaged version) or as the Pi extension. The theme sync reads its settings, so without it the layout still loads but the theme row shows `waiting` and herdr keeps the default Gentle palette.

## Install

Ask your herdr agent

```
Read ~/.config/herdr-app/AGENTS.md, then add this layout: https://github.com/Mayloparra24/gentle-herdr
```

The agent copies `layouts/gentle-herdr.json` to `~/.config/herdr-app/layouts/`, the folders in `mods/` to `mods/` and `themes/gentle-shell.json` to `themes/`, merges `programs.json` into yours, checks the mods and switches the layout. Your own layout stays; `ctrl-shift-l` switches back.

The `gentle-theme` mod reads `~/.gentle-shell/agent/settings.json` (or `~/.pi/agent/settings.json` when you use the Pi extension) and the Pi theme file, and writes `themes/gentle-shell.json`. It runs no programs and uses no network.

## Develop

```sh
npm test
```

Runs the theme derivation, layout structure, programs and editor key tests with `node --test`.

## License

Apache-2.0, see `LICENSE`. `mods/gentle-chrome/` and `mods/gentle-tabs/` are modified copies of herdr mods (also Apache-2.0); see `NOTICE`. Security notes: `SECURITY.md`.

