import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const programsPath = path.join(root, 'programs.json');

test('programs.json maps the gentle-shell agent to the flower icon', () => {
  const { programs } = JSON.parse(fs.readFileSync(programsPath, 'utf8'));
  const entry = programs['gentle-shell'];
  assert.ok(entry, 'gentle-shell entry exists');
  assert.equal(entry.name, 'Gentle Shell');
  assert.equal(entry.tint, true);
  assert.match(entry.color, /^#[0-9a-f]{6}$/i);
  assert.match(entry.tile, /^#[0-9a-f]{6}$/i);
  assert.equal(entry.icon, 'mods/gentle-theme/flower.svg');
});

test('the flower icon exists, is a tintable single-color glyph and has no external refs', () => {
  const svg = fs.readFileSync(path.join(root, 'mods', 'gentle-theme', 'flower.svg'), 'utf8');
  assert.match(svg, /<svg[^>]*viewBox="0 0 24 24"/);
  assert.match(svg, /stroke="currentColor"/);
  assert.doesNotMatch(svg.replace(/xmlns="[^"]*"/, ''), /https?:|href=|<image/);
});
