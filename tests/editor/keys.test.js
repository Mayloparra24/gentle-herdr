import test from 'node:test';
import assert from 'node:assert';
import { isSaveKey, saveHint } from '../../mods/gentle-editor/keys.js';

const key = (k, mods = {}) => ({ key: k, modifiers: { shift: false, control: false, alt: false, platform: false, function: false, ...mods } });

test('Ctrl+S saves on Windows and Linux', () => {
  assert.ok(isSaveKey(key('s', { control: true }), 'windows'));
  assert.ok(isSaveKey(key('s', { control: true }), 'linux'));
});

test('Command+S saves on macOS', () => {
  assert.ok(isSaveKey(key('s', { platform: true }), 'macos'));
});

test('the Windows key plus S is not a save outside macOS', () => {
  assert.ok(!isSaveKey(key('s', { platform: true }), 'windows'));
  assert.ok(!isSaveKey(key('s', { platform: true }), 'linux'));
});

test('Ctrl+S is not a save on macOS', () => {
  assert.ok(!isSaveKey(key('s', { control: true }), 'macos'));
});

test('other chords do not save', () => {
  assert.ok(!isSaveKey(key('s'), 'windows'));
  assert.ok(!isSaveKey(key('a', { control: true }), 'windows'));
  assert.ok(!isSaveKey(key('s', { control: true, shift: true }), 'windows'));
  assert.ok(!isSaveKey(key('s', { control: true, alt: true }), 'windows'));
});

test('the hint matches the platform', () => {
  assert.strictEqual(saveHint('macos'), '\u2318 S');
  assert.strictEqual(saveHint('windows'), 'Ctrl S');
  assert.strictEqual(saveHint('linux'), 'Ctrl S');
});
