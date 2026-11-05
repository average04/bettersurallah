"""Draft-parse the LGU Surallah Citizen's Charter 2026 dump into structured services.

Output is a DRAFT for human review, not final data.
"""
import collections
import json
import re
import sys

pages = json.load(open(sys.argv[1], encoding="utf-8"))
out_path = sys.argv[2]
P = {p["page"]: p for p in pages}

OFFICES = [
    ("bplo", 10), ("mao", 30), ("masso", 37), ("mcro", 45), ("mdrrmo", 71),
    ("ome", 78), ("meemo", 126), ("menro", 135), ("mgso", 149), ("mho", 153),
    ("mhro", 171), ("mpdo", 175), ("mswdo", 180), ("mto", 201), ("peso", 208),
    ("sb", 224), ("tourism", 226),
]
FEE_SCHEDULE = (108, 125)
END_PAGE = 230  # last service page; 231+ checked separately

# ---------- vocabulary for repairing words broken across lines ----------
vocab = collections.Counter()
for p in pages:
    for w in p["words"]:
        for tok in re.findall(r"[A-Za-z]+", w[4]):
            vocab[tok.lower()] += 1


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


def words_in(page, top, bottom, x0=None, x1=None):
    res = []
    for w in P[page]["words"]:
        cy = (w[2] + w[3]) / 2
        if cy < top - 0.5 or cy > bottom + 0.5:
            continue
        if x0 is not None and w[0] < x0:
            continue
        if x1 is not None and w[0] >= x1:
            continue
        res.append(w)
    return res


def to_lines(ws):
    ws = sorted(ws, key=lambda w: (round(w[2] / 3), w[0]))
    lines, cur, cur_top = [], [], None
    for w in sorted(ws, key=lambda w: (w[2], w[0])):
        if cur_top is None or abs(w[2] - cur_top) > 3:
            if cur:
                lines.append(" ".join(x[4] for x in sorted(cur, key=lambda x: x[0])))
            cur, cur_top = [w], w[2]
        else:
            cur.append(w)
    if cur:
        lines.append(" ".join(x[4] for x in sorted(cur, key=lambda x: x[0])))
    return lines


NUM = re.compile(r"^\s*(\d{1,2})\s*[.)]\s*(?!\d)")


def split_numbered(lines):
    """Return list of (group_heading, item_text) from numbered lines."""
    items, group, cur = [], None, None
    for i, l in enumerate(lines):
        m = NUM.match(l)
        if m:
            if cur is not None:
                items.append((cur[0], join_lines(cur[1])))
            cur = (group, [l[m.end():]])
        else:
            nxt = lines[i + 1] if i + 1 < len(lines) else ""
            looks_heading = (re.match(r"^(For|FOR)\b", l) and len(l) < 60) or (
                cur is None and NUM.match(nxt) and len(l) < 60)
            if looks_heading:
                if cur is not None:
                    items.append((cur[0], join_lines(cur[1])))
                    cur = None
                group = join_lines([l])
            elif cur is None:
                cur = (group, [l])
            else:
                cur[1].append(l)
    if cur is not None:
        items.append((cur[0], join_lines(cur[1])))
    return items


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


# ---------- service boundaries ----------
starts = []
for pg in range(11, END_PAGE + 1):
    if FEE_SCHEDULE[0] <= pg <= FEE_SCHEDULE[1]:
        continue
    lines = [l.strip() for l in P[pg]["text"].split("\n") if l.strip()]
    if lines and re.match(r"^\d+\s*\.", lines[0]) and P[pg]["tables"]:
        starts.append(pg)
office_pages = {pg for _, pg in OFFICES}
bounds = []
for i, s in enumerate(starts):
    nxt = starts[i + 1] if i + 1 < len(starts) else END_PAGE + 1
    end = nxt - 1
    for op in sorted(office_pages):
        if s < op <= end:
            end = op - 1
    if s < FEE_SCHEDULE[0] <= end:
        end = FEE_SCHEDULE[0] - 1
    office = [k for k, op in OFFICES if op <= s][-1]
    bounds.append((office, s, end))


def is_upperish(l):
    letters = [c for c in l if c.isalpha()]
    return letters and sum(c.isupper() for c in letters) / len(letters) > 0.8


services = []
for office, s, e in bounds:
    lines = [l.strip() for l in P[s]["text"].split("\n") if l.strip()]
    title_lines = []
    i = 0
    while i < len(lines) and is_upperish(lines[i]) and len(title_lines) < 3:
        title_lines.append(lines[i])
        i += 1
    title = re.sub(r"^\d+\s*\.\s*", "", join_lines(title_lines))
    desc_lines = [l for l in lines[i:] if not re.fullmatch(r"\d{1,3}|A", l)]
    description = join_lines(desc_lines)

    svc = {
        "office": office, "page": s, "endPage": e, "title": title, "description": description,
        "officeName": "", "classification": "", "transaction": [], "whoMayAvail": "",
        "requirements": [], "steps": [], "totalTime": "", "notes": [], "warnings": [],
    }
    state = None
    last_field = None
    where_x = None
    step_cols = None  # list of boundaries
    for pg in range(s, e + 1):
        page = P[pg]
        if pg != s:
            extra = [l.strip() for l in page["text"].split("\n") if l.strip() and not re.fullmatch(r"\d{1,3}", l.strip())]
            if extra:
                svc["notes"].append(join_lines(extra))
        for t in page["tables"]:
            for row in t["rows"]:
                cells = row["cells"]
                if not cells:
                    continue
                texts = [norm(c["t"]) for c in cells]
                first = texts[0]
                joined = " | ".join(texts)
                if re.match(r"^Office\s*:", first):
                    svc["officeName"] = norm(" ".join(texts[1:])) or first.split(":", 1)[1]
                    state = "head"; last_field = "officeName"; continue
                if re.match(r"^Classification\s*:", first):
                    svc["classification"] = norm(" ".join(texts[1:])); state = "head"; last_field = "classification"; continue
                if re.match(r"^Type of Transaction\s*:", first):
                    vals = [x for x in texts if not x.startswith("Type of Transaction")]
                    svc["transaction"] += vals; state = "type"; continue
                if re.match(r"^Who may avail\s*:", first):
                    svc["whoMayAvail"] = norm(" ".join(texts[1:])); state = "head"; last_field = "whoMayAvail"; continue
                if "CHECKLIST OF REQUIREMENTS" in joined.upper():
                    state = "req"
                    for c in cells:
                        if "WHERE" in c["t"].upper():
                            where_x = c["x0"]
                    continue
                if "CLIENT STEPS" in joined.upper():
                    state = "steps"
                    keys = ["CLIENT", "AGENCY", "FEES", "PROCESSING", "PERSON"]
                    xs = []
                    for k in keys:
                        hit = [c["x0"] for c in cells if k in c["t"].upper()]
                        xs.append(hit[0] if hit else None)
                    if None in xs:
                        svc["warnings"].append(f"p{pg}: step header columns missing {xs}")
                        xs = [x if x is not None else 0 for x in xs]
                    step_cols = [x - 6 for x in xs]
                    continue
                if state == "type":
                    if len(cells) == 1 or all(not re.search(r":$", x) for x in texts):
                        svc["transaction"] += texts; continue
                if state == "req":
                    ws = words_in(pg, row["top"], row["bottom"], t["bbox"][0] - 1, t["bbox"][2] + 1)
                    if where_x is None:
                        left, right = ws, []
                    else:
                        left = [w for w in ws if w[0] < where_x - 2]
                        right = [w for w in ws if w[0] >= where_x - 2]
                    items = split_numbered(to_lines(left))
                    wheres = split_numbered(to_lines(right))
                    if wheres and len(wheres) != len(items):
                        svc["warnings"].append(f"p{pg}: {len(items)} requirements vs {len(wheres)} where-to-secure")
                    for k, (g, it) in enumerate(items):
                        wh = wheres[k][1] if k < len(wheres) and len(wheres) == len(items) else None
                        svc["requirements"].append({"group": g, "item": it, "where": wh})
                    if wheres and len(wheres) != len(items):
                        svc["requirements"].append({"group": None, "item": "", "where": " / ".join(w for _, w in wheres), "_orphanWhere": True})
                    continue
                if state == "steps" and step_cols:
                    if re.match(r"^(ACTION|TIME|RESPONSIBLE)$", first.strip()) and all(x in ("ACTION", "TIME", "RESPONSIBLE") for x in texts):
                        continue
                    ws = words_in(pg, row["top"], row["bottom"], t["bbox"][0] - 1, t["bbox"][2] + 1)
                    bnds = step_cols + [10_000]
                    col = [to_lines([w for w in ws if bnds[k] <= w[0] < bnds[k + 1]]) for k in range(5)]
                    # words left of first boundary belong to client column
                    col[0] = to_lines([w for w in ws if w[0] < bnds[1]])
                    ctext = [join_lines(c) for c in col]
                    if svc.get("_done"):
                        continue  # rows after TOTAL are fee schedules / annexes, not steps
                    if re.match(r"^TOTAL\b", ctext[0], re.I):
                        rest = " ".join(x for x in ctext[1:] if x) or re.sub(r"^TOTAL\s*:?", "", ctext[0], flags=re.I)
                        svc["totalTime"] = norm(rest)
                        svc["_done"] = True
                        continue
                    is_new = bool(re.match(r"^(\d|(APPLY|PAY|CLAIM|ASSESS(MENT)?|RECEIVE|SUBMIT)\b)", ctext[0]))
                    if is_new or not svc["steps"]:
                        label = None
                        m = re.match(r"^(APPLY|PAY|CLAIM|ASSESS(?:MENT)?|RECEIVE|SUBMIT)\b\s*", ctext[0])
                        client = ctext[0]
                        if m:
                            label = m.group(1).title()
                            client = client[m.end():]
                        svc["steps"].append({"label": label, "client": client, "agency": ctext[1],
                                             "fees": ctext[2], "time": ctext[3], "person": ctext[4]})
                    else:
                        st = svc["steps"][-1]
                        for key, val in zip(["client", "agency", "fees", "time", "person"], ctext):
                            if val:
                                st[key] = (st[key] + " " + val).strip()
                    continue
                if state == "head" and last_field and "WHERE TO SECURE" not in joined.upper():
                    svc[last_field] = norm(svc[last_field] + " " + " ".join(texts)); continue
                svc["warnings"].append(f"p{pg}: unhandled row in state {state}: {joined[:120]}")
    services.append(svc)

json.dump(services, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(services), "services;", sum(len(s["warnings"]) for s in services), "warnings")
