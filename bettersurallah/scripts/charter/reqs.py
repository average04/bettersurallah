"""Parse CHECKLIST OF REQUIREMENTS sections from pdftotext -layout output.

Usage: reqs.py layout.txt draft.json out.json
Replaces each draft service's requirements with a layout-based parse, and records
warnings when item/where counts disagree.
"""
import json
import re
import sys

layout = open(sys.argv[1], encoding="utf-8", errors="replace").read().split("\f")
svcs = json.load(open(sys.argv[2], encoding="utf-8"))

import collections
vocab = collections.Counter(t.lower() for t in re.findall(r"[A-Za-z]+", " ".join(layout)))


def fix_chars(s):
    s = re.sub(r"(?<=[A-Za-z])�(?=[st]\b)", "’", s)
    s = s.replace("�", "–")
    s = s.replace("’", "'")
    return s


def join_lines(lines):
    out = ""
    for raw in lines:
        l = raw.strip()
        if not l:
            continue
        if not out:
            out = l
            continue
        m1 = re.search(r"([A-Za-z]+)$", out)
        m2 = re.match(r"^([a-z]+)", l)
        if m1 and m2:
            a, b = m1.group(1), m2.group(1)
            if vocab[(a + b).lower()] > 0 and (vocab[a.lower()] <= 3 or vocab[b.lower()] <= 3):
                out += l
                continue
        if re.search(r"\d[\d,]*\.\d$", out) and re.match(r"^\d\b", l):
            out += l
            continue
        if out.endswith("-") and m2 and not out.endswith(" -"):
            out += l
            continue
        out += " " + l
    out = fix_chars(out)
    out = re.sub(r"\s+", " ", out).strip()
    out = re.sub(r"\s+([,.;:)])", r"\1", out)
    out = re.sub(r"\(\s+", "(", out)
    return out



NUM = re.compile(r"^(\d{1,2})\s*[.)]\s*(?!\d)")


def split_line(line, where_col):
    """Split a layout line into (left, right) around the WHERE column."""
    if len(line) <= where_col - 3:
        return line.rstrip(), ""
    # find a gap of >=2 spaces whose end is near where_col
    best = None
    for m in re.finditer(r"\s{2,}", line):
        end = m.end()
        if where_col - 12 <= end <= where_col + 12:
            if best is None or abs(end - where_col) < abs(best - where_col):
                best = end
    if best is None:
        # right column may start at line start when left is empty
        stripped = line.lstrip()
        start = len(line) - len(stripped)
        if start >= where_col - 12:
            return "", stripped.rstrip()
        return line.rstrip(), ""
    return line[:best].rstrip(), line[best:].rstrip()


def collect(lines):
    """lines -> list of entries {group, num, lines[]}"""
    entries, group = [], None
    for raw in lines:
        s = raw.strip()
        if not s:
            continue
        m = NUM.match(s)
        if m:
            entries.append({"group": group, "num": int(m.group(1)), "lines": [s[m.end():]]})
            continue
        indent = len(raw) - len(raw.lstrip())
        is_heading = (s.isupper() and len(s) < 60 and not entries) or re.match(r"^(For|FOR)\b.{0,50}$", s) or (
            s.isupper() and len(s) < 40 and indent < 6)
        if is_heading and not s.endswith(","):
            group = join_lines([s.rstrip(":")])
            continue
        if entries:
            entries[-1]["lines"].append(s)
        else:
            entries.append({"group": group, "num": None, "lines": [s]})
    for e in entries:
        e["text"] = join_lines(e["lines"])
    return entries


for svc in svcs:
    lines = []
    capturing = False
    where_col = None
    for pg in range(svc["page"], svc["endPage"] + 1):
        for line in layout[pg - 1].split("\n"):
            if "CHECKLIST OF REQUIREMENTS" in line.upper():
                capturing = True
                idx = line.upper().find("WHERE TO SECURE")
                where_col = idx if idx >= 0 else None
                continue
            if capturing and re.search(r"CLIENT\s+STEPS", line.upper()):
                capturing = False
                break
            if capturing:
                if re.fullmatch(r"\s*\d{1,3}\s*", line):
                    continue
                lines.append(line)
        if lines and not capturing:
            break
    if where_col is None:
        svc["warnings"].append("layout: no WHERE column")
        continue
    left, right = [], []
    for l in lines:
        a, b = split_line(l, where_col)
        left.append(a)
        right.append(b)
    items = collect(left)
    wheres = collect(right)
    # wheres don't carry groups; drop group info
    reqs = []
    if len(items) == len(wheres):
        for it, wh in zip(items, wheres):
            reqs.append({"group": it["group"], "item": it["text"], "where": wh["text"]})
    else:
        svc["warnings"].append(f"layout: {len(items)} items vs {len(wheres)} wheres")
        for k, it in enumerate(items):
            reqs.append({"group": it["group"], "item": it["text"], "where": None})
        if wheres:
            reqs.append({"group": None, "item": "", "where": " / ".join(w["text"] for w in wheres), "_orphanWhere": True})
    svc["requirements"] = reqs
    svc["warnings"] = [w for w in svc["warnings"] if "where-to-secure" not in w]

json.dump(svcs, open(sys.argv[3], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(sum(1 for s in svcs if any("layout" in w for w in s["warnings"])), "services with requirement warnings of", len(svcs))
