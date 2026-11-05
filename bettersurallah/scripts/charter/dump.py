"""PDF -> JSON dump of every page: loose text, word positions, and table rows/cells."""
import json
import sys

import pdfplumber

pdf_path, out_path = sys.argv[1], sys.argv[2]
pages = []
with pdfplumber.open(pdf_path) as pdf:
    for i, page in enumerate(pdf.pages):
        found = page.find_tables()
        bboxes = [t.bbox for t in found]
        def outside(obj):
            cx = (obj["x0"] + obj["x1"]) / 2; cy = (obj["top"] + obj["bottom"]) / 2
            return not any(b[0] <= cx <= b[2] and b[1] <= cy <= b[3] for b in bboxes)
        free = page.filter(outside).extract_text() or ""
        words = [[round(w["x0"], 1), round(w["x1"], 1), round(w["top"], 1), round(w["bottom"], 1), w["text"]]
                 for w in page.extract_words(keep_blank_chars=False, use_text_flow=False)]
        tables = []
        for t in found:
            rows = []
            for row_obj, row in zip(t.rows, t.extract()):
                cells = []
                for bbox, c in zip(row_obj.cells, row):
                    c = (c or "").strip()
                    if c and bbox:
                        cells.append({"x0": round(bbox[0], 1), "x1": round(bbox[2], 1), "t": c})
                rb = row_obj.bbox
                rows.append({"top": round(rb[1], 1), "bottom": round(rb[3], 1), "cells": cells})
            tables.append({"bbox": [round(v, 1) for v in t.bbox], "rows": rows})
        pages.append({"page": i + 1, "width": page.width, "text": free, "words": words, "tables": tables})
json.dump(pages, open(out_path, "w", encoding="utf-8"), ensure_ascii=False)
print(len(pages))
