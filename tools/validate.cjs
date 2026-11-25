'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const manifest = read('manifest.json');
const types = new Set(['lesart','deutung','zusatz','auslassung','harmonisierung','technik','doublette','umstellung','zahl','name','grfehler','syrfehler']);
for (const [part, dir, token] of [['lxx', 'lxx', 'gr'], ['peshitta', 'peshitta/readings', 'sy'], ['alignment', 'peshitta/alignment']]) {
  const stats = part === 'alignment' ? { books: 0, verses: 0, links: 0, word_pairs: 0 } : { books: 0, verses: 0, readings: 0, annotations: 0 };
  for (const file of fs.readdirSync(path.join(root, dir)).filter(f => f.endsWith('.json'))) {
    const d = read(dir + '/' + file); stats.books++;
    for (const [ref, v] of Object.entries(d.verses)) {
      assert.match(ref, /^\d+:\d+$/); stats.verses++;
      const positions = (list, max) => assert(Array.isArray(list) && list.every(n => Number.isInteger(n) && n >= 1 && n <= max), `${dir}/${file} ${ref}: invalid position`);
      if (part === 'alignment') {
        assert.equal(v.syr.length, v.links.length);
        assert.equal(v.syr.length, v.syr_ids.length);
        assert.equal(v.syr.length, v.syr_refs.length);
        assert.equal(typeof v.note, 'string');
        for (const links of v.links) { positions(links, v.mt.length); stats.links += !!links.length; stats.word_pairs += links.length; }
      } else {
        for (const r of v.readings) {
          stats.readings++;
          positions(r.he, v.mt.length); positions(r[token], (v.lxx || v.syr).length);
          assert(types.has(r.type)); assert.equal(typeof r.sure, 'boolean');
          assert(r.note && r.note_en);
          for (const tag of r.traditions || []) {
            stats.annotations++;
            assert(['halacha','aggada','targum','tiqqun'].includes(tag.category));
            assert(tag.author && tag.source);
            if (tag.check === 'source-checked') assert(tag.de && tag.en);
            if (tag.url) assert.match(tag.url, /^https:\/\//);
          }
        }
        if (part === 'lxx') {
          assert.equal(v.lxx.length, v.lxx_mt.length);
          v.lxx_mt.forEach(list => positions(list, v.mt.length));
        }
      }
    }
  }
  assert.deepEqual(stats, manifest.stats[part]);
  console.log(`${part}: ${JSON.stringify(stats)} — OK`);
}
