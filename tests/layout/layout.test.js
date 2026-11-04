import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.join(__dirname, '..', '..');
const layoutPath = path.join(root, 'layouts', 'gentle-herdr.json');
const svgPath = path.join(root, 'layouts', 'gentle-herdr.svg');

const SHIPPED_MODS = [
  'workspace-chrome', 'spaces', 'agents', 'tabs', 'pane', 'files', 'changes',
  'workspace-status', 'menu', 'prompt', 'confirm', 'help', 'toast', 'worktree',
  'picker', 'peek', 'machine-add', 'new-menu', 'terminals-bar', 'terminals-pane',
];

// Node ids/types copied from herdr's main layout (depth-first order).
const MAIN_NODES = [
  ['root', 'row'], ['sidebar', 'column'], ['brand', 'block'],
  ['sidebar-lists', 'column'], ['spaces', 'block'], ['agents', 'block'],
  ['sidebar-footer', 'block'], ['work', 'column'], ['tabs', 'block'],
  ['work-body', 'row'], ['main', 'block'], ['panel', 'column'],
  ['panel-body', 'stack'], ['files', 'block'], ['changes', 'block'],
  ['status', 'block'],
];

const load = () => JSON.parse(fs.readFileSync(layoutPath, 'utf8'));
const walk = (node, out = []) => {
  out.push(node);
  (node.children || []).forEach((c) => walk(c, out));
  return out;
};

test('layout parses', () => {
  assert.strictEqual(load().id, 'root');
});

test('node ids are unique', () => {
  const ids = walk(load()).map((n) => n.id);
  assert.strictEqual(new Set(ids).size, ids.length);
});

test('every content.mod is shipped or a gentle mod', () => {
  const mods = walk(load()).map((n) => n.content && n.content.mod).filter(Boolean);
  assert.ok(mods.length > 0);
  for (const m of mods) assert.ok([...SHIPPED_MODS, 'gentle-theme', 'gentle-chrome', 'gentle-tabs'].includes(m), m);
});

test('theme and preview are set', () => {
  const l = load();
  assert.strictEqual(l.theme, 'gentle-shell');
  assert.strictEqual(l.preview, 'layouts/gentle-herdr.svg');
});

test('gentle-theme-status sits between sidebar-lists and sidebar-footer', () => {
  const sidebar = walk(load()).find((n) => n.id === 'sidebar');
  const ids = sidebar.children.map((c) => c.id);
  assert.deepStrictEqual(ids, ['brand', 'sidebar-lists', 'gentle-theme-status', 'sidebar-footer']);
  const block = sidebar.children[2];
  assert.strictEqual(block.type, 'block');
  assert.deepStrictEqual(block.size, { px: 30 });
  assert.deepStrictEqual(block.content, { mod: 'gentle-theme' });
});

test('herdr main structure is preserved', () => {
  const nodes = walk(load())
    .filter((n) => n.id !== 'gentle-theme-status')
    .map((n) => [n.id, n.type]);
  assert.deepStrictEqual(nodes, MAIN_NODES);
});

test('pane keeps radius, gap and themed accent focus border', () => {
  const pane = walk(load()).find((n) => n.id === 'main').content.pane;
  assert.strictEqual(pane.radius, 10);
  assert.strictEqual(pane.gap, 8);
  assert.deepStrictEqual(pane.focus, { width: 1, color: 'accent' });
});

test('any color override uses names, not hex', () => {
  const text = fs.readFileSync(layoutPath, 'utf8');
  assert.ok(!/"#[0-9a-fA-F]{3,8}"/.test(text));
});

test('svg preview exists with no external refs', () => {
  const svg = fs.readFileSync(svgPath, 'utf8');
  assert.ok(svg.includes('<svg'));
  // The XML namespace declaration is not an external reference.
  const body = svg.replace(/xmlns="[^"]*"/, "");
  assert.ok(!/http|href/i.test(body));
});

const modText = (mod, file) => fs.readFileSync(path.join(root, 'mods', mod, file), 'utf8');
const modOf = (id) => walk(load()).find((n) => n.id === id).content.mod;

test('brand and sidebar-footer use gentle-chrome, tabs uses gentle-tabs', () => {
  assert.strictEqual(modOf('brand'), 'gentle-chrome');
  assert.strictEqual(modOf('sidebar-footer'), 'gentle-chrome');
  assert.strictEqual(modOf('tabs'), 'gentle-tabs');
});

test('cloned mod folders ship main.js and mod.json', () => {
  for (const m of ['gentle-chrome', 'gentle-tabs']) {
    for (const f of ['main.js', 'mod.json']) {
      assert.ok(fs.existsSync(path.join(root, 'mods', m, f)), `${m}/${f}`);
    }
  }
});

test('gentle-chrome shows the Gentle Herdr brand, not the herdr logo', () => {
  const js = modText('gentle-chrome', 'main.js');
  assert.ok(js.includes('Gentle Herdr'));
  assert.ok(!js.includes('frame/welcome/herdr.png'));
});

test('gentle-tabs has a right-panel toggle', () => {
  const js = modText('gentle-tabs', 'main.js');
  assert.ok(js.includes('layout.show'));
  assert.ok(js.includes('layout.hide'));
  assert.ok(js.includes('panel-right.svg'));
  assert.ok(fs.existsSync(path.join(root, 'mods', 'gentle-tabs', 'panel-right.svg')));
});

test('clones no longer reference their source mod asset path', () => {
  assert.ok(!modText('gentle-chrome', 'main.js').includes('mods/workspace-chrome/'));
  assert.ok(!modText('gentle-tabs', 'main.js').includes('mods/tabs/'));
});
