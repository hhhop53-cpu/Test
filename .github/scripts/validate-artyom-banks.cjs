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
if (!Array.isArray(sets) || sets.length !== 20) {
  throw new Error('Expected exactly 20 sets.');
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
for (let setNumber = 16; setNumber <= 20; setNumber++) {
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
console.log('PASS: 20 sets and 16 successive retry variants for each new adverb set.');
