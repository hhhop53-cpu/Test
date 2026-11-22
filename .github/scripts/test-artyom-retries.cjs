'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('apps-script/artyom/Code.js','utf8');

function makeSandbox(initialProps = {}) {
  const values = new Map(Object.entries(initialProps));
  const props = {
    getProperty: key => values.has(key) ? values.get(key) : null,
    setProperty: (key,value) => values.set(key,String(value))
  };
  const rows = [];
  const sheet = {
    getLastRow: () => rows.length + 1,
    appendRow: row => rows.push(row),
    getRange: (r,c,numRows,numCols) => ({
      getValues: () => rows.slice(r-2,r-2+numRows).map(row => row.slice(c-1,c-1+numCols))
    })
  };
  const context = {
    PropertiesService: {getScriptProperties: () => props},
    Utilities: {getUuid: () => 'test-epoch'},
    LockService: {getScriptLock: () => ({waitLock: ()=>{},releaseLock:()=>{}})},
    console:{error:()=>{}}
  };
  vm.createContext(context);
  vm.runInContext(source,context,{timeout:3000});
  vm.runInContext('getOrCreateSheet_ = function() {return __testSheet;}; rewardStatusFromSheet_ = function() {return {balance:500, earnedSets:{}};}; sendTelegramTestResult_ = function() {};',context);
  context.__testSheet=sheet;
  return {context,props,rows,values,run:script=>vm.runInContext(script,context,{timeout:3000})};
}
function assert(c,message){if(!c)throw new Error(message);}

const s=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'15',ARTYOM_BARELY_EXTRA_SET_NUMBER:'14'});
const before=s.run('currentSetPayload_()');
assert(before.setNumber===16 && before.totalSets===20 && before.questions.length===15,
       'Initial new adverb set should be 16/20 with 15 questions.');
const original=s.run('buildSetQuestions_(16)');
const bad=original.map(q=>({questionId:q.id,selectedIndex:(q.correctIndex+1)%4}));
s.context.__testRequest={attemptId:'attempt1001',testId:before.testId,setNumber:16,answers:bad,durationSeconds:130};
const failed=s.run('verifyAndSave_(__testRequest)');
assert(failed.ok && failed.score===0 && failed.total===15 && !failed.passed,'Failed attempt grading');
assert(failed.pointsPenalty===10,'Penalty is 10');
assert(s.values.get('ARTYOM_CURRENT_TEST_INDEX')==='15','Failure should keep same set');
const next=s.run('currentSetPayload_()');
assert(next.setNumber===16 && next.testId!==before.testId,'Retry should remain on 16 but change test ID.');
assert(next.questions.every((q,i)=>q.prompt!==before.questions[i].prompt ||
       JSON.stringify(q.options)!==JSON.stringify(before.questions[i].options)),
       'Every retry question or its answer options must be different from previous attempt');
const duplicate=s.run('verifyAndSave_(__testRequest)');
assert(duplicate.duplicate && s.rows.length===1 &&
       s.values.get('ARTYOM_ADVERB_RETRY_SET_16')==='1',
       'Duplicate request must not charge twice or rotate again');

const correct=s.run('buildSetQuestions_(16)').map(q=>({questionId:q.id,selectedIndex:q.correctIndex}));
s.context.__testRequest={attemptId:'attempt1002',testId:next.testId,setNumber:16,answers:correct,durationSeconds:99};
const passed=s.run('verifyAndSave_(__testRequest)');
assert(passed.passed && passed.score===15 && passed.pointsAwarded===60,'Perfect new variant should award 60.');
assert(s.values.get('ARTYOM_CURRENT_TEST_INDEX')==='16','Passing should advance to set17.');
assert(s.run('currentSetPayload_()').setNumber===17,'After passing set16, new set17 must open.');
assert(s.rows.length===2,'Exactly two attempts should be saved.');

const migrated=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'14',ARTYOM_BARELY_EXTRA_SET_NUMBER:'14'});
const legacyRow=Array(13).fill('');
legacyRow[8]=JSON.stringify({student:'Артём',setNumber:15,verified:true,passed:true});
migrated.rows.push(legacyRow);
const migratedPayload=migrated.run('currentSetPayload_()');
assert(migratedPayload.setNumber===16, 'Verified legacy set15 should unlock set16 automatically.');
assert(migrated.values.get('ARTYOM_CURRENT_TEST_INDEX')==='15','Legacy progress should be persisted.');

console.log('PASS: 0/15 stays on 16 with new questions; duplicates safe; 15/15 advances to 17; verified old 15 unlocks 16.');