# gentle-herdr

Herdr app layout for the Gentle Shell community (Expanded Sidebar design) plus a `gentle-theme` mod that syncs the Gentle Shell theme into herdr. Publishable to the herdr gallery and Gentle Hub.

## Specs

- S1: Layout "Expanded Sidebar": the structure of herdr's own expanded sidebar (header with search and panel toggle, Spaces, Agents, Settings and Add machine), tab bar on top with the panel toggle at the left of the "+", one rounded pane, Files/Changes right panel, status bar after the sidebar. "no perder la escencia de herdr".
- S2: Palette of gentlemanprogramming.com: base `#1a1218`, surfaces `#20161e` `#241822` `#342230`, text `#f6eff3`, muted `#a78e9b`, accent `#f095c8`, rose `#ff76c3`, pink `#ffb1dd`, green `#b4e7c7`, red `#ff718f`, peach `#f2b86d`.
- S3: Mod `gentle-theme`: "cuando yo cambie el tema en gentle-shell igual herdr app se sincronicen los colores".
- S4: Panels are herdr's own mods (spaces, agents, files, changes), reused as-is: "se debe de adaptar si el usuario agrega un mod".
- S5: Publishable as a herdr layout: `layouts/<name>.json`, its `mods/`, `RECIPE.md`, `preview.png`; GitHub topic `herdr-layout` (topics are set later, not now).

- S6 (contract between T1 and T2): theme file `themes/gentle-shell.json` (name `gentle-shell`, ships the website palette from S2 and is rewritten by the mod); mod folder `mods/gentle-theme/` (`mod.json` `{"place":"none"}`); layout block id `gentle-theme-status`, a 30px block inside the sidebar between `sidebar-lists` and `sidebar-footer`, `content: {mod: "gentle-theme"}`, which shows the active Gentle Shell theme and sync state; layout root `theme: "gentle-shell"`.
- S7 (safety): nothing may write outside this repo during implementation (no `~/.config/herdr-app`, no `herdr-app check`); installing and checking in the herdr home is a later step that needs the user's consent.

## Tasks

- T1 (S2, S3, S6, S7): themes/gentle-shell.json + mod gentle-theme (pure derive logic with node tests). Route: writer 1. Commit: 4cdadef [x]
- T2 (S1, S2, S4, S6, S7): layouts/gentle-herdr.json from herdr `main` plus structure test and SVG preview. Route: writer 2. Commit: e1dac5e [x] (test converted to ESM in the next commit)
- T3 (S5): RECIPE.md, README, preview, `herdr-app check`. Route: inline. Commit: docs commit after e1dac5e [x] (install and herdr check pending, needs consent)

## Log

- L1: "Por ahora me gusta el mod de gentle-theme, además del layout Expanded Sidebar para implementarlo de una vez en este repositorio, luego vamos incluyendo más mods"
- L2: "ah bueno lo de design/ y .agents me lo pones en el .gitignore porfa" and "skill-lock.json agregalo al .gitignore": done in .gitignore.
- L3: "la idea es si yo desde gentle-shell cambio el tema, que herdr app o gentle-herdr sincronice los colores": implemented by the gentle-theme mod; live reload by herdr is unverified.
- L4: "autorizo" (install into ~/.config/herdr-app, run herdr-app check and switch layout). Result: check passed, layout gentle-herdr active with no errors, theme row shows "Gentleman-Sexy synced", a manual accent edit was applied live and reverted by the mod. Not exercised: changing the theme inside Gentle Shell (would edit the user settings).
