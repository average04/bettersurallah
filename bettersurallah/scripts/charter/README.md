# Citizen's Charter extraction

These scripts produced `data/services.json` from the
[LGU Surallah Citizen's Charter 2026 (1st edition)](https://surallah.gov.ph/wp-content/uploads/2026/03/LGU-Surallah-Citizens-charter-2026-1st-edition_compressed.pdf).
They are a one-off import tool, not part of the site build. Keep them for the next
edition of the charter.

Requires Python 3.11+, `pip install pdfplumber`, and `pdftotext` (Poppler; bundled with Git for Windows).

```sh
python dump.py charter.pdf charter.json          # tables, cells and word positions per page
pdftotext -layout charter.pdf layout.txt         # column-preserving text, used for requirements
python parse.py charter.json draft.json          # services: header fields, steps, totals
python reqs.py layout.txt draft.json draft2.json # requirements + where to secure
python finalize.py draft2.json ../../data/services.json .
```

The PDF's tables are irregular, so the parse is only a draft. `overrides.py` holds the
corrections that were checked by hand against the PDF, keyed by the page each service
starts on: requirement lists, totals the parser misses, steps the PDF packs into one cell,
plain-language names and search aliases, and the building permit / certificate of occupancy
entries (the PDF prints their simple, complex and highly technical variants back to back).

For a new edition: re-run the pipeline, then re-check every override against the new PDF,
because page numbers will shift.
