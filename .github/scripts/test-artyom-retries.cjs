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
  vm.runInContext('var __originalRewardStatus=rewardStatusFromSheet_; getOrCreateSheet_ = function() {return __testSheet;}; rewardStatusFromSheet_ = function() {return {balance:500, earnedSets:{}};}; sendTelegramTestResult_ = function() {};',context);
  context.__testSheet=sheet;
  return {context,props,rows,values,run:script=>vm.runInContext(script,context,{timeout:3000})};
}
function assert(c,message){if(!c)throw new Error(message);}

const s=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'15',ARTYOM_BARELY_EXTRA_SET_NUMBER:'14'});
const before=s.run('currentSetPayload_()');
assert(before.setNumber===16 && before.totalSets===30 && before.questions.length===25,
       'Initial new adverb set should be 16/25 with 15 questions.');
const original=s.run('buildSetQuestions_(16)');
const bad=original.map(q=>({questionId:q.id,selectedIndex:(q.correctIndex+1)%4}));
s.context.__testRequest={attemptId:'attempt1001',testId:before.testId,setNumber:16,answers:bad,durationSeconds:130};
const failed=s.run('verifyAndSave_(__testRequest)');
assert(failed.ok && failed.score===0 && failed.total===25 && !failed.passed,'Failed attempt grading');
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
assert(passed.passed && passed.score===25 && passed.pointsAwarded===80,'Perfect new variant should award 80.');
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

console.log('PASS: 0/25 stays on 16 with new questions; duplicates safe; 25/25 advances to 17; verified old 15 unlocks 16.');

// Passing the previously final set 20 was recorded without advancing the
// saved index. The old 15/15 must now reveal the new level 21 automatically.
const prior20=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'19'});
const previousCompletion=Array(13).fill('');
previousCompletion[8]=JSON.stringify({
  student:'Артём',setNumber:20,verified:true,passed:true,score:15,total:15
});
prior20.rows.push(previousCompletion);
const unlocked=prior20.run('currentSetPayload_()');
assert(unlocked.setNumber===21 && unlocked.totalSets===30 &&
       unlocked.questions.length===25,'Verified former final set20 should unlock 21/25.');
assert(prior20.values.get('ARTYOM_CURRENT_TEST_INDEX')==='20',
       'Verified 20/20 migration must persist level 21.');

const notYetFinished=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'19'});
const failedOld20=Array(13).fill('');
failedOld20[8]=JSON.stringify({
  student:'Артём',setNumber:20,verified:true,passed:false,score:14,total:15
});
notYetFinished.rows.push(failedOld20);
assert(notYetFinished.run('currentSetPayload_()').setNumber===20,
       'A failed old set20 must NOT unlock set21.');

const newBlock=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'20'});
const fresh=newBlock.run('currentSetPayload_()');
assert(fresh.setNumber===21&&fresh.totalSets===30&&fresh.questions.length===25,
       'The new block must begin at 21/30 with 25 questions.');
const wrongAnswers=newBlock.run('buildSetQuestions_(21)')
  .map(q=>({questionId:q.id,selectedIndex:(q.correctIndex+1)%4}));
newBlock.context.__testRequest={
 attemptId:'attempt2101',testId:fresh.testId,setNumber:21,
 answers:wrongAnswers,durationSeconds:70
};
const badAttempt=newBlock.run('verifyAndSave_(__testRequest)');
assert(badAttempt.score===0&&badAttempt.pointsPenalty===10&&!badAttempt.passed,
       'Every unsuccessful attempt in set21 costs exactly 10 points.');
assert(newBlock.values.get('ARTYOM_CURRENT_TEST_INDEX')==='20',
       'After a failed attempt, stay on set21.');
const newVersion=newBlock.run('currentSetPayload_()');
assert(newVersion.setNumber===21&&newVersion.testId!==fresh.testId,
       'Set21 retry must provide a new test with an updated identity.');
assert(newVersion.questions.every((q,i)=>q.prompt!==fresh.questions[i].prompt ||
       JSON.stringify(q.options)!==JSON.stringify(fresh.questions[i].options)),
       'All retry questions must change prompts or options in set21.');
const reSent=newBlock.run('verifyAndSave_(__testRequest)');
assert(reSent.duplicate&&newBlock.rows.length===1&&
       newBlock.values.get('ARTYOM_ADVERB_RETRY_SET_21')==='1',
       'Duplicate failed submission must not apply an extra penalty.');
const rightAnswers=newBlock.run('buildSetQuestions_(21)')
  .map(q=>({questionId:q.id,selectedIndex:q.correctIndex}));
newBlock.context.__testRequest={
 attemptId:'attempt2102',testId:newVersion.testId,setNumber:21,
 answers:rightAnswers,durationSeconds:68
};
const succeeded=newBlock.run('verifyAndSave_(__testRequest)');
assert(succeeded.score===25&&succeeded.passed&&succeeded.pointsAwarded===80,
       'Passing on the second attempt must award the standard 80 points.');
assert(newBlock.values.get('ARTYOM_CURRENT_TEST_INDEX')==='21'&&
       newBlock.run('currentSetPayload_()').setNumber===22,
       'Passing set21 must unlock set22.');

// A 20/20 on former final set 25 now advances to the newly added set 26.
const finale=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'24'});
const finalTest=finale.run('currentSetPayload_()');
assert(finalTest.setNumber===25&&finalTest.totalSets===30,'Previously final set 25 must still be playable.');
finale.context.__testRequest={
 attemptId:'attempt2501',testId:finalTest.testId,setNumber:25,
 answers:finale.run('buildSetQuestions_(25)').map(q=>({
   questionId:q.id,selectedIndex:q.correctIndex
 })),durationSeconds:90
};
const finaleResult=finale.run('verifyAndSave_(__testRequest)');
assert(finaleResult.passed&&!finaleResult.topicCompleted&&finaleResult.pointsAwarded===80,
       'Perfect 25/30 must award 80 points and continue.');
assert(finale.run('currentSetPayload_()').setNumber===26,'Set25 must advance to 26.');

console.log('PASS: old set20 unlocks21 only with verified 15/15; set21 penalty/retry/+60/advance; last set25 completes.');


// A perfect 25/25 is required; 24/25 must cost 10 points and rotate the
// same set. Previously completed attempts (including old 15/15) must remain
// safe from duplicate credits or penalties after the release.
const partial=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'22',ARTYOM_BARELY_EXTRA_SET_NUMBER:'14'});
const base=partial.run('currentSetPayload_()');
assert(base.setNumber===23&&base.questions.length===25,'Set23 should contain 20 questions.');
const partialAnswers=partial.run('buildSetQuestions_(23)').map((q,i)=>({
 questionId:q.id,selectedIndex:i===19?(q.correctIndex+1)%4:q.correctIndex
}));
partial.context.__testRequest={
 attemptId:'attempt2301',testId:base.testId,setNumber:23,answers:partialAnswers,durationSeconds:75
};
const almost=partial.run('verifyAndSave_(__testRequest)');
assert(almost.score===24&&almost.total===25&&!almost.passed&&almost.pointsPenalty===10,
       '24/25 must stay on the level and cost exactly ten points.');
assert(partial.values.get('ARTYOM_CURRENT_TEST_INDEX')==='22',
       '24/25 must not advance to 24.');
const newAttempt=partial.run('currentSetPayload_()');
assert(newAttempt.testId!==base.testId&&newAttempt.setNumber===23,
       'On 24/25, a fresh test variant must be supplied for the same level.');
const dup=partial.run('verifyAndSave_(__testRequest)');
assert(dup.duplicate&&partial.rows.length===1,'Duplicate 24/25 must not cost another ten points.');
console.log('PASS: new morphology tests require 25/25; 24/25 => -10, fresh retry; idempotent duplicate.');


// Auto-unlock from the former final level 25 only after a real verified
// 20/20 row from the old deployment. No scores, earned rewards or penalties
// should be retroactively changed.
const migrated25=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'24'});
const prior25=Array(13).fill('');
prior25[8]=JSON.stringify({student:'Артём',setNumber:25,verified:true,passed:true,score:20,total:20});
migrated25.rows.push(prior25);
const restored=migrated25.run('currentSetPayload_()');
assert(restored.setNumber===26&&restored.totalSets===30&&restored.questions.length===25,
  'Historical verified 25/25 must automatically open set26 of 30.');
assert(migrated25.values.get('ARTYOM_CURRENT_TEST_INDEX')==='25',
  'Auto-migration after verified set25 must persist progress.');
const incomplete25=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'24'});
const invalid=Array(13).fill('');
invalid[8]=JSON.stringify({student:'Артём',setNumber:25,verified:true,passed:false,score:19,total:20});
incomplete25.rows.push(invalid);
assert(incomplete25.run('currentSetPayload_()').setNumber===25,
  'Failed final set25 must not unlock set26.');

const newReview=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'25'});
const newTest=newReview.run('currentSetPayload_()');
assert(newTest.setNumber===26&&newTest.totalSets===30&&newTest.questions.length===25,
  'New review block starts at 26/30 and 25 questions.');
newReview.context.__testRequest={
 attemptId:'attempt2601',testId:newTest.testId,setNumber:26,
 answers:newReview.run('buildSetQuestions_(26)').map((q,i)=>({
  questionId:q.id,selectedIndex:i===0?(q.correctIndex+1)%4:q.correctIndex
 })),durationSeconds:98
};
const oneMistake=newReview.run('verifyAndSave_(__testRequest)');
assert(oneMistake.score===24&&oneMistake.total===25&&oneMistake.pointsPenalty===10&&!oneMistake.passed,
  '24/25 on the new set26 must cost exactly 10 points and remain locked.');
const freshRetry=newReview.run('currentSetPayload_()');
assert(freshRetry.setNumber===26&&freshRetry.testId!==newTest.testId,
  'Wrong answer keeps set26 but provides a new quiz.');
const repeated=newReview.run('verifyAndSave_(__testRequest)');
assert(repeated.duplicate&&newReview.rows.length===1,
  'Retrying an already submitted payload must not charge another 10 points.');
newReview.context.__testRequest={
 attemptId:'attempt2602',testId:freshRetry.testId,setNumber:26,
 answers:newReview.run('buildSetQuestions_(26)').map(q=>({
  questionId:q.id,selectedIndex:q.correctIndex
 })),durationSeconds:91
};
const perfect=newReview.run('verifyAndSave_(__testRequest)');
assert(perfect.passed&&perfect.score===25&&perfect.pointsAwarded===80,
  '25/25 on set26 awards exactly +80.');
assert(newReview.run('currentSetPayload_()').setNumber===27,
  '25/25 on set26 advances to set27.');

const last=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'29'});
const final30=last.run('currentSetPayload_()');
assert(final30.setNumber===30&&final30.totalSets===30&&final30.questions.length===25,
  'Final set30 contains 25 questions.');
last.context.__testRequest={
 attemptId:'attempt3001',testId:final30.testId,setNumber:30,
 answers:last.run('buildSetQuestions_(30)').map(q=>({
  questionId:q.id,selectedIndex:q.correctIndex
 })),durationSeconds:120
};
const ending=last.run('verifyAndSave_(__testRequest)');
assert(ending.score===25&&ending.passed&&ending.topicCompleted&&ending.pointsAwarded===80,
  '25/25 on set30 is the final reward.');
console.log('PASS: verified 25 unlocks 26; 24/25=-10 and fresh retry; 25/25=+80; set30 completes.');


// Previously earned +60 remains +60, even when new perfect tests pay +80.
const historical=makeSandbox({ARTYOM_CURRENT_TEST_INDEX:'29'});
const oldGrant=Array(13).fill('');
oldGrant[8]=JSON.stringify({student:'Артём',setNumber:29,rewardEpoch:'test-epoch',
  rewardGranted:true,verified:true,passed:true,pointsAwarded:60,total:20,score:20});
historical.rows.push(oldGrant);
historical.run('readArtyomRewardJournal_=function(){return [];}; rewardStatusFromSheet_=__originalRewardStatus;');
const histResult=historical.run('rewardStatusFromSheet_(__testSheet,"test-epoch")');
assert(histResult.earned===60 && histResult.history.some(x=>x.type==='earn'&&x.amount===60),
  'Existing earned 60 must never become 80 retroactively.');
console.log('PASS: all historical 60-point rewards preserved after adding 80-point awards.');
