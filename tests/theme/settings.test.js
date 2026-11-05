import test from 'node:test';
import assert from 'node:assert';
import { readSettings } from '../../mods/gentle-theme/settings.js';

const GS = '/h/.gentle-shell/agent/settings.json';
const PI = '/h/.pi/agent/settings.json';
const reader = (files) => async (path) => (path in files ? files[path] : null);

test('the Gentle Shell settings win when both files exist', async () => {
  const read = reader({ [GS]: '{"theme":"dark"}', [PI]: '{"theme":"light"}' });
  assert.deepEqual(await readSettings('/h', read), { theme: 'dark' });
});

test('falls back to the Pi settings when Gentle Shell has none', async () => {
  const read = reader({ [PI]: '{"theme":"light"}' });
  assert.deepEqual(await readSettings('/h', read), { theme: 'light' });
});

test('an existing but invalid Gentle Shell file is an error, not a fallback', async () => {
  const read = reader({ [GS]: '{oops', [PI]: '{"theme":"light"}' });
  assert.equal(await readSettings('/h', read), undefined);
});

test('no settings file at all is undefined', async () => {
  assert.equal(await readSettings('/h', reader({})), undefined);
});
