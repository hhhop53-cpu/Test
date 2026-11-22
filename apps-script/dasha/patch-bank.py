"""Replace only the Dasha quiz bank in a freshly pulled Apps Script project.

All other Google Apps Script source, manifest, Script Properties, and deployment remain untouched.
"""
from pathlib import Path
import json
import re
import sys

src = Path(sys.argv[1])
bank_path = Path(sys.argv[2])
original = src.read_text(encoding="utf-8")
data = json.loads(bank_path.read_text(encoding="utf-8"))
assert data["schemaVersion"] == 1 and data["student"] == "Даша"
levels = data["levels"]
assert len(levels) == 10
for level_idx, level in enumerate(levels, 1):
    assert len(level) == 10, f"Level {level_idx} must have 10 questions"
    prompts = []
    for question in level:
        assert len(question) == 4
        prompt, options, correct, explanation = question
        assert isinstance(prompt, str) and prompt.strip()
        assert len(options) == 3 and len(set(options)) == 3
        assert isinstance(correct, int) and 0 <= correct < 3
        assert explanation and all(isinstance(o, str) and o.strip() for o in options)
        prompts.append(prompt)
    assert len(set(prompts)) == 10, f"Duplicate prompt level {level_idx}"

match = re.search(r"\bconst\s+DASHA_BANK\s*=\s*\[", original)
if not match:
    raise SystemExit("Expected original DASHA_BANK declaration not found; no files changed.")
start = match.start()
opening = original.index("[", start)
quote = None
escaped = False
depth = 0
closing = None
for i in range(opening, len(original)):
    ch = original[i]
    if quote is not None:
        if escaped:
            escaped = False
        elif ch == "\\":
            escaped = True
        elif ch == quote:
            quote = None
        continue
    if ch in ("'", '"', "`"):
        quote = ch
    elif ch == "[":
        depth += 1
    elif ch == "]":
        depth -= 1
        if depth == 0:
            closing = i
            break
if closing is None:
    raise SystemExit("Could not locate closing bracket; no files changed.")
after = closing + 1
while after < len(original) and original[after].isspace():
    after += 1
if after < len(original) and original[after] == ";":
    after += 1
replacement = "const DASHA_BANK = " + json.dumps(levels, ensure_ascii=False, separators=(",", ":")) + ";"
updated = original[:start] + replacement + original[after:]
assert updated[:start] == original[:start] and updated[len(original[:start])+len(replacement):] == original[after:]
assert len(updated) > 1000 and updated != original
src.write_text(updated, encoding="utf-8")
print("Dasha bank changed: 10 levels × 10 questions; other source sections preserved.")
