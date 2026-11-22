"""Safely extend the existing Dasha Google Apps Script from 10 to 20 levels.

Preserves original levels 1-10 and every other business/reward/history function.
Refuses to replace unknown script state.
"""
import json
import re
import sys
from pathlib import Path

source_path = Path(sys.argv[1])
previous_path = Path(sys.argv[2])
new_path = Path(sys.argv[3])

original = source_path.read_text(encoding="utf-8")
old_data = json.loads(previous_path.read_text(encoding="utf-8"))
new_data = json.loads(new_path.read_text(encoding="utf-8"))
assert old_data["schemaVersion"] == 1 and new_data["schemaVersion"] == 1
assert old_data["student"] == new_data["student"] == "Даша"
old_levels = old_data["levels"]
next_levels = new_data["levels"]
assert len(old_levels) == 10 and len(next_levels) == 10
all_levels = old_levels + next_levels

all_prompts = []
for level_number, level in enumerate(all_levels, start=1):
    assert len(level) == 10, "Level %s must have 10 questions" % level_number
    seen = set()
    for q in level:
        assert len(q) == 4
        prompt, options, correct, explanation = q
        assert isinstance(prompt, str) and prompt.strip() and prompt not in seen
        seen.add(prompt)
        assert len(options) == 3 and len(set(options)) == 3
        assert 0 <= correct <= 2 and isinstance(correct, int)
        assert all(isinstance(option, str) and option.strip() for option in options)
        assert isinstance(explanation, str) and explanation.strip()
    all_prompts.extend(seen)
assert len(set(all_prompts)) == 200, "Different questions should be used across sets"

bank_pattern = re.compile(r"\bconst\s+DASHA_BANK\s*=\s*\[")
match = bank_pattern.search(original)
assert match and not bank_pattern.search(original, match.end()), "Expected one original DASHA_BANK"
open_pos = original.index("[", match.start())
quote = None
escape = False
depth = 0
close_pos = None
for i in range(open_pos, len(original)):
    ch = original[i]
    if quote is not None:
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
            close_pos = i
            break
assert close_pos is not None, "Unbalanced DASHA_BANK"
current_bank = json.loads(original[open_pos:close_pos + 1])
assert current_bank == old_levels, (
    "Live Dasha bank differs from approved 10-level baseline; abort without writing"
)
updated = (original[:open_pos] +
           json.dumps(all_levels, ensure_ascii=False, separators=(",", ":")) +
           original[close_pos + 1:])

old_count = re.compile(r"\bconst\s+DASHA_LEVELS\s*=\s*10\s*;")
assert len(old_count.findall(updated)) == 1, "Unexpected original level count"
updated = old_count.sub("const DASHA_LEVELS = 20;", updated)

old_level_function = re.compile(r"function\s+dashaLevel_\s*\(\s*\)\s*\{[^\n]*\}")
matches = list(old_level_function.finditer(updated))
assert len(matches) == 1, "Unexpected original dashaLevel_ implementation"
assert "DASHA_PROGRESS" in matches[0].group(0)
assert "Math.min(DASHA_LEVELS" in matches[0].group(0)

new_function = """function dashaLevel_() {
  const props = PropertiesService.getScriptProperties();
  let number = Number(props.getProperty(DASHA_PROGRESS) || 1);
  // The old version could not move beyond 10. Verify that 10/10 was actually
  // saved in the original spreadsheet before opening set 11. No earned points
  // or history rows are edited.
  if (number === 10) {
    const sheet = dashaSheet_();
    const last = sheet.getLastRow();
    if (last > 1) {
      const oldAttempts = sheet.getRange(2, 3, last - 1, 3).getValues();
      const completed10 = oldAttempts.some(function(row) {
        return Number(row[0]) === 10 && Number(row[2]) === 10;
      });
      if (completed10) {
        props.setProperty(DASHA_PROGRESS, '11');
        number = 11;
      }
    }
  }
  return Math.max(1, Math.min(DASHA_LEVELS, Math.floor(number) || 1));
}"""
updated = old_level_function.sub(lambda _: new_function, updated, count=1)
assert updated != original
assert "const DASHA_LEVELS = 20;" in updated
assert updated.count("function dashaLevel_()") == 1
assert updated.count("function dashaSubmit_") == 1
assert updated.count("function dashaStatus_") == 1
assert updated.count("function doGet(") == 1
assert "const DASHA_REWARD = 60" in updated
assert "function dashaTelegram_" in updated

source_path.write_text(updated, encoding="utf-8")
print("PASS: installed 20 x 10 quiz bank; 1–10 unchanged; verified level-10 migration; reward and history code untouched.")
