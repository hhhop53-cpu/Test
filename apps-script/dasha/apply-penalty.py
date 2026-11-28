"""Safely add -30 for each non-perfect Dasha attempt, preserving all history.

This script is intentionally constrained to the currently deployed 30-level
Dasha Apps Script. Never changes original bank, success bonus, original
progress, journal balances, or already-recorded test attempts.
"""
import json
import re
import sys
from pathlib import Path

source_path=Path(sys.argv[1])
bank_paths=[Path(p) for p in sys.argv[2:]]
assert len(bank_paths)==3
banks=[json.loads(p.read_text(encoding="utf8")) for p in bank_paths]
assert all(b.get("student")=="Даша" and len(b["levels"])==10 for b in banks)
levels=sum((b["levels"] for b in banks),[])
assert len(levels)==30 and all(len(a)==10 for a in levels)
source=source_path.read_text(encoding="utf8")
assert source.count("const DASHA_REWARD = 60;")==1
assert source.count("const DASHA_LEVELS = 30;")==1
assert source.count("function dashaSubmit_(")==1
assert source.count("function dashaStatus_(")==1
assert "const DASHA_PENALTY" not in source

def replace_one(old,new):
    global source
    assert source.count(old)==1, "Expected exactly one occurrence: "+old[:100]
    source=source.replace(old,new,1)

# Verify that this is still the exact existing 30-level bank.
match=re.search(r"\bconst\s+DASHA_BANK\s*=\s*\[",source)
assert match
start=source.index("[",match.start())
depth=0
quote=None
escape=False
end=None
for i in range(start,len(source)):
    ch=source[i]
    if quote is not None:
        if escape:
            escape=False
        elif ch=="\\":
            escape=True
        elif ch==quote:
            quote=None
        continue
    if ch in ("'",'"',chr(96)):
        quote=ch
    elif ch=="[":
        depth+=1
    elif ch=="]":
        depth-=1
        if depth==0:
            end=i+1
            break
assert end and json.loads(source[start:end])==levels, "Live bank mismatch — abort"

replace_one("const DASHA_REWARD = 60;","const DASHA_REWARD = 60;\nconst DASHA_PENALTY = 30;")

# Existing historical attempts have no penaltyApplied field. They remain
# unchanged and must not be charged retroactively.
replace_one(
    "const spent=legacySpent+journalSpent;",
    """const penaltyHistory=[];
  let penalties=0;
  for(const r of rows) {
    if(String(r[10])!==epoch)continue;
    let detail={};
    try{detail=JSON.parse(String(r[8]||'{}'));}catch(ignore){}
    if(detail && detail.verified===true && detail.penaltyApplied===true &&
       Number(detail.pointsPenalty)===DASHA_PENALTY) {
      penalties+=DASHA_PENALTY;
      penaltyHistory.push({type:'penalty',amount:DASHA_PENALTY,
        date:r[0] instanceof Date?r[0].toISOString():String(r[0]),
        reason:'Тест '+r[2]+' — результат '+r[4]+'/10'});
    }
  }
  const spent=legacySpent+journalSpent+penalties;"""
)
replace_one("history:history.concat(transactions).sort(",
            "history:history.concat(transactions,penaltyHistory).sort(")

# Append the penalty only after successful server-side answer verification,
# store it in the same single idempotent attempt row as the score.
submit_line=re.search(
    r"(?m)^([ \t]*)const status=dashaStatus_\(sh\),passed=score===10,awarded=passed&&!status\.awarded\[String\(level\)\]\?DASHA_REWARD:0,duration=[^\n]+;",
    source)
assert submit_line, "Unrecognized Dasha submit scoring logic"
old=submit_line.group(0)
replace_one(old, old+"\n  const pointsPenalty=passed?0:DASHA_PENALTY;")
changed,n=re.subn(r"JSON\.stringify\(\{\s*answers:checked,\s*verified:true\s*\}\)",
                 "JSON.stringify({answers:checked,verified:true,penaltyApplied:!passed,pointsPenalty:pointsPenalty})",
                 source)
assert n==1, "Only the Dasha submission row may be extended"
source=changed

replace_one(
    "pointsAwarded:awarded,pointsBalance:Math.max(0,status.balance+awarded)",
    "pointsAwarded:awarded,pointsPenalty:pointsPenalty,pointsBalance:Math.max(0,status.balance+awarded-pointsPenalty)"
)
replace_one(
    "pointsAwarded:Number(r[9]),pointsBalance:dashaStatus_(sh).balance",
    "pointsAwarded:Number(r[9]),pointsPenalty:Number(details.pointsPenalty||0),pointsBalance:dashaStatus_(sh).balance"
)

# The current notification should display the actual -30 penalty.
old_notify="'🎁 Начислено: +'+awarded+' баллов\\n⭐ Баланс Даши: '"
new_notify="'🎁 Начислено: +'+awarded+' баллов\\n⚠️ Штраф: -'+pointsPenalty+' баллов\\n⭐ Баланс Даши: '"
replace_one(old_notify,new_notify)

assert source.count("const DASHA_PENALTY = 30;")==1
assert source.count("pointsPenalty:pointsPenalty")==2
assert source.count("penaltyApplied:!passed")==1
assert source.count("function dashaSubmit_(")==1
assert source.count("function dashaStatus_(")==1
assert source.count("const DASHA_REWARD = 60;")==1
assert source.count("const DASHA_LEVELS = 30;")==1
source_path.write_text(source,encoding="utf8")
print("PASS: Dasha penalty -30 only on new failed unique attempts; historical rows/points unchanged; success +60 and level progression preserved.")
