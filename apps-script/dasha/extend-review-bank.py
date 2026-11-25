"""Safely add Dasha levels 21–30 to the unchanged original 20-set history.

Only updates the bank, level limit, and the existing dashaLevel_() final
unlock check. Strictly compares live quiz bank against both earlier approved
banks before writing. Never touches the Google Sheet, reward logic or
Telegram configuration.
"""
import json
import re
import sys
from pathlib import Path

source_path = Path(sys.argv[1])
first_path = Path(sys.argv[2])
second_path = Path(sys.argv[3])
third_path = Path(sys.argv[4])
source = source_path.read_text(encoding="utf-8")
banks = [json.loads(path.read_text(encoding="utf-8"))
         for path in [first_path, second_path, third_path]]
assert all(b["student"] == "Даша" and b["schemaVersion"] == 1 for b in banks)
assert all(len(b["levels"]) == 10 for b in banks)
all_levels = sum((b["levels"] for b in banks), [])
assert len(all_levels) == 30

prompts = set()
for i, level in enumerate(all_levels, 1):
    assert len(level) == 10, "Level %s did not have ten questions" % i
    for q in level:
        assert len(q) == 4, "Unexpected question structure"
        prompt, options, key, explanation = q
        assert isinstance(prompt, str) and prompt.strip()
        assert prompt not in prompts, "Repeated prompt: " + prompt
        prompts.add(prompt)
        assert len(options) == 3 and len(set(options)) == 3
        assert type(key) is int and key in (0, 1, 2)
        assert all(isinstance(o, str) and o.strip() for o in options)
        assert isinstance(explanation, str) and explanation.strip()
assert len(prompts) == 300, "Every question must have a distinct prompt"

start_match = list(re.finditer(r"\bconst\s+DASHA_BANK\s*=\s*\[", source))
assert len(start_match) == 1, "Unrecognized Dasha quiz bank"
start = source.index("[", start_match[0].start())
quote = None
escape = False
depth = 0
end = None
for i in range(start, len(source)):
    ch = source[i]
    if quote:
        if escape:
            escape = False
        elif ch == "\\":
            escape = True
        elif ch == quote:
            quote = None
        continue
    if ch in ("'", '"', chr(96)):
        quote = ch
    elif ch == "[":
        depth += 1
    elif ch == "]":
        depth -= 1
        if depth == 0:
            end = i + 1
            break
assert end is not None, "Dasha bank has no end"
current = json.loads(source[start:end])
assert current == all_levels[:20], "Live Dasha bank diverged from the original 20 levels"
updated = (source[:start] +
           json.dumps(all_levels, ensure_ascii=False, separators=(",", ":")) +
           source[end:])

count_regex = re.compile(r"\bconst\s+DASHA_LEVELS\s*=\s*20\s*;")
assert len(count_regex.findall(updated)) == 1, "Unexpected current number of levels"
updated = count_regex.sub("const DASHA_LEVELS = 30;", updated)

unlock_marker = "  return Math.max(1, Math.min(DASHA_LEVELS, Math.floor(number) || 1));"
assert updated.count(unlock_marker) == 1, "Dasha current level logic changed"
assert updated.count("function dashaLevel_()") == 1
assert "const completed10 = oldAttempts.some" in updated, "Previous level 10 migration missing"

new_unlock = """  // Previous 20-level version kept PROGRESS=20 after a perfect final test.
  // Open level 21 ONLY if the grade sheet confirms a real 10/10 for level 20.
  // Existing rows, earned rewards, spent points and past levels stay untouched.
  if (number === 20) {
    const sheet = dashaSheet_();
    const last = sheet.getLastRow();
    if (last > 1) {
      const oldAttempts20 = sheet.getRange(2, 3, last - 1, 4).getValues();
      const completed20 = oldAttempts20.some(function(row) {
        return Number(row[0]) === 20 && Number(row[2]) === 10 &&
          Number(row[3]) === 10;
      });
      if (completed20) {
        props.setProperty(DASHA_PROGRESS, '21');
        number = 21;
      }
    }
  }
"""
updated = updated.replace(unlock_marker, new_unlock + unlock_marker)
assert updated.count("function dashaSubmit_") == 1
assert updated.count("function dashaStatus_") == 1
assert updated.count("function doGet(") == 1
assert updated.count("function dashaTelegram_") == 1
assert "const DASHA_REWARD = 60;" in updated
assert "const DASHA_LEVELS = 30;" in updated
assert "const completed20 = oldAttempts20.some" in updated
assert "const completed10 = oldAttempts.some" in updated
source_path.write_text(updated, encoding="utf-8")
print("PASS: all 300 distinct questions, existing 20 levels preserved, verified set 20 unlocks 21, reward rules unchanged.")
