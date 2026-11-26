'use strict';

const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('apps-script/artyom/Code.js', 'utf8');
const begin = source.indexOf('function q_(type, prompt,');
const finish = source.indexOf('\n// Pin the extra vocabulary question', begin);
if (begin < 0 || finish < 0) {
  throw new Error('Could not isolate the authored test bank.');
}

const bank = source.slice(begin, finish);
const testCode = bank + '\n({sets: TEST_SETS, makeFresh: buildNewAdverbQuestions_});';
const testData = vm.runInNewContext(testCode, {}, { timeout: 5000 });
const sets = testData.sets;
if (!Array.isArray(sets) || sets.length !== 30) {
  throw new Error('Expected exactly 30 sets.');
}

for (let index = 0; index < sets.length; index++) {
  const setNumber = index + 1;
  const set = sets[index];
  if (!set || typeof set.title !== 'string' ||
      !Array.isArray(set.questions) || set.questions.length !== 15) {
    throw new Error('Set ' + setNumber + ': expected 15 questions.');
  }
  const prompts = new Set();
  let active = 0;
  let passive = 0;
  for (const [questionIndex, q] of set.questions.entries()) {
    if (!q || typeof q.type !== 'string' || !q.prompt || prompts.has(q.prompt)) {
      throw new Error('Set ' + setNumber + ': duplicate/empty prompt at question ' + (questionIndex + 1));
    }
    prompts.add(q.prompt);
    if (!Array.isArray(q.options) || q.options.length !== 4 ||
        q.options.some(option => typeof option !== 'string' || !option.trim()) ||
        !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3 ||
        typeof q.explanation !== 'string' || !q.explanation.trim()) {
      throw new Error('Set ' + setNumber + ': invalid structure at question ' + (questionIndex + 1));
    }
    if (q.type.includes('Active') && !q.type.includes('Passive')) active++;
    if (q.type.includes('Passive')) passive++;
  }
  if (setNumber <= 5 && (active !== 8 || passive !== 7)) {
    throw new Error('Set ' + setNumber + ': expected 8 Active and 7 Passive questions.');
  }
}

if (!source.includes("q_('Vocabulary · barely'")) {
  throw new Error('The extra barely question is missing.');
}
for (let setNumber = 16; setNumber <= 30; setNumber++) {
  let prior = null;
  const seenFullVariants = new Set();
  for (let round = 0; round < 16; round++) {
    const questions = testData.makeFresh(setNumber, round);
    if (questions.length !== 15 || new Set(questions.map(q => q.prompt)).size !== 15) {
      throw new Error('Set ' + setNumber + ', round ' + round + ': malformed or duplicate questions.');
    }
    questions.forEach((q, index) => {
      if (!q.prompt || !q.type || !q.explanation || q.options.length !== 4 ||
          !Number.isInteger(q.correctIndex) ||
          q.correctIndex < 0 || q.correctIndex > 3 ||
          q.options.some(x => typeof x !== 'string' || !x.trim()) ||
          new Set(q.options).size !== 4) {
        throw new Error('Set ' + setNumber + ', round ' + round +
                        ': invalid question at position ' + (index + 1));
      }
    });
    const prompts = questions.map(q => q.prompt + ' :: ' + JSON.stringify(q.options));
    if (prior && prompts.some((p, i) => p === prior[i])) {
      throw new Error('Set ' + setNumber + ', round ' + round +
                      ': the next retry repeated an identical prompt and option set at the same slot.');
    }
    const signature = prompts.join(' :: ');
    if (seenFullVariants.has(signature)) {
      throw new Error('Set ' + setNumber + ', round ' + round + ': full test variant repeated.');
    }
    seenFullVariants.add(signature);
    prior = prompts;
  }
}
console.log('PASS: 30 sets, with 16 successive distinct retry variants for every adverb set 16–30.');


// Complete published tests now contain 16 retained adverb/foundation items
// (including a barely review) plus exactly four phrasal-verb items.
const phrasalContext = {
  PropertiesService: {
    getScriptProperties: () => ({
      getProperty: k => k==='ARTYOM_BARELY_EXTRA_SET_NUMBER'?'14':
        k==='ARTYOM_CURRENT_TEST_INDEX'?'20':
        /^ARTYOM_ADVERB_RETRY_SET_/.test(k) ? '0' : null,
      setProperty: ()=>{}
    })
  }
};
vm.createContext(phrasalContext);
vm.runInContext(source,phrasalContext,{timeout:5000});
const phraseCoverage = new Set();
const expectedWords = [
  'wake up','get up','turn on','look for','put on',
  'pick up','run into','come over','find out','look up',
  'turn down','figure out','give up','carry on','turn off'
];
const actualWords=vm.runInContext('PHRASAL_CHALLENGE_BANK_.map(x=>x[0])',phrasalContext);
if (JSON.stringify(actualWords)!==JSON.stringify(expectedWords))
  throw new Error('Phrasal verbs must exactly match the 15 bold phrases in the image.');
for (let setNumber=1;setNumber<=30;setNumber++){
  const rounds=setNumber>=16?16:1;
  let previous=null;
  for (let round=0;round<rounds;round++){
    phrasalContext.PropertiesService.getScriptProperties=()=>({
      getProperty: k => k==='ARTYOM_BARELY_EXTRA_SET_NUMBER'?'14':
        k==='ARTYOM_CURRENT_TEST_INDEX'?'20':
        k==='ARTYOM_ADVERB_RETRY_SET_'+setNumber ? String(round):null,
      setProperty:()=>{}
    });
    const questions=vm.runInContext('buildSetQuestions_('+setNumber+')',phrasalContext,{timeout:3000});
    if (questions.length!==20||new Set(questions.map(q=>q.id)).size!==20 ||
        new Set(questions.map(q=>q.prompt)).size!==20)
      throw new Error('Set '+setNumber+', round '+round+': should have exactly 20 distinct questions.');
    if (!questions.some(q=>q.type==='Vocabulary · barely'))
      throw new Error('Set '+setNumber+': missing the retained barely review question.');
    const extras=questions.slice(16);
    if (extras.length!==4||extras.some(q=>!q.type.startsWith('Phrasal verbs')))
      throw new Error('Set '+setNumber+': missing four phrasal-verb questions at the end.');
    questions.forEach((q,i)=>{
      if(q.options.length!==4||new Set(q.options).size!==4||
         !Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>3||
         !q.explanation||!q.prompt)
        throw new Error('Set '+setNumber+', round '+round+': invalid answer at '+i);
    });
    if (setNumber>=26&&setNumber<=30){
      extras.forEach((q,i)=>{
        const index=((setNumber-1)*4+i)%15;
        phraseCoverage.add(expectedWords[index]);
      });
    }
    if (previous&&extras.some((q,i)=>
        q.prompt===previous[i].prompt&&JSON.stringify(q.options)===JSON.stringify(previous[i].options)))
      throw new Error('Identical phrasal question repeated in the next retry, set '+setNumber);
    previous=extras;
  }
}
if (phraseCoverage.size!==15)
  throw new Error('The new tests 26–30 do not cover all 15 phrasal verbs.');
console.log('PASS: each of 30 sets has 20 questions; all 15 source phrasal verbs in sets 26–30; retries change.');
