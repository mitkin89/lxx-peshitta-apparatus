#!/usr/bin/env node
'use strict';
// Run only against a trusted Safran checkout: its generated JavaScript is evaluated.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const source = path.resolve(process.argv[2] || '../Safran');
const root = path.resolve(__dirname, '..');
const window = {};
const context = vm.createContext({ window });
const inputs = new Map();
function read(name) {
  const text = fs.readFileSync(path.join(source, name), 'utf8');
  inputs.set(name, crypto.createHash('sha256').update(text).digest('hex'));
  return text;
}
function load(name) { vm.runInContext(read(name), context, { filename: name, timeout: 10000 }); }
function json(name) { return JSON.parse(read(name)); }
function write(name, data, compact = false) {
  const dest = path.join(root, name);
  if (fs.existsSync(dest) && JSON.stringify(JSON.parse(fs.readFileSync(dest, 'utf8'))) === JSON.stringify(data)) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(data, null, compact ? undefined : 1) + '\n');
}
function files(dir, suffix) { return fs.readdirSync(path.join(source, dir)).filter(f => f.endsWith(suffix)).sort(); }
const english = json('tools/textcrit-en/notes-en.json');
load('textcrit-traditions-data.js');
load('library-textcrit-traditions.js');
load('peshitta-alignment-data.js');
for (const file of files('peshitta-alignment', '.js')) load('peshitta-alignment/' + file);
const stats = { lxx: { books: 0, verses: 0, readings: 0, annotations: 0 }, peshitta: { books: 0, verses: 0, readings: 0, annotations: 0 }, alignment: { books: 0, verses: 0, links: 0, word_pairs: 0 } };
const pending = [];
function reading(r, witness, edition, ref, runtime) {
  assert(english[r.note], `Missing English note: ${edition} ${ref}: ${r.note}`);
  const out = { ...r, note_en: english[r.note] };
  const tags = window.TextCritTraditions.tags(witness, edition, ref, runtime);
  if (tags.length) {
    out.traditions = JSON.parse(JSON.stringify(tags));
    stats[witness === 'LXX' ? 'lxx' : 'peshitta'].annotations += tags.length;
  }
  assert.equal(typeof out.sure, 'boolean');
  return out;
}
for (const file of files('tools/lxx/readings', '.json')) {
  const d = json('tools/lxx/readings/' + file);
  load('lxx-readings/' + d.code + '.js');
  const verses = {};
  for (const [ref, v] of Object.entries(d.verses)) {
    if (!v.r.length) continue;
    const runtime = window.LXX_READINGS[d.code].verses[ref].r;
    assert.equal(runtime.length, v.r.length);
    const readings = v.r.map((r, i) => {
      assert.equal(runtime[i].note, r.note);
      assert(r.he.every(n => n >= 1 && n <= v.H.length));
      assert(r.gr.every(n => n >= 1 && n <= v.G.length));
      return reading(r, 'LXX', d.code, ref, runtime[i]);
    });
    verses[ref] = { mt: v.H, lxx: v.G, lxx_mt: v.Gmt, readings };
    stats.lxx.readings += readings.length;
  }
  stats.lxx.books++; stats.lxx.verses += Object.keys(verses).length;
  pending.push(['lxx/' + file, { code: d.code, book: d.book, verses }]);
}
for (const file of files('tools/peshitta/readings', '.json')) {
  const d = json('tools/peshitta/readings/' + file);
  load('peshitta-readings/' + file.replace(/\.json$/, '.js'));
  const a = window.PESHITTA_ALIGNMENT_DATA.books[d.book] || window.PESHITTA_ALIGNMENT_BOOKS[d.book];
  assert(a, d.book);
  const verses = {}, aligned = {};
  for (const [ref, v] of Object.entries(a.verses)) {
    assert.equal(v.sy.length, v.links.length);
    assert.equal(v.sy.length, v.ids.length);
    assert.equal(v.sy.length, v.refs.length);
    assert(v.links.every(list => list.every(n => n >= 1 && n <= v.he.length)));
    aligned[ref] = { mt: v.he, syr: v.sy, links: v.links, syr_ids: v.ids, syr_refs: v.refs, note: v.review.note, proposal: v.origin };
    stats.alignment.links += v.links.filter(list => list.length).length;
    stats.alignment.word_pairs += v.links.reduce((n, list) => n + list.length, 0);
  }
  for (const [ref, v] of Object.entries(d.verses)) {
    if (!v.readings.length) continue;
    assert.deepEqual(v.he, JSON.parse(JSON.stringify(a.verses[ref].he)));
    assert.deepEqual(v.sy, JSON.parse(JSON.stringify(a.verses[ref].sy)));
    const runtime = window.PESHITTA_READINGS[d.book][ref];
    assert.equal(runtime.length, v.readings.length);
    const readings = v.readings.map((r, i) => {
      assert.equal(runtime[i].note, r.note);
      assert(r.he.every(n => n >= 1 && n <= v.he.length));
      assert(r.sy.every(n => n >= 1 && n <= v.sy.length));
      return reading(r, 'Syr', d.book, ref, runtime[i]);
    });
    verses[ref] = { mt: v.he, syr: v.sy, readings };
    stats.peshitta.readings += readings.length;
  }
  stats.peshitta.books++; stats.peshitta.verses += Object.keys(verses).length;
  stats.alignment.books++; stats.alignment.verses += Object.keys(aligned).length;
  pending.push(['peshitta/readings/' + file, { book: d.book, verses }]);
  pending.push(['peshitta/alignment/' + file, { book: d.book, source: a.source, verses: aligned }, true]);
}
const expected = window.TEXTCRIT_TRADITIONS.filter(([k]) => ['LXX', 'Syr'].includes(k[0])).length;
assert.equal(stats.lxx.annotations + stats.peshitta.annotations, expected, 'All LXX/Peshitta annotations must resolve exactly once');
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim();
const dirty = execFileSync('git', ['diff', 'HEAD', '--name-only', '--', ...inputs.keys()], { cwd: source, encoding: 'utf8' }).trim();
assert.equal(dirty, '', 'Commit source changes before exporting');
for (const args of pending) write(...args);
write('manifest.json', { source: 'https://github.com/mitkin89/Safran', commit, stats, sha256: Object.fromEntries([...inputs].sort(([a], [b]) => a.localeCompare(b, 'en'))) });
console.log(JSON.stringify(stats, null, 2));
