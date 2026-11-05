# Security

## What this project touches

The `gentle-theme` mod reads files outside its own folder and writes one file:

- Reads `~/.gentle-shell/agent/settings.json` (or `~/.pi/agent/settings.json` if the first does not exist) and the Pi theme file named in it
  (under `~/.gentle-shell/agent/themes`, `~/.pi/agent/themes` or `gentle-pi/themes`).
- Writes `themes/gentle-shell.json` in the herdr home.
- Runs no programs and uses no network.

Review the mods before installing them; that is the whole footprint.

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's private reporting:
https://github.com/Mayloparra24/gentle-herdr/security/advisories/new
