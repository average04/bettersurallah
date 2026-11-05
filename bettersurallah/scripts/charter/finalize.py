"""draft2.json + overrides -> services.json for the BetterSurallah app."""
import json
import re
import sys
import unicodedata

sys.path.insert(0, sys.argv[3])
import overrides as O  # noqa: E402

drafts = json.load(open(sys.argv[1], encoding="utf-8"))
out_path = sys.argv[2]

ACRONYMS = {
    "MTOP", "BOSS", "CTC", "PWD", "ID", "IDS", "SECPA", "CENOMAR", "RA", "IEC", "CCTV", "DRRM", "SOCOTECO", "SWM",
    "MTO", "AICS", "DOLE", "DILP", "ESC", "RTC", "GIP", "OWWA", "TUPAD", "PSA", "NBI", "PNP", "DFA", "OFW", "TB",
    "EBPLS", "BPLO", "MEBO", "LGU", "II", "III", "IV", "SB", "DRRM", "ID", "GIP", "OEC",
}
SMALL = {"of", "and", "for", "the", "to", "in", "on", "a", "an", "or", "with", "by", "at", "from", "sa"}


TYPOS = {"Treament": "Treatment", "Dedging": "Dredging", "Prunning": "Pruning", "Footages": "Footage"}


def _cap(w):
    return re.sub(r"[a-z]", lambda m: m.group(0).upper(), w.lower(), count=1)


def title_case(s):
    s = re.sub(r"\s+", " ", s.strip())
    res = []
    for i, word in enumerate(s.split(" ")):
        parts = []
        for j, w in enumerate(word.split("/")):
            subs = []
            for k, h in enumerate(w.split("-")):
                core = re.sub(r"[^A-Za-z]", "", h).upper()
                if core in ACRONYMS:
                    subs.append(h.upper().replace("EBPLS", "eBPLS"))
                elif k > 0 or ((i > 0 or j > 0) and h.lower() in SMALL):
                    subs.append(h.lower())
                else:
                    subs.append(_cap(h))
            parts.append("-".join(subs))
        res.append("/".join(parts))
    out = " ".join(res)
    for a, b in TYPOS.items():
        out = out.replace(a, b)
    return out.replace("/ ", "/")


def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s.lower()).strip("-")
    return re.sub(r"-+", "-", s)[:70].strip("-")


def sentence_case_if_caps(s):
    letters = [c for c in s if c.isalpha()]
    if letters and sum(c.isupper() for c in letters) / len(letters) > 0.8:
        s = s.lower()
        s = s[0].upper() + s[1:]
        for a in ["Lgu", "Mho", "Bplo", "Mto", "Ofw", "Pwd", "Surallah", "Sangguniang Barangay", "Bfp", "Dti"]:
            s = re.sub(r"\b" + re.escape(a.lower()) + r"\b", a.upper() if len(a) <= 4 else a, s)
    return s


def clean_text(s):
    s = s or ""
    s = s.replace("�", "–")
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r"\s+([,.;:)])", r"\1", s)
    s = re.sub(r"\.\.+$", ".", s)
    return s


DUR = re.compile(r"(\d+(?:\.\d+)?)\s*(working\s+days?|minutes?|mins?|hours?|hrs?|days?|weeks?|seconds?)", re.I)


def norm_time(s):
    s = clean_text(s)
    if not s:
        return ""
    found = DUR.findall(s)
    if not found:
        return s.lower()
    parts = []
    for n, unit in found:
        u = re.sub(r"\s+", " ", unit.lower())
        u = {"min": "minute", "mins": "minutes", "hr": "hour", "hrs": "hours"}.get(u, u)
        if n == "1" and u.endswith("s"):
            u = u[:-1]
        if n != "1" and not u.endswith("s"):
            u += "s"
        parts.append(f"{n} {u}")
    return " + ".join(parts)


NONE_RE = re.compile(r"^(?:(?:none|n/a)\s*)+$", re.I)


def norm_fee(s):
    s = clean_text(s)
    if not s or NONE_RE.match(s):
        return "None"
    s = re.sub(r"^(?:None\s+)+", "", s, flags=re.I)
    s = re.sub(r"(?:\s+None)+$", "", s, flags=re.I)
    s = re.sub(r"\(Php\)\s*", "₱", s)
    s = re.sub(r"\bPhp\.?\s*[:.]?\s*(?=\d)", "₱", s, flags=re.I)
    s = re.sub(r"₱\s+", "₱", s)
    return s


OFFICE_TOKENS = r"(BPLO|MTO|MEBO|MENRO|MHO|MAO|MASSO|MCRO|MDRRMO|MDRMMO|MEEMO|MGSO|GSO|HRMO|MHRO|MPDO|MSWDO|PESO|OMAG|Municipal Mayor's Office|Mayor's Office|BFP|SB|Tourism Office|STACDC)"


def norm_person(s):
    s = clean_text(s)
    if not s:
        return ""
    s = re.sub(r"\bPERSON\b\s*", "", s)
    s = re.sub(r"\b\d+\s*(MINUTES?|HOURS?|DAYS?)\b|\bAND\b", "", s)
    s = re.sub(r"[()]", " ", s)
    s = re.sub(r"\bRC{1,2}\s*([lI]{1,3})\b", lambda m: "RCC " + "I" * len(m.group(1)), s)
    s = re.sub(r"(?<= )[lI]*l[lI]*(?=\b)", lambda m: "I" * len(m.group(0)) if len(m.group(0)) <= 3 else m.group(0), s)
    s = re.sub(r"\bVl\b", "VI", s)
    s = re.sub(r"\b(MGDH|EMS|LDRRMO)\s*1\b", r"\1 I", s)
    s = re.sub(r"\bManger\b", "Manager", s)
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"\b" + OFFICE_TOKENS + r"\b\s*", r"\1|", s)
    parts = [p.strip(" ,;.-") for p in s.split("|") if p.strip(" ,;.-")]
    out = []
    for p in parts:
        if p not in out:
            out.append(p)
    return ", ".join(out)


def split_agency(s):
    s = clean_text(s)
    if not s:
        return []
    pieces = re.split(r"\s(?=\d+\.\d+(?:\.\d+)?\.?\s)", s)
    return [join_sentences(re.sub(r"^\d+(?:\.\d+)*\.?\s*", "", p).strip()) for p in pieces if p.strip()]


SENTENCE_STARTS = r"(Make sure|Remember|Client shall|Wait for|Please|Fill out the|Proceed to)"


def join_sentences(s):
    s = re.sub(r"\.\.+(?=\s)", ".", s)
    return re.sub(r"(?<=[a-z0-9)])\s+" + SENTENCE_STARTS + r"\b", r". \1", s)


def norm_client(s):
    s = join_sentences(clean_text(s))
    s = re.sub(r"^\d+\s*\.\s*(?:(APPLY|PAY|CLAIM)\s+)?(?:\d+\s*\.\s*)?", "", s)
    return s.rstrip(".") if s.count(".") <= 1 else s


def norm_total(raw):
    raw = clean_text(raw)
    fee = None
    m = re.search(r"Php\s*[:.]?\s*([\d,]+(?:\.\d+)?)", raw, re.I)
    if m:
        fee = "₱" + m.group(1)
        raw = (raw[:m.start()] + raw[m.end():]).strip()
    if re.match(r"^NONE\b", raw, re.I):
        fee = "None"
        raw = re.sub(r"^NONE\s*", "", raw, flags=re.I)
    t = raw.lower()
    t = re.sub(r"(\d)(hour|day|minute)", r"\1 \2", t)
    t = re.sub(r",(\S)", r", \1", t)
    return t.strip(), fee


def norm_classification(s):
    u = s.upper()
    if "HIGHLY" in u:
        return "Highly technical"
    if "COMPLEX" in u:
        return "Complex"
    if "SIMPLE" in u:
        return "Simple"
    return clean_text(s).title()


def norm_transactions(vals):
    joined = " ".join(vals).upper()
    out = []
    if "G2C" in joined or "TO CLIENT" in joined or "TO CITIZEN" in joined:
        out.append("G2C")
    if "G2B" in joined or "TO BUSINESS" in joined:
        out.append("G2B")
    if "G2G" in joined or "TO GOVERNMENT" in joined:
        out.append("G2G")
    return out


def norm_who(s):
    s = clean_text(re.sub(r"^Who may avail\s*:\s*", "", s or "", flags=re.I))
    if not s or s.upper() == "ALL":
        return "Anyone"
    if s.upper() == "ALL -INTERNAL":
        return "LGU offices (internal)"
    s = re.sub(r"^ALL", "All", s)
    return sentence_case_if_caps(s)


def norm_group_label(s):
    if not s:
        return None
    s = clean_text(s).rstrip(":")
    s = sentence_case_if_caps(s)
    return s


def norm_where(s):
    if not s:
        return None
    s = clean_text(s)
    s = re.sub(r"^\d+\s*[.)]\s*", "", s)
    return s or None


def build_requirements(svc):
    page = svc["page"]
    if page in O.REQ:
        groups = []
        for label, items, note in O.REQ[page]:
            its = []
            for it in items:
                entry = {"item": it[0], "where": it[1]}
                if len(it) > 2:
                    entry["options"] = it[2]
                its.append(entry)
            groups.append({"label": label, "note": note, "items": its})
        return groups
    groups = []
    for r in svc["requirements"]:
        if r.get("_orphanWhere") or not r["item"]:
            continue
        label = norm_group_label(r["group"])
        if not groups or groups[-1]["label"] != label:
            groups.append({"label": label, "note": None, "items": []})
        item = clean_text(re.sub(r"-x$", "", r["item"]))
        groups[-1]["items"].append({"item": item, "where": norm_where(r["where"])})
    return groups


services = []
seen_slugs = set()
for svc in drafts:
    page = svc["page"]
    if page == 84:  # complex/highly technical building permit variants: folded into the hand-written entry
        continue
    if page in (79, 94):
        base = dict(O.BUILDING_PERMIT if page == 79 else O.OCCUPANCY)
        steps = [{"label": st["label"], "you": st["client"], "office": st["agency"], "fee": st["fees"], "time": st["time"], "who": st["person"]} for st in base["steps"]]
        rec = {k: base[k] for k in ("office", "page", "endPage", "officialTitle", "summary", "classification", "transaction", "whoMayAvail", "requirements", "totalTime", "totalFee", "notes")}
        rec["steps"] = steps
    else:
        steps_raw = svc["steps"][: O.KEEP_STEPS.get(page, len(svc["steps"]))] + O.STEP_ADD.get(page, [])
        steps = []
        for k, st in enumerate(steps_raw):
            fix = O.STEP_FIX.get(page, {}).get(k)
            if fix:
                st = {**st, **fix}
            agency = st["agency"] if isinstance(st["agency"], list) else split_agency(st["agency"])
            steps.append({
                "label": st["label"],
                "you": norm_client(st["client"]),
                "office": agency,
                "fee": norm_fee(st["fees"]),
                "time": st["time"] if fix and "time" in fix else norm_time(st["time"]),
                "who": norm_person(st["person"]),
            })
        if page in O.TOTAL:
            total_time, total_fee = O.TOTAL[page]
        else:
            total_time, total_fee = norm_total(svc["totalTime"])
        desc = clean_text(svc["description"])
        desc = re.sub(r"\s+A$", "", desc)
        rec = {
            "office": svc["office"], "page": page, "endPage": svc["endPage"],
            "officialTitle": title_case(svc["title"]),
            "summary": desc,
            "classification": norm_classification(svc["classification"]),
            "transaction": norm_transactions(svc["transaction"]),
            "whoMayAvail": O.WHO.get(page) or norm_who(svc["whoMayAvail"]),
            "requirements": build_requirements(svc),
            "steps": steps,
            "totalTime": total_time, "totalFee": total_fee,
            "notes": O.NOTES.get(page, []),
        }
    name, aka = O.NAMES.get(page, (rec["officialTitle"], []))
    rec["name"] = name
    rec["aka"] = aka
    fees = [s["fee"] for s in rec["steps"]]
    rec["free"] = bool(fees) and all(f == "None" for f in fees) and rec["totalFee"] in (None, "None")
    slug = slugify(name)
    if slug in seen_slugs:
        slug = f"{slug}-{rec['office']}"
    seen_slugs.add(slug)
    rec["slug"] = slug
    order = ["slug", "office", "name", "officialTitle", "aka", "summary", "classification", "transaction",
             "whoMayAvail", "requirements", "steps", "totalTime", "totalFee", "free", "notes", "page", "endPage"]
    services.append({k: rec[k] for k in order})

json.dump(services, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(services), "services written;", sum(1 for s in services if s["free"]), "free")
missing = [s["page"] for s in services if s["page"] not in O.NAMES]
print("pages without plain names:", missing)
