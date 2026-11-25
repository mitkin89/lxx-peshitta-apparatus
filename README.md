# LXX and Peshitta against the Masoretic Text – a classified apparatus

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24465785.svg)](https://doi.org/10.5281/zenodo.24465785)

**English** · [Deutsch](README.de.md)

Where do the Septuagint and the Peshitta differ from the Masoretic Text, and why? This dataset records the differences verse by verse, classifies them and explains them in German and English:

| Part | Books | Verses | Entries |
| --- | ---: | ---: | ---: |
| **LXX readings** (`lxx/`) | 38 books in 40 versions (Judges A/B and Daniel OG/Theodotion separate; no Esther) | 9,441 | 13,414 |
| **Peshitta readings** (`peshitta/readings/`) | 39 books | 8,386 | 11,132 |
| **MT–Peshitta word alignment** (`peshitta/alignment/`) | 39 books | 23,206 | 291,325 links |

Every entry gives the MT words concerned, the Greek or Syriac words, a **type**, the **Hebrew Vorlage** inferred where one can be inferred, a one-sentence explanation in German and English, whether the interpretation is **certain** or a conjecture, and the **parallel passage** where the translator harmonised.

| Type | | LXX | Peshitta |
| --- | --- | ---: | ---: |
| `lesart` | different reading – other consonants in the Vorlage, or a misreading | 2,892 | 1,090 |
| `deutung` | different interpretation – same consonants, vocalised, derived or divided differently | 1,963 | 1,448 |
| `zusatz` | plus without an evident parallel | 1,508 | 1,153 |
| `auslassung` | omission – MT text without a counterpart | 2,679 | 1,539 |
| `harmonisierung` | harmonisation with a parallel passage | 1,324 | 1,001 |
| `technik` | translation technique, no different Vorlage | 1,456 | 3,460 |
| `doublette` | double translation | 535 | 137 |
| `umstellung` | transposition | 285 | 102 |
| `zahl` | different number or date | 165 | 105 |
| `name` | different form of a name | 593 | 948 |
| `grfehler` / `syrfehler` | copying error within the Greek / Syriac tradition | 14 | 149 |

Labels and descriptions of the types in German and English: `types.json`.

The data were made for the apparatus of the free desktop library [Safran](https://github.com/mitkin89/Safran), where they can be read next to the text and searched (for example: all places where LXX and Peshitta agree against the MT). The Hexapla readings with a different Vorlage are part of the dataset [field-hexapla](https://github.com/mitkin89/field-hexapla).

## Version 1.1.0

The working dataset was synchronized with Safran on **25 November 2026**.
Reading and alignment totals are unchanged. **45 editorial annotations** (11 LXX,
34 Peshitta) now accompany the relevant readings. They distinguish halakhic,
aggadic, Targum and *tiqqun soferim* comparisons and retain the named editor,
specific source and original verification status; bilingual explanations are
included where supplied.
These are supplementary interpretations, not additional textual variants;
a source comparison does not establish the certainty of a reconstructed Vorlage.
Hexapla annotations are outside this dataset.

`manifest.json` records the exact Safran commit, SHA-256 hashes of the export
inputs and corpus totals. The DOI badge above identifies the archived version 1.0.0. A new version DOI
will be added when the Zenodo archive for 1.1.0 is available.

To reproduce from a trusted, committed Safran checkout using Node.js 18 or later:

```sh
node tools/sync-safran.cjs /path/to/Safran
node tools/validate.cjs
```

The exporter preserves existing files when their content is unchanged and fails
if a translation, source anchor or editorial annotation cannot be resolved.

## Format

### `lxx/<code>.json`

```json
{"code": "Gen", "book": "Genesis", "verses": {"1:6": {
  "mt":  ["ויאמר", "אלהים", …],
  "lxx": ["καὶ εἶπεν", "ὁ θεός", …],
  "lxx_mt": [[1], [2], …, [], []],
  "readings": [{"he": [], "gr": [12, 13], "type": "umstellung", "vorlage": "ויהי כן",
                "note": "Die Vollzugsformel …", "note_en": "The execution formula …",
                "sure": true, "parallel": ""}]}}}
```

- `mt` – the consonantal Hebrew words of the CATSS alignment; `lxx` – the Greek word groups; `lxx_mt` – for each Greek group the MT words it renders (1-based; `[]` = plus).
- `he`, `gr` – the MT words and Greek groups an entry concerns (1-based).
- Only verses with at least one entry are included.
- Optional `readings[].traditions` contains editorial comparisons: `category`
  (`halacha`, `aggada`, `targum`, `tiqqun`), `author` and `source`.
  Optional `de` and `en` explain the comparison in German and English.
  Where supplied, `url`, `evidence`, `noteId` and `check` retain the source metadata.
  Only `check: "source-checked"` explicitly identifies a primary-text comparison;
  absence of that flag must not be interpreted as verification. Multiple tags may
  refer to one reading. The original reading notes and certainty flags are retained.

### `peshitta/readings/<Book>.json`

As above, with `mt` (pointed MT words, Westminster Leningrad Codex), `syr` (Syriac words) and `sy` in place of `gr`. Verse numbers follow the MT.

### `peshitta/alignment/<Book>.json`

For every verse: `mt`, `syr`, `links` (for each Syriac word the MT words it renders; `[]` = Syriac plus or uncertain), `syr_ids` (Text-Fabric word ids of the ETCBC Peshitta), `syr_refs` (Peshitta verse of each Syriac word), `note` (a short English note on pluses, minuses and divergences) and `proposal` (where the first proposal came from: `manual`, `onkelos-assisted`, or `patracosy` for 1,161 Genesis verses from [ETCBC/PaTraCoSy](https://github.com/ETCBC/PaTraCoSy)). Every verse was then reviewed word by word.

## Method and reliability

- The alignments come from CATSS (LXX) and from a word-by-word review of the Peshitta against the MT. On this basis, each verse was examined and classified with Claude (Anthropic, 2026). CATSS column b (Tov's inferred readings) was available for the LXX. Notes like “so also SMR/4Q…” were checked against the Samaritan Pentateuch and the Qumran data in Safran.
- The apparatus is **an aid, not a critical edition**. It is based on the printed text of the LXX (via CATSS) and on the ETCBC Peshitta, not on manuscripts. A plus or minus describes the relation of the aligned texts and does not prove a different Hebrew manuscript. An inferred Vorlage is a conjecture, and `sure: false` marks it as such. Esther is missing for the LXX, since CATSS has no text for it.
- Please report errors as an issue, with book, verse and witness.

## Sources and license

| Part | Derived from | License of the source |
| --- | --- | --- |
| LXX: Greek groups, Hebrew words, alignment | CATSS, E. Tov and R. A. Kraft, [Oxford Text Archive 1111](https://ota.bodleian.ox.ac.uk/repository/xmlui/handle/20.500.12024/1111) | CC BY-NC-SA 3.0 |
| Peshitta words and ids | [ETCBC/peshitta](https://github.com/ETCBC/peshitta), W. Th. van Peursen et al., [doi:10.5281/zenodo.1464757](https://doi.org/10.5281/zenodo.1464757) | CC BY-NC 4.0 |
| MT words (Peshitta part) | [Open Scriptures Hebrew Bible](https://github.com/openscriptures/morphhb) (Westminster Leningrad Codex) | CC BY 4.0 |

Because of these sources the whole dataset – the classifications, inferred Vorlagen, notes, alignments and the conversion – is licensed **[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)**: free for non-commercial use with attribution, adaptations under the same license. See [LICENSE.md](LICENSE.md).

## Citation

Itkin, Igor Mendel (ed.): *LXX and Peshitta against the Masoretic Text – a classified apparatus*, version 1.1.0, 2026. https://github.com/mitkin89/lxx-peshitta-apparatus/releases/tag/1.1.0

See [CITATION.cff](CITATION.cff). The previous version 1.0.0 is archived at [Zenodo](https://doi.org/10.5281/zenodo.24465785).
