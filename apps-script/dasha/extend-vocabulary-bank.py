"""Add Dasha vocabulary levels 31–40 (15 questions), preserving prior state.

Applies narrowly to live 30-level Dasha Apps Script version with -30 penalty.
Does not modify historical answer rows, scores, earned +60, journal, Telegram
credentials, or previous questions. The old final 30/30 unlocks level 31 only
after checking the saved 10/10 in the original Google Sheet.
"""
import json
import re
import sys
from pathlib import Path

source_path=Path(sys.argv[1])
bank_files=[Path(x) for x in sys.argv[2:]]
assert len(bank_files)==4, "Need the original three banks and one approved new bank"
banks=[json.loads(p.read_text(encoding="utf8")) for p in bank_files]
assert all(b["student"]=="Даша" and b["schemaVersion"]==1 for b in banks)
assert [len(b["levels"]) for b in banks]==[10,10,10,10]
levels=sum((b["levels"] for b in banks),[])
assert len(levels)==40
assert all(len(level)==(10 if i<30 else 15) for i,level in enumerate(levels))
assert len({q[0] for level in levels for q in level})==450
for q in (q for level in levels for q in level):
    assert len(q)==4 and len(q[1])==3 and len(set(q[1]))==3
    assert type(q[2]) is int and 0<=q[2]<=2 and q[0] and q[3]
new_bank=banks[3]
assert len(new_bank["words"])==50
assert len({x["english"] for x in new_bank["words"]})==50

source=source_path.read_text(encoding="utf8")
assert source.count("const DASHA_LEVELS = 30;")==1
assert source.count("const DASHA_REWARD = 60;")==1
assert source.count("const DASHA_PENALTY = 30;")==1
assert source.count("function dashaSubmit_(")==1
assert source.count("function dashaStatus_(")==1
assert source.count("function dashaLevel_(")==1
assert source.count("function doGet(")==1
assert source.count("function dashaTelegram_(")==1

def replace_one(old,new):
    global source
    n=source.count(old)
    assert n==1, "Unexpected live source; expected one match ("+str(n)+"): "+old[:100]
    source=source.replace(old,new,1)

# Ensure every one of the first thirty published sets is byte-equivalent at
# the parsed level to the approved original sources; do not invent history.
match=re.search(r"\bconst\s+DASHA_BANK\s*=\s*\[",source)
assert match, "Cannot find existing original Dasha question array"
start=source.index("[",match.start())
depth=0
quote=None
escaped=False
end=None
for pos in range(start,len(source)):
    ch=source[pos]
    if quote:
        if escaped:escaped=False
        elif ch=="\\":escaped=True
        elif ch==quote:quote=None
    elif ch in ("'",'"',chr(96)):quote=ch
    elif ch=="[":depth+=1
    elif ch=="]":
        depth-=1
        if depth==0:
            end=pos+1
            break
assert end and json.loads(source[start:end])==levels[:30],"Existing 30 live sets differ from their approved originals"
source=source[:start]+json.dumps(levels,ensure_ascii=False,separators=(",",":"))+source[end:]

replace_one("const DASHA_LEVELS = 30;","const DASHA_LEVELS = 40;")

# At the previous 30-set release, the last result remains at level 30.
# Auto-unlock only when the original sheet verifies that 30 was 10/10.
unlock_marker="  return Math.max(1, Math.min(DASHA_LEVELS, Math.floor(number) || 1));"
unlock="""  // The former final level 30 remains saved at 30 even after completion.
  // Open the new block only after confirming an original 10/10 result.
  // Neither historical grades nor previously earned points are modified.
  if (number === 30) {
    const sheet = dashaSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const attempts30 = sheet.getRange(2, 3, lastRow - 1, 4).getValues();
      const finished30 = attempts30.some(function(r) {
        return Number(r[0]) === 30 && Number(r[2]) === 10 &&
          Number(r[3]) === 10;
      });
      if (finished30) {
        props.setProperty(DASHA_PROGRESS, '31');
        number = 31;
      }
    }
  }
"""
replace_one(unlock_marker,unlock+unlock_marker)

# Only new block levels 31–40 have 15 questions. Levels 1–30 still validate
# exactly ten, and old result rows continue displaying the saved ten.
replace_one(
  "const a=data.answers;if(!Array.isArray(a)||a.length!==10)throw Error('Нужно ответить на 10 вопросов.');",
  "const expectedTotal=level>=31?15:10;const a=data.answers;if(!Array.isArray(a)||a.length!==expectedTotal)throw Error('Нужно ответить на '+expectedTotal+' вопросов.');"
)
replace_one(
  "if(!/^q(?:10|[1-9])$/.test(qid)||seen[qid])",
  "if(!/^q(?:1[0-5]|[1-9])$/.test(qid)||n>expectedTotal||seen[qid])"
)
replace_one("passed=score===10,awarded=", "passed=score===expectedTotal,awarded=")
replace_one("score,10,duration,id,", "score,expectedTotal,duration,id,")
replace_one("score,total:10,passed,level,", "score,total:expectedTotal,passed,level,")
replace_one(
  "score:Number(r[4]),total:10,passed:Number(r[4])===10,",
  "score:Number(r[4]),total:Number(r[5])||10,passed:Number(r[4])===Number(r[5])&&Number(r[5])>=10,"
)
# History must use the total from the saved row (10 for legacy; 15 for new).
replace_one("reason:'Тест '+level+' — 10/10'",
            "reason:'Тест '+level+' — '+r[5]+'/'+r[5]")
replace_one("reason:'Тест '+r[2]+' — результат '+r[4]+'/10'",
            "reason:'Тест '+r[2]+' — результат '+r[4]+'/'+(Number(r[5])||10)")
# The original Telegram message also displays the actual total.
replace_one("score+'/10\\n", "score+'/'+expectedTotal+'\\n")

assert source.count("const DASHA_LEVELS = 40;")==1
assert source.count("const DASHA_PENALTY = 30;")==1
assert source.count("const DASHA_REWARD = 60;")==1
assert source.count("const finished30 = attempts30.some")==1
assert source.count("expectedTotal=level>=31?15:10")==1
assert source.count("score,total:expectedTotal")==1
assert source.count("const pointsPenalty=passed?0:DASHA_PENALTY")==1
assert source.count("function dashaSubmit_(")==1
assert source.count("function dashaStatus_(")==1
source_path.write_text(source,encoding="utf8")
print("PASS: 40 levels (30x10 original + 10x15 new), verified old 30/30 unlocks 31, old +60/-30 rules and historical points untouched.")
