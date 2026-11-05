import test from 'node:test';
import assert from 'node:assert';
import { isNarrow } from '../../mods/gentle-theme/rail.js';

const tree = (px) => ({ id: 'root', children: [{ id: 'sidebar', size: px === undefined ? undefined : { px }, children: [] }] });

test('a sidebar narrower than 160px is the rail', () => {
  assert.equal(isNarrow(tree(44)), true);
  assert.equal(isNarrow(tree(159)), true);
});

test('a full-width sidebar is not the rail', () => {
  assert.equal(isNarrow(tree(268)), false);
  assert.equal(isNarrow(tree(160)), false);
});

test('a sidebar without a pixel size, or a missing sidebar, is not the rail', () => {
  assert.equal(isNarrow(tree(undefined)), false);
  assert.equal(isNarrow({ id: 'root', children: [] }), false);
  assert.equal(isNarrow(null), false);
});

test('the sidebar is found when nested deeper in the tree', () => {
  const nested = { id: 'root', children: [{ id: 'a', children: [{ id: 'sidebar', size: { px: 44 } }] }] };
  assert.equal(isNarrow(nested), true);
});
