"""Local static server plus a small notes API. Run: python3 server.py [port]"""
import json, re, sys
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
LOG = ROOT / "content" / "documents" / "notes-log.txt"
HEADER = re.compile(r"^=== (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) ===$")
MAX = 20000
DIARY = ROOT / "content" / "documents" / "diary"
FIELDS = ["date", "specialty", "setting", "topic", "presentation", "investigations", "management", "other"]
LIMITS = {"date": 10, "specialty": 80, "setting": 120, "topic": 200}


def read_diary():
    out = []
    for f in sorted(DIARY.glob("*.json")) if DIARY.exists() else []:
        try:
            out.append({"id": f.stem, **json.loads(f.read_text(encoding="utf-8"))})
        except ValueError:
            pass
    return out


def read_notes():
    notes, cur = [], None
    if LOG.exists():
        for line in LOG.read_text(encoding="utf-8").splitlines():
            m = HEADER.match(line)
            if m:
                cur = {"time": m.group(1), "text": []}
                notes.append(cur)
            elif cur is not None:
                cur["text"].append(line)
    return [{"time": n["time"], "text": "\n".join(n["text"]).strip()} for n in notes]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(ROOT), **k)

    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.split("?")[0] == "/api/notes":
            return self._json(200, read_notes())
        if self.path.split("?")[0] == "/api/diary":
            return self._json(200, read_diary())
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/diary":
            return self.post_diary()
        if self.path != "/api/notes":
            return self._json(404, {"error": "not found"})
        try:
            n = int(self.headers.get("Content-Length", 0))
            text = str(json.loads(self.rfile.read(min(n, MAX * 4))).get("text", "")).strip()
        except (ValueError, AttributeError):
            return self._json(400, {"error": "bad request"})
        if not text or len(text) > MAX:
            return self._json(400, {"error": "note empty or too long"})
        # Stop note text from forging a log header.
        text = "\n".join(" " + l if HEADER.match(l) else l for l in text.splitlines())
        stamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        LOG.parent.mkdir(parents=True, exist_ok=True)
        with LOG.open("a", encoding="utf-8") as f:
            f.write(f"=== {stamp} ===\n{text}\n\n")
        self._json(201, {"time": stamp, "text": text})


def _post_diary(self):
    try:
        n = int(self.headers.get("Content-Length", 0))
        data = json.loads(self.rfile.read(min(n, MAX * 8)))
        entry = {k: str(data.get(k, "")).strip() for k in FIELDS}
    except (ValueError, AttributeError):
        return self._json(400, {"error": "bad request"})
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", entry["date"]):
        return self._json(400, {"error": "date must be YYYY-MM-DD"})
    if not (entry["presentation"] or entry["investigations"] or entry["management"] or entry["other"]):
        return self._json(400, {"error": "entry is empty"})
    if any(len(v) > LIMITS.get(k, MAX) for k, v in entry.items()):
        return self._json(400, {"error": "field too long"})
    now = datetime.now()
    entry["saved"] = now.strftime("%Y-%m-%d %H:%M:%S")
    entry["filed"] = False
    DIARY.mkdir(parents=True, exist_ok=True)
    name = now.strftime("%Y-%m-%d-%H%M%S")
    path = DIARY / f"{name}.json"
    i = 1
    while path.exists():
        path = DIARY / f"{name}-{i}.json"
        i += 1
    path.write_text(json.dumps(entry, indent=2, ensure_ascii=False), encoding="utf-8")
    self._json(201, {"id": path.stem, **entry})


Handler.post_diary = _post_diary

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Serving on http://localhost:{port}/site/  (Ctrl+C to stop)")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
