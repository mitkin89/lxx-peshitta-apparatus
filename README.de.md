# LXX und Peschitta gegenüber dem masoretischen Text – ein eingeordneter Apparat

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24465785.svg)](https://doi.org/10.5281/zenodo.24465785)

[English](README.md) · **Deutsch**

Wo weichen Septuaginta und Peschitta vom masoretischen Text ab, und warum? Dieser Datensatz hält die Abweichungen Vers für Vers fest, ordnet sie ein und erklärt sie auf Deutsch und Englisch:

| Teil | Bücher | Verse | Einträge |
| --- | ---: | ---: | ---: |
| **LXX-Lesarten** (`lxx/`) | 38 Bücher in 40 Fassungen (Richter A/B und Daniel OG/Theodotion getrennt; ohne Ester) | 9.441 | 13.414 |
| **Peschitta-Lesarten** (`peshitta/readings/`) | 39 Bücher | 8.386 | 11.132 |
| **Wortzuordnung MT–Peschitta** (`peshitta/alignment/`) | 39 Bücher | 23.206 | 291.325 Verknüpfungen |

Jeder Eintrag nennt die betroffenen MT-Wörter und die griechischen oder syrischen Wörter, eine **Art** (`lesart`, `deutung`, `zusatz`, `auslassung`, `harmonisierung`, `technik`, `doublette`, `umstellung`, `zahl`, `name`, `grfehler`/`syrfehler`; siehe `types.json`), die erschlossene **hebräische Vorlage**, wo sie sich erschließen lässt, eine Erklärung in einem Satz auf Deutsch und Englisch, ob die Deutung **sicher** oder eine Vermutung ist, und die **Parallelstelle**, an die angeglichen wurde.

Die Daten entstanden für den Apparat der freien Desktop-Bibliothek [Safran](https://github.com/mitkin89/Safran). Dort stehen sie neben dem Text und sind durchsuchbar (etwa: alle Stellen, an denen LXX und Peschitta gemeinsam gegen den MT stehen). Die Hexapla-Lesarten mit anderer Vorlage gehören zum Datensatz [field-hexapla](https://github.com/mitkin89/field-hexapla).

Aufbau und Felder sind in der [englischen Fassung](README.md#format) beschrieben.

## Version 1.1.0

Abgleich mit Safran vom **25. November 2026**: Die Anzahl der Lesarten und
Wortzuordnungen bleibt unverändert. Neu sind **45 redaktionelle Merkmale**
(11 LXX, 34 Peschitta) an den betreffenden Lesarten: Vergleiche zu Halacha,
Aggada, Targum und Tiqqun soferim mit Bearbeiter, konkreter Quelle,
ursprünglichem Prüfstatus und, soweit vorhanden, zweisprachiger Erklärung. Das sind zusätzliche
Einordnungen, keine neuen Textvarianten. Der Quellenvergleich bestätigt nicht
die Sicherheit einer erschlossenen Vorlage. Hexapla-Merkmale gehören nicht
zu diesem Datensatz.

Das optionale Feld `readings[].traditions` enthält diese Merkmale.
Nur `check: "source-checked"` kennzeichnet ausdrücklich einen Vergleich am
Primärtext; ein fehlender Prüfvermerk bedeutet keine Bestätigung.
Die ursprünglichen Lesartenerklärungen und Sicherheitsangaben bleiben erhalten.

`manifest.json` nennt den genauen Safran-Commit, SHA-256-Prüfsummen der
Exportquellen und die Bestandszahlen. Export und Prüfung sind in der
[englischen Anleitung](README.md#version-110) beschrieben.
Das DOI-Abzeichen oben bezeichnet die archivierte Version 1.0.0. Die neue
Versions-DOI wird ergänzt, sobald das Zenodo-Archiv für 1.1.0 verfügbar ist.

## Methode und Verlässlichkeit

- Die Wortzuordnungen stammen aus CATSS (LXX) und aus einer Wort-für-Wort-Prüfung der Peschitta gegen den MT. Auf dieser Grundlage wurde jeder Vers mit Claude (Anthropic, 2026) geprüft und eingeordnet; für die LXX lag CATSS-Spalte b (Tovs erschlossene Lesarten) vor. Hinweise wie „so auch SMR/4Q…“ wurden mit dem Samaritanus und den Qumran-Daten in Safran abgeglichen.
- Der Apparat ist **ein Hilfsmittel, keine kritische Edition**. Er beruht auf dem gedruckten LXX-Text (über CATSS) und der ETCBC-Peschitta, nicht auf Handschriften. Plus und Minus beschreiben das Verhältnis der ausgerichteten Texte und beweisen keine abweichende hebräische Handschrift. Eine erschlossene Vorlage ist eine Vermutung; `sure: false` kennzeichnet sie als solche. Für die LXX fehlt Ester, weil CATSS dafür keinen Text hat.
- Fehler bitte als Issue melden, mit Buch, Vers und Zeuge.

## Quellen und Lizenz

- LXX: CATSS (E. Tov und R. A. Kraft, Oxford Text Archive 1111), **CC BY-NC-SA 3.0**.
- Peschitta: [ETCBC/peshitta](https://github.com/ETCBC/peshitta) (W. Th. van Peursen u. a.), **CC BY-NC 4.0**; Anfangsvorschläge für 1.161 Genesis-Verse aus [ETCBC/PaTraCoSy](https://github.com/ETCBC/PaTraCoSy).
- MT-Wörter im Peschitta-Teil: Open Scriptures Hebrew Bible (Westminster Leningrad Codex), **CC BY 4.0**.

Wegen dieser Quellen steht der ganze Datensatz – Einordnungen, erschlossene Vorlagen, Erklärungen, Wortzuordnungen und die Aufbereitung – unter **[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de)**: frei für nicht-kommerzielle Nutzung mit Namensnennung, Bearbeitungen unter derselben Lizenz. Siehe [LICENSE.md](LICENSE.md).

## Zitieren

Itkin, Igor Mendel (Hg.): *LXX and Peshitta against the Masoretic Text – a classified apparatus*, Version 1.1.0, 2026. https://github.com/mitkin89/lxx-peshitta-apparatus/releases/tag/1.1.0

Siehe [CITATION.cff](CITATION.cff). Jede Version wird auf Zenodo mit eigener DOI archiviert.
