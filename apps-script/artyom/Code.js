const SHEET_NAME = 'Результаты Артёма';
const TEST_ID = 'active-passive-formula-a2plus-v1'; // legacy ID; old attempts remain intact
const PROGRESS_KEY = 'ARTYOM_CURRENT_TEST_INDEX';
const TOTAL_SETS = 25;
const PENALTY_POINTS = 10;
const PENALTY_START_SET = 11;
const REWARD_POINTS = 60;
const REWARD_EPOCH_KEY = 'ARTYOM_REWARD_EPOCH';
const SPENT_POINTS_KEY = 'ARTYOM_SPENT_POINTS';
const REWARD_JOURNAL_URL = 'https://raw.githubusercontent.com/hhhop53-cpu/Test/main/rewards/artyom-transactions.json';



/*
 * Five hand-authored sets. The first five sets contain 8 Active and 7 Passive questions.
 * Sets 6–10 cover mixed foundation grammar. Correct answers stay on the server.
 * Option indices are zero-based: A=0, B=1, C=2, D=3.
 */
function q_(type, prompt, a, b, c, d, correct, explanation) {
  return {
    type: type,
    prompt: prompt,
    options: [a, b, c, d],
    correctIndex: correct,
    explanation: explanation
  };
}

const TEST_SETS = [
  {
    title: 'Active & Passive Voice — Formula Challenge (A2+) · Set 1',
    questions: [
      q_('Active · Formula', 'Выбери базовую формулу Present Simple Active.',
        'Subject + am/is/are + V3',
        'Subject + V1(s/es)',
        'Subject + have/has + V3',
        'Subject + do/does + V2',
        1, 'Present Simple Active: subject + V1(s/es).'),
      q_('Active · Find the error', 'В какой формуле допущена ошибка, если речь идёт о Present Continuous Active?',
        'Subject + am/is/are + V-ing',
        'Subject + am/is/are + V3',
        'Subject + am/is/are + not + V-ing',
        'Am/Is/Are + subject + V-ing?',
        1, 'В Active Voice для Present Continuous нужен V-ing, а не V3.'),
      q_('Active · Negative', 'Как построить отрицание в Present Perfect Active?',
        'Subject + did not + V1',
        'Subject + have/has not + V3',
        'Subject + had not + V3',
        'Subject + am/is/are not + V-ing',
        1, 'Present Perfect Negative: subject + have/has + not + V3.'),
      q_('Active · Question', 'Выбери формулу общего вопроса в Past Simple Active.',
        'Was/Were + subject + V-ing?',
        'Had + subject + V3?',
        'Did + subject + V1?',
        'Have/Has + subject + V3?',
        2, 'Past Simple Question: Did + subject + V1? После did используется начальная форма глагола.'),
      q_('Active · Formula check', 'Какая запись правильно описывает Past Continuous Active?',
        'Subject + had been + V-ing',
        'Subject + was/were + V-ing',
        'Subject + was/were + V3',
        'Subject + have/has been + V-ing',
        1, 'Past Continuous Active: subject + was/were + V-ing.'),
      q_('Active · Formula', 'Укажи формулу Past Perfect Active.',
        'Subject + had + V3',
        'Subject + have/has + V3',
        'Subject + had been + V-ing',
        'Subject + was/were + V-ing',
        0, 'Past Perfect Active: subject + had + V3.'),
      q_('Active · Negative', 'Как образуется отрицание Future Simple Active?',
        'Subject + will not + V1',
        'Subject + will not + V3',
        'Subject + do not + V1',
        'Subject + will be not + V-ing',
        0, 'Future Simple Negative: subject + will not (won’t) + V1.'),
      q_('Active · Question', 'Выбери формулу общего вопроса в Future Perfect Active.',
        'Have/Has + subject + will + V3?',
        'Will + subject + have + V3?',
        'Will + subject + have been + V-ing?',
        'Will have + subject + V3?',
        1, 'Future Perfect Question: Will + subject + have + V3?'),
      q_('Passive · Formula', 'Выбери формулу Present Simple Passive.',
        'Subject + am/is/are + V3',
        'Subject + am/is/are + V-ing',
        'Subject + have/has + V3',
        'Subject + was/were + V3',
        0, 'Present Simple Passive: subject + am/is/are + V3.'),
      q_('Passive · Negative', 'Как образуется отрицание Past Simple Passive?',
        'Subject + did not + V3',
        'Subject + was/were not + V3',
        'Subject + had not + been + V3',
        'Subject + was/were not + being + V3',
        1, 'Past Simple Passive Negative: subject + was/were + not + V3.'),
      q_('Passive · Question', 'Как построить общий вопрос в Future Simple Passive?',
        'Will + subject + be + V3?',
        'Will + subject + being + V3?',
        'Do/Does + subject + be + V3?',
        'Will be + subject + V3?',
        0, 'Future Simple Passive Question: Will + subject + be + V3?'),
      q_('Passive · Formula', 'Выбери формулу Present Continuous Passive.',
        'Subject + have/has been + V3',
        'Subject + am/is/are + being + V3',
        'Subject + am/is/are + V3',
        'Subject + am/is/are + been + V3',
        1, 'Present Continuous Passive: subject + am/is/are + being + V3.'),
      q_('Passive · Find the error', 'Какая формула правильно передаёт Past Continuous Passive?',
        'Subject + was/were + V-ing',
        'Subject + had been + V3',
        'Subject + was/were + being + V3',
        'Subject + was/were + been + V3',
        2, 'Past Continuous Passive: subject + was/were + being + V3.'),
      q_('Passive · Formula', 'Выбери формулу Present Perfect Passive.',
        'Subject + have/has + V3',
        'Subject + have/has been + V3',
        'Subject + had been + V3',
        'Subject + have/has being + V3',
        1, 'Present Perfect Passive: subject + have/has + been + V3.'),
      q_('Passive · Modal', 'Как образуется Modal Passive после can, must или should?',
        'Subject + modal + to be + V3',
        'Subject + modal + be + V3',
        'Subject + modal + being + V3',
        'Subject + modal + have + V3',
        1, 'Modal Passive: subject + modal verb + be + V3.')
    ]
  },
  {
    title: 'Active & Passive Voice — Formula Challenge (A2+) · Set 2',
    questions: [
      q_('Active · Negative', 'Как построить отрицание Present Perfect Continuous Active?',
        'Subject + have/has not + V3',
        'Subject + have/has not been + V-ing',
        'Subject + had not been + V-ing',
        'Subject + am/is/are not + being + V3',
        1, 'Present Perfect Continuous Negative: subject + have/has + not + been + V-ing.'),
      q_('Active · Formula', 'Выбери полную формулу Past Perfect Continuous Active.',
        'Subject + had + V3',
        'Subject + had been + V-ing',
        'Subject + have/has been + V-ing',
        'Subject + was/were being + V3',
        1, 'Past Perfect Continuous Active: subject + had been + V-ing.'),
      q_('Active · Question', 'Как задать общий вопрос в Future Continuous Active?',
        'Will + subject + be + V-ing?',
        'Will be + subject + V-ing?',
        'Do/Does + subject + be + V-ing?',
        'Will + subject + have been + V-ing?',
        0, 'Future Continuous Question: Will + subject + be + V-ing?'),
      q_('Active · Formula', 'Какая формула соответствует Future Perfect Continuous Active?',
        'Subject + will have + V3',
        'Subject + will be + V-ing',
        'Subject + will have been + V-ing',
        'Subject + will has been + V-ing',
        2, 'Future Perfect Continuous Active: subject + will have been + V-ing.'),
      q_('Active · Find the error', 'В какой строке ошибка в формуле Present Simple Active?',
        'Subject + V1(s/es)',
        'Do/Does + subject + V1?',
        'Subject + do/does not + V1',
        'Subject + does + V1(s/es)',
        3, 'После does смысловой глагол всегда стоит в V1 без окончания -s/-es.'),
      q_('Active · Question', 'Выбери правильную формулу вопроса в Past Perfect Active.',
        'Had + subject + V3?',
        'Did + subject + had + V3?',
        'Have/Has + subject + V3?',
        'Had + subject + been + V-ing?',
        0, 'Past Perfect Question: Had + subject + V3?'),
      q_('Active · Negative', 'Как построить отрицание Past Continuous Active?',
        'Subject + did not + V-ing',
        'Subject + was/were not + V-ing',
        'Subject + had not + V-ing',
        'Subject + was/were not + V3',
        1, 'Past Continuous Negative: subject + was/were + not + V-ing.'),
      q_('Active · Question', 'Как образуется общий вопрос Future Simple Active?',
        'Do/Does + subject + V1?',
        'Will + subject + V1?',
        'Will + subject + V2?',
        'Will be + subject + V-ing?',
        1, 'Future Simple Question: Will + subject + V1?'),
      q_('Passive · Negative', 'Выбери отрицательную форму Present Perfect Passive.',
        'Subject + have/has not + V3',
        'Subject + have/has not been + V3',
        'Subject + had not been + V3',
        'Subject + have/has been not + V-ing',
        1, 'Present Perfect Passive Negative: subject + have/has + not + been + V3.'),
      q_('Passive · Formula', 'Какая формула используется для Past Perfect Passive?',
        'Subject + had + V3',
        'Subject + had been + V3',
        'Subject + was/were + being + V3',
        'Subject + have/has been + V3',
        1, 'Past Perfect Passive: subject + had been + V3.'),
      q_('Passive · Formula', 'Выбери формулу Future Perfect Passive.',
        'Subject + will have been + V3',
        'Subject + will be + V3',
        'Subject + will have + V3',
        'Subject + will have being + V3',
        0, 'Future Perfect Passive: subject + will have been + V3.'),
      q_('Passive · Question', 'Как построить вопрос Present Continuous Passive?',
        'Am/Is/Are + subject + being + V3?',
        'Have/Has + subject + been + V3?',
        'Am/Is/Are + subject + V-ing?',
        'Is/Are + subject + be + V3?',
        0, 'Present Continuous Passive Question: Am/Is/Are + subject + being + V3?'),
      q_('Passive · Modal negative', 'Выбери отрицательную формулу для предложения «The door must not be opened».',
        'Subject + must not + to be + V3',
        'Subject + must not + be + V3',
        'Subject + must be not + being + V3',
        'Subject + do not must + be + V3',
        1, 'Modal Passive Negative: subject + modal + not + be + V3.'),
      q_('Passive · Transformation', 'Преобразуй Active → Passive: “They clean the room every day.” Какая формула нужна?',
        'Object + is/are + V3',
        'Object + was/were + V3',
        'Object + has/have been + V3',
        'Object + is/are being + V3',
        0, 'Present Simple Active → Passive: object становится подлежащим; is/are + V3.'),
      q_('Passive · Formula check', 'Какой вариант правильно описывает отрицание Past Perfect Passive?',
        'Subject + had not + V3',
        'Subject + had not been + V3',
        'Subject + had been not + V3',
        'Subject + was not being + V3',
        1, 'Past Perfect Passive Negative: subject + had + not + been + V3.')
    ]
  },
  {
    title: 'Active & Passive Voice — Formula Challenge (A2+) · Set 3',
    questions: [
      q_('Active · Negative', 'Выбери отрицательную формулу Present Continuous Active.',
        'Subject + am/is/are not + V-ing',
        'Subject + do/does not + V-ing',
        'Subject + am/is/are not + V3',
        'Subject + have/has not + been + V-ing',
        0, 'Present Continuous Negative: subject + am/is/are + not + V-ing.'),
      q_('Active · Formula repair', 'Восстанови правильную формулу Past Perfect Active.',
        'Subject + had been + V3',
        'Subject + had + V3',
        'Subject + have/has + V3',
        'Subject + did + V2',
        1, 'Past Perfect Active строится как had + V3, без been перед V3.'),
      q_('Active · Question', 'Выбери формулу общего вопроса в Present Perfect Active.',
        'Do/Does + subject + V3?',
        'Have/Has + subject + V3?',
        'Had + subject + been + V-ing?',
        'Have/Has + subject + been + V-ing?',
        1, 'Present Perfect Question: Have/Has + subject + V3?'),
      q_('Active · Negative', 'Как образуется отрицание Future Perfect Active?',
        'Subject + will not have + V3',
        'Subject + will have not + V3',
        'Subject + will not be + V3',
        'Subject + will not have been + V-ing',
        0, 'Future Perfect Negative: subject + will not have + V3.'),
      q_('Active · Find the error', 'Какая формула содержит ошибку для Past Simple Active?',
        'Subject + V2',
        'Did + subject + V1?',
        'Subject + did not + V1',
        'Subject + did not + V2',
        3, 'После did/did not используется V1, а не V2.'),
      q_('Active · Formula', 'Выбери правильную формулу Future Continuous Active.',
        'Subject + will have been + V-ing',
        'Subject + will be + V-ing',
        'Subject + will be + V3',
        'Subject + will being + V-ing',
        1, 'Future Continuous Active: subject + will be + V-ing.'),
      q_('Active · Question', 'Как образуется общий вопрос Past Perfect Continuous Active?',
        'Had + subject + been + V-ing?',
        'Did + subject + have been + V-ing?',
        'Had + subject + being + V-ing?',
        'Have/Has + subject + been + V-ing?',
        0, 'Past Perfect Continuous Question: Had + subject + been + V-ing?'),
      q_('Active · Question', 'Выбери вопросительную форму Future Perfect Continuous Active.',
        'Will have + subject + been + V-ing?',
        'Will + subject + have been + V-ing?',
        'Have/Has + subject + will been + V-ing?',
        'Will + subject + be + V-ing?',
        1, 'Future Perfect Continuous Question: Will + subject + have been + V-ing?'),
      q_('Passive · Question', 'Выбери вопросительную форму Past Simple Passive.',
        'Did + subject + be + V3?',
        'Was/Were + subject + V3?',
        'Had + subject + been + V3?',
        'Was/Were + subject + being + V3?',
        1, 'Past Simple Passive Question: Was/Were + subject + V3?'),
      q_('Passive · Modal perfect', 'Как образуется Modal Perfect Passive, например “should have been done”?',
        'Subject + should + have + V3',
        'Subject + should + have been + V3',
        'Subject + should + be + V3',
        'Subject + should + have being + V3',
        1, 'Modal Perfect Passive: subject + modal + have been + V3.'),
      q_('Passive · Find the error', 'В какой формуле ошибка для Future Simple Passive?',
        'Subject + will be + V3',
        'Will + subject + be + V3?',
        'Subject + will not be + V3',
        'Subject + will be + being + V3',
        3, 'Future Simple Passive использует will be + V3; форма will be being + V3 здесь не является Future Simple Passive.'),
      q_('Passive · Transformation', 'Преобразуй Active → Passive: “The chef is preparing the meal.” Выбери нужную формулу.',
        'Object + is/are + V3',
        'Object + was/were + being + V3',
        'Object + is/are + being + V3',
        'Object + has/have been + V3',
        2, 'Present Continuous Active → Passive: object + am/is/are + being + V3.'),
      q_('Passive · Negative', 'Как образовать отрицание Modal Perfect Passive: “The task should not have been finished”?',
        'Subject + should not + have been + V3',
        'Subject + should + not have + V3',
        'Subject + should not + be + V3',
        'Subject + should have not been + V-ing',
        0, 'Modal Perfect Passive Negative: subject + modal + not + have been + V3.'),
      q_('Passive · Formula', 'Выбери формулу Future Simple Passive.',
        'Subject + will have been + V3',
        'Subject + will be + V3',
        'Subject + will being + V3',
        'Subject + will have + V3',
        1, 'Future Simple Passive: subject + will be + V3.'),
      q_('Passive · Question', 'Как построить общий вопрос Present Perfect Passive?',
        'Have/Has + subject + been + V3?',
        'Do/Does + subject + been + V3?',
        'Have/Has + subject + being + V3?',
        'Had + subject + been + V3?',
        0, 'Present Perfect Passive Question: Have/Has + subject + been + V3?')
    ]
  },
  {
    title: 'Active & Passive Voice — Formula Challenge (A2+) · Set 4',
    questions: [
      q_('Active · Question', 'Выбери вопросительную форму Present Perfect Continuous Active.',
        'Have/Has + subject + been + V-ing?',
        'Have/Has + subject + being + V3?',
        'Do/Does + subject + have been + V-ing?',
        'Had + subject + been + V-ing?',
        0, 'Present Perfect Continuous Question: Have/Has + subject + been + V-ing?'),
      q_('Active · Formula', 'Какая формула верна для Past Continuous Active?',
        'Subject + had been + V-ing',
        'Subject + was/were + V-ing',
        'Subject + was/were + being + V3',
        'Subject + did + V-ing',
        1, 'Past Continuous Active: subject + was/were + V-ing.'),
      q_('Active · Find the error', 'Найди ошибочную формулу Present Simple Active.',
        'Subject + V1(s/es)',
        'Subject + do/does not + V1',
        'Do/Does + subject + V1?',
        'Subject + do/does + V1(s/es)',
        3, 'В утвердительной форме Present Simple вспомогательный do/does обычно не ставится; после does глагол также должен быть V1.'),
      q_('Active · Negative', 'Как образуется отрицание Past Perfect Continuous Active?',
        'Subject + had not been + V-ing',
        'Subject + had not + V3',
        'Subject + was/were not + being + V3',
        'Subject + have/has not been + V-ing',
        0, 'Past Perfect Continuous Negative: subject + had + not + been + V-ing.'),
      q_('Active · Negative', 'Выбери отрицательную форму Future Simple Active.',
        'Subject + will not + V1',
        'Subject + will not + V2',
        'Subject + does not + will + V1',
        'Subject + will be not + V1',
        0, 'Future Simple Negative: subject + will not + V1.'),
      q_('Active · Question', 'Какая формула нужна для вопроса Future Perfect Active?',
        'Will + subject + have + V3?',
        'Will + subject + has + V3?',
        'Will have + subject + V3?',
        'Have + subject + will + V3?',
        0, 'Future Perfect Question: Will + subject + have + V3?'),
      q_('Active · Formula', 'Выбери правильную формулу Past Perfect Continuous Active.',
        'Subject + had been + V-ing',
        'Subject + had been + V3',
        'Subject + had being + V-ing',
        'Subject + have been + V-ing',
        0, 'Past Perfect Continuous Active: subject + had been + V-ing.'),
      q_('Active · Transformation', 'Чтобы преобразовать “She has written the report” в отрицание Active Voice, какую формулу использовать?',
        'Subject + has not + V3',
        'Subject + does not + V3',
        'Subject + has not been + V3',
        'Subject + had not + V3',
        0, 'Present Perfect Active Negative: subject + have/has + not + V3.'),
      q_('Passive · Formula', 'Выбери формулу Present Perfect Passive в отрицательной форме.',
        'Subject + have/has not been + V3',
        'Subject + have/has been not + V3',
        'Subject + have/has not + V3',
        'Subject + had not been + V3',
        0, 'Present Perfect Passive Negative: have/has + not + been + V3.'),
      q_('Passive · Transformation', 'Преобразуй Active → Passive: “They were repairing the road.” Какая формула подходит?',
        'Object + was/were + V3',
        'Object + was/were + being + V3',
        'Object + had been + V3',
        'Object + is/are + being + V3',
        1, 'Past Continuous Active → Passive: object + was/were + being + V3.'),
      q_('Passive · Question', 'Выбери общий вопрос Past Perfect Passive.',
        'Had + subject + been + V3?',
        'Did + subject + been + V3?',
        'Was/Were + subject + been + V3?',
        'Had + subject + being + V3?',
        0, 'Past Perfect Passive Question: Had + subject + been + V3?'),
      q_('Passive · Modal', 'Как построить вопрос с Modal Passive: “Can this problem be solved?”',
        'Can + subject + be + V3?',
        'Does + subject + can be + V3?',
        'Can + subject + being + V3?',
        'Can be + subject + V3?',
        0, 'Modal Passive Question: modal + subject + be + V3?'),
      q_('Passive · Formula repair', 'Исправь формулу: “The documents will have been checked.” Какое это время и залог?',
        'Future Simple Passive: will be + V3',
        'Future Perfect Passive: will have been + V3',
        'Present Perfect Passive: have/has been + V3',
        'Future Perfect Active: will have + V3',
        1, 'Future Perfect Passive: subject + will have been + V3.'),
      q_('Passive · Negative', 'Выбери отрицательную формулу Modal Passive.',
        'Subject + cannot be + V3',
        'Subject + can be not + V3',
        'Subject + do not can + be + V3',
        'Subject + cannot being + V3',
        0, 'Modal Passive Negative: subject + modal + not + be + V3.'),
      q_('Passive · Transformation', 'Преобразуй Active → Passive: “Someone had locked the gate.” Выбери формулу.',
        'Object + had + V3',
        'Object + had been + V3',
        'Object + was being + V3',
        'Object + has been + V3',
        1, 'Past Perfect Active → Passive: object + had been + V3.')
    ]
  },
  {
    title: 'Active & Passive Voice — Formula Challenge (A2+) · Set 5',
    questions: [
      q_('Active · Formula', 'Выбери формулу Future Perfect Continuous Active, не путая её с Future Perfect.',
        'Subject + will have + V3',
        'Subject + will be + V-ing',
        'Subject + will have been + V-ing',
        'Subject + will have been + V3',
        2, 'Future Perfect Continuous Active: subject + will have been + V-ing.'),
      q_('Active · Find the error', 'В какой записи ошибка в вопросе Present Perfect Active?',
        'Have/Has + subject + V3?',
        'Has + subject (he/she/it) + V3?',
        'Wh-word + have/has + subject + V3?',
        'Have/Has + subject + V2?',
        3, 'Present Perfect строится с have/has + V3; после have/has нельзя ставить V2.'),
      q_('Active · Question', 'Как построить общий вопрос Past Continuous Active?',
        'Was/Were + subject + V-ing?',
        'Did + subject + was/were + V-ing?',
        'Had + subject + been + V-ing?',
        'Was/Were + subject + V3?',
        0, 'Past Continuous Question: Was/Were + subject + V-ing?'),
      q_('Active · Negative', 'Выбери отрицательную формулу Future Perfect Continuous Active.',
        'Subject + will not have been + V-ing',
        'Subject + will have not + V3',
        'Subject + will not be + V-ing',
        'Subject + will not have + V3',
        0, 'Future Perfect Continuous Negative: subject + will not have been + V-ing.'),
      q_('Active · Formula check', 'Какой вариант правильно показывает отрицание Past Simple Active?',
        'Subject + was/were not + V2',
        'Subject + did not + V1',
        'Subject + did not + V2',
        'Subject + had not + V1',
        1, 'Past Simple Negative: subject + did not + V1.'),
      q_('Active · Transformation', 'Построй общий вопрос к предложению “They have finished the project”. Какая формула нужна?',
        'Have/Has + subject + V3?',
        'Do/Does + subject + V3?',
        'Had + subject + been + V3?',
        'Have/Has + subject + been + V-ing?',
        0, 'Present Perfect Active Question: Have/Has + subject + V3?'),
      q_('Active · Find the error', 'Какая формула неверна для Future Continuous Active?',
        'Subject + will be + V-ing',
        'Will + subject + be + V-ing?',
        'Subject + will not be + V-ing',
        'Subject + will being + V-ing',
        3, 'После will используется be + V-ing, а не being + V-ing.'),
      q_('Active · Formula repair', 'Исправь запись для Present Perfect Continuous Active.',
        'Subject + have/has been + V-ing',
        'Subject + have/has + being + V3',
        'Subject + had been + V-ing',
        'Subject + have/has been + V3',
        0, 'Present Perfect Continuous Active: subject + have/has been + V-ing.'),
      q_('Passive · Formula', 'Выбери формулу Present Simple Passive для подлежащего во множественном числе.',
        'Subject + is + V3',
        'Subject + are + V3',
        'Subject + are being + V3',
        'Subject + have been + V3',
        1, 'Present Simple Passive: для множественного числа обычно используются are + V3.'),
      q_('Passive · Transformation', 'Преобразуй Active → Passive: “The manager will sign the papers.” Какая формула подходит?',
        'Object + will + V1',
        'Object + will be + V3',
        'Object + will have been + V3',
        'Object + are + being + V3',
        1, 'Future Simple Active → Passive: object + will be + V3.'),
      q_('Passive · Formula', 'Выбери правильную формулу для Modal Perfect Passive.',
        'Subject + might have + V3',
        'Subject + might be + V3',
        'Subject + might have been + V3',
        'Subject + might have being + V3',
        2, 'Modal Perfect Passive: subject + modal + have been + V3.'),
      q_('Passive · Question', 'Как задать вопрос Future Perfect Passive?',
        'Will + subject + have been + V3?',
        'Will have + subject + been + V3?',
        'Have/Has + subject + will been + V3?',
        'Will + subject + be + V3?',
        0, 'Future Perfect Passive Question: Will + subject + have been + V3?'),
      q_('Passive · Find the error', 'В какой формуле ошибка для Present Perfect Passive?',
        'Subject + have/has been + V3',
        'Have/Has + subject + been + V3?',
        'Subject + have/has not been + V3',
        'Subject + have/has being + V3',
        3, 'В Perfect Passive используется been + V3, а не being + V3.'),
      q_('Passive · Transformation', 'Преобразуй Active → Passive: “They are building a new school.” Выбери формулу.',
        'Object + is/are + V3',
        'Object + is/are + being + V3',
        'Object + has/have been + V3',
        'Object + was/were being + V3',
        1, 'Present Continuous Active → Passive: object + am/is/are + being + V3.'),
      q_('Passive · Formula repair', 'Как правильно записать отрицание Future Perfect Passive?',
        'Subject + will not have been + V3',
        'Subject + will have not been + V-ing',
        'Subject + will not be + V3',
        'Subject + will not have + V3',
        0, 'Future Perfect Passive Negative: subject + will not have been + V3.')
    ]
  },
  {
    title: 'Основы грамматики — смешанный тест (A1–A2+) · Уровень 1 из 5',
    questions: [
      q_("Личные местоимения · перевод", "Выбери перевод: «Она живёт в Москве».", "She lives in Moscow.", "Her lives in Moscow.", "He lives in Moscow.", "They lives in Moscow.", 0, "She — личное местоимение «она»."),
      q_("Множественное число · формы · EN→RU", "Переведи на русский: “There are two men in the park.”", "В парке две женщины.", "В парке один мужчина.", "В парке два мальчика.", "В парке двое мужчин.", 3, "Two men — «двое мужчин»."),
      q_("Дополнительная смешанная практика", "Вставь: ___ is my brother in this photo.", "Those", "These", "This", "They", 2, "This — один человек на фото."),
      q_("This/that/these/those · выбор", "Вставь: ___ are my shoes here by the door.", "These", "This", "That", "It", 0, "These — несколько предметов рядом."),
      q_("To be · вопросы и отрицания", "Составь вопрос: «Ты готов?»", "Are you ready?", "Is you ready?", "You are ready?", "Do you ready?", 0, "В вопросе are ставится перед you."),
      q_("Mine/yours/hers/ours · выбор", "Вставь: These seats belong to us. They are ___.", "our", "we", "ours", "us", 2, "Ours — «наши» без существительного."),
      q_("Множественное число · формы", "Переведи: «Пять мышей».", "five mouses", "five mouse", "five mice", "five mices", 2, "Mouse → mice."),
      q_("Личные местоимения · перевод", "Выбери перевод: «Это моя собака. Она маленькая».", "This is my dog. He is small.", "This is my dog. It is small.", "This is my dog. They are small.", "This is my dog. I am small.", 1, "Для животного, когда пол не уточняется, можно использовать it."),
      q_("Притяжательные прилагательные · выбор", "Вставь: I love ___ family.", "my", "mine", "me", "I", 0, "My — притяжательное прилагательное перед family."),
      q_("Множественное число · формы", "Выбери множественное число слова bus.", "buses", "buss", "busies", "bussies", 0, "Bus → buses."),
      q_("To be · вопросы и отрицания", "Переведи: «Я дома».", "I am at home.", "I is at home.", "I are at home.", "Me am at home.", 0, "I am at home."),
      q_("Mine/yours/hers/ours · выбор", "Вставь: The red bike belongs to him. It is ___.", "her", "he", "his", "him", 2, "His может употребляться самостоятельно."),
      q_("This/that/these/those · выбор", "Выбери перевод: «Эти яблоки вкусные».", "This apples are tasty.", "That apples are tasty.", "These apples are tasty.", "Those apple are tasty.", 2, "These apples — несколько предметов рядом."),
      q_("Артикли · a/an/the/—", "Вставь: Please close ___ door. (Речь о двери этой комнаты.)", "a", "an", "the", "—", 2, "Известная конкретная дверь — the."),
      q_("Множественное число · формы", "Вставь: The ___ are playing. (child)", "children", "childs", "childrens", "child", 0, "Children — множественное число от child.")
    ]
  },
  {
    title: 'Основы грамматики — смешанный тест (A1–A2+) · Уровень 2 из 5',
    questions: [
      q_("Личные местоимения · перевод · EN→RU", "Переведи на русский: “I am ten years old.”", "Мне десять лет.", "Мне двенадцать лет.", "Ему десять лет.", "Я был десять лет.", 0, "I am ten years old — «Мне десять лет»."),
      q_("This/that/these/those · выбор · EN→RU", "Переведи на русский: “This is my pencil.”", "Это мой карандаш.", "Это моя ручка.", "Это твой карандаш.", "Те карандаши мои.", 0, "This is my pencil — «Это мой карандаш»."),
      q_("Личные местоимения · перевод", "Переведи: «Мы играем в теннис».", "Us play tennis.", "They play tennis.", "We play tennis.", "Our play tennis.", 2, "We — «мы», подлежащее."),
      q_("Притяжательные прилагательные · выбор", "Выбери перевод: «Это наша школа».", "This is their school.", "This is our school.", "This is your school.", "This is his school.", 1, "Our — «наш»."),
      q_("Артикли · a/an/the/—", "Вставь: I saw a dog. ___ dog was black.", "The", "A", "An", "—", 0, "При повторном упоминании конкретной собаки — the."),
      q_("Дополнительная смешанная практика", "Вставь: He has ___ orange.", "an", "a", "the", "—", 0, "Orange начинается с гласного звука."),
      q_("This/that/these/those · выбор", "Вставь: ___ books on this desk are mine.", "That", "This", "These", "It", 2, "These — множественное число рядом."),
      q_("To be · вопросы и отрицания", "Выбери перевод: «Она не устала».", "She are not tired.", "She not is tired.", "She is not tired.", "She does not tired.", 2, "She is not tired."),
      q_("Mine/yours/hers/ours · выбор", "Вставь: Is this your phone or ___? (мой)", "mine", "my", "me", "I", 0, "Mine — «мой» без существительного."),
      q_("This/that/these/those · выбор", "Переведи: «Эта чашка моя».", "This cup is mine.", "These cup is mine.", "That cups is mine.", "Those cup is mine.", 0, "This cup — один предмет рядом."),
      q_("Артикли · a/an/the/—", "Выбери: I drink ___ water every morning.", "—", "a", "an", "the", 0, "Water в общем значении неисчисляемое, без артикля."),
      q_("Личные местоимения · перевод", "Вставь слово: My parents are here. ___ are waiting.", "They", "Them", "Their", "We", 0, "My parents заменяется на they."),
      q_("Притяжательные прилагательные · выбор", "Переведи: «Его сестра учится здесь».", "Her sister studies here.", "Their sister studies here.", "Our sister studies here.", "His sister studies here.", 3, "His — «его»."),
      q_("Множественное число · формы", "Выбери множественное число слова baby.", "babys", "babyes", "babyeses", "babies", 3, "Baby → babies."),
      q_("To be · вопросы и отрицания", "Вставь: I ___ not hungry.", "am", "is", "are", "be", 0, "I am not hungry.")
    ]
  },
  {
    title: 'Основы грамматики — смешанный тест (A1–A2+) · Уровень 3 из 5',
    questions: [
      q_("To be · вопросы и отрицания", "Вставь форму to be: My sister ___ eight.", "am", "are", "is", "be", 2, "My sister = she, поэтому is."),
      q_("This/that/these/those · выбор", "Выбери перевод: «Те дома далеко».", "This houses are far away.", "These houses are far away.", "That houses are far away.", "Those houses are far away.", 3, "Those — множественное число далеко."),
      q_("To be · вопросы и отрицания", "Переведи: «Мы не опоздали».", "We is not late.", "We not are late.", "We am not late.", "We are not late.", 3, "We are not late."),
      q_("Mine/yours/hers/ours · выбор", "Выбери перевод: «Эта сумка её».", "This bag is her.", "This bag is hers.", "This bag is she.", "This bag is his bag hers.", 1, "Hers — самостоятельное притяжательное местоимение."),
      q_("Множественное число · формы", "Выбери множественное число слова city.", "citys", "cities", "cityes", "citis", 1, "City → cities."),
      q_("Личные местоимения · перевод", "Вставь подлежащее: My brother is kind. ___ helps me.", "He", "Him", "His", "It", 0, "He заменяет my brother как подлежащее."),
      q_("Притяжательные прилагательные · выбор", "Переведи: «Их родители дома».", "Our parents are at home.", "Your parents are at home.", "His parents are at home.", "Their parents are at home.", 3, "Their — «их»."),
      q_("Артикли · a/an/the/—", "Выбери правильный вариант: ___ sun is bright today.", "A", "An", "The", "—", 2, "Солнце в обычном контексте — the sun."),
      q_("Личные местоимения · перевод", "Вставь слово: Anna and I are classmates. ___ study together.", "They", "Us", "We", "Our", 2, "Anna and I = we."),
      q_("Притяжательные прилагательные · выбор", "Выбери перевод: «Твоя книга на столе».", "You book is on the table.", "Your book is on the table.", "Yours book is on the table.", "You are book on the table.", 1, "Your стоит перед существительным."),
      q_("Множественное число · формы", "Переведи: «Две женщины».", "two womans", "two women", "two womens", "two woman", 1, "Woman → women."),
      q_("To be · вопросы и отрицания", "Найди правильный вопрос: «Они в школе?»", "Is they at school?", "Are they at school?", "Do they at school?", "They are at school?", 1, "Are they at school?"),
      q_("Mine/yours/hers/ours · выбор", "Выбери перевод: «Эти игрушки наши».", "These toys are our.", "These toys are we.", "These toys are us.", "These toys are ours.", 3, "Ours употребляется без существительного."),
      q_("This/that/these/those · выбор", "Вставь: Who is ___ man near the gate over there?", "these", "those", "this", "that", 3, "That man — один человек вдали."),
      q_("Артикли · a/an/the/—", "Вставь: My brother plays ___ football.", "—", "a", "an", "the", 0, "Названия видов спорта обычно без артикля.")
    ]
  },
  {
    title: 'Основы грамматики — смешанный тест (A1–A2+) · Уровень 4 из 5',
    questions: [
      q_("Артикли · a/an/the/—", "Вставь артикль: She has ___ umbrella.", "a", "the", "an", "—", 2, "Umbrella начинается с гласного звука, нужен an."),
      q_("Притяжательные прилагательные · выбор", "Вставь: Anna has a bike. ___ bike is blue.", "Her", "His", "Their", "Our", 0, "Anna = she; her bike."),
      q_("Артикли · a/an/the/—", "Выбери: He is ___ university student.", "an", "the", "—", "a", 3, "University начинается со звука /j/, поэтому a."),
      q_("Дополнительная смешанная практика", "Выбери перевод: «Эта книга принадлежит мне».", "This book is my.", "This book is me.", "This book is I.", "This book is mine.", 3, "Mine употребляется самостоятельно."),
      q_("This/that/these/those · выбор", "Переведи: «Та машина там красная».", "This car over there is red.", "That car over there is red.", "Those car over there is red.", "These car over there is red.", 1, "That — один предмет далеко."),
      q_("To be · вопросы и отрицания", "Вставь: There ___ two books on the table.", "is", "are", "am", "be", 1, "Two books — множественное число, are."),
      q_("Mine/yours/hers/ours · выбор", "Переведи: «Этот дом их».", "This house is their.", "This house is them.", "This house is they.", "This house is theirs.", 3, "Theirs — самостоятельное «их»."),
      q_("Множественное число · формы", "Вставь: I have two ___. (foot)", "foots", "foot", "feets", "feet", 3, "Foot → feet."),
      q_("To be · вопросы и отрицания", "Вставь: ___ your father at work?", "Are", "Am", "Do", "Is", 3, "Your father = he, вопрос начинается с Is."),
      q_("Mine/yours/hers/ours · выбор", "Выбери: This is his jacket. That one is ___. (твой)", "your", "yours", "you", "yourself", 1, "Yours — самостоятельное «твой»."),
      q_("This/that/these/those · выбор", "Вставь: ___ are my friends standing over there.", "This", "Those", "That", "It", 1, "Those — несколько людей вдали."),
      q_("Артикли · a/an/the/—", "Вставь: This is ___ European city.", "an", "a", "the", "—", 1, "European начинается со звука /j/, нужен a."),
      q_("Личные местоимения · перевод", "Выбери английский перевод: «Он не дома».", "Him is not at home.", "He is not at home.", "His is not at home.", "He are not at home.", 1, "He — подлежащее, is not — отрицание."),
      q_("To be · вопросы и отрицания", "Выбери отрицание: «Он не учитель».", "He not teacher.", "He are not a teacher.", "He does not a teacher.", "He is not a teacher.", 3, "He is not a teacher."),
      q_("To be · вопросы и отрицания", "Переведи: «Это твои ключи?»", "Is these your keys?", "Are these your keys?", "Are this your keys?", "These are your keys?", 1, "These — множественное число, Are these...?")
    ]
  },
  {
    title: 'Основы грамматики — смешанный тест (A1–A2+) · Уровень 5 из 5',
    questions: [
      q_("Множественное число · формы", "Выбери множественное число слова child.", "childs", "childes", "children", "childrens", 2, "Child → children."),
      q_("Mine/yours/hers/ours · выбор", "Вставь: This pen is not yours. It is ___.", "mine", "my", "me", "I", 0, "Mine употребляется без существительного."),
      q_("Множественное число · формы", "Переведи: «Три коробки».", "three box", "three boxs", "three boxies", "three boxes", 3, "Box → boxes."),
      q_("Личные местоимения · перевод", "Выбери правильный перевод: «Они мои друзья».", "Them are my friends.", "They is my friends.", "Their are my friends.", "They are my friends.", 3, "They — «они», с ним используется are."),
      q_("Притяжательные прилагательные · выбор", "Вставь: Tom forgot ___ bag.", "her", "their", "his", "our", 2, "Tom = he; his bag."),
      q_("Артикли · a/an/the/—", "Вставь: We have ___ hour before dinner.", "a", "an", "the", "—", 1, "В hour h не произносится, поэтому an."),
      q_("Дополнительная смешанная практика", "Выбери множественное число слова tooth.", "tooths", "teeth", "toothes", "teeths", 1, "Tooth → teeth."),
      q_("This/that/these/those · выбор", "Выбери: Look at ___ bird over there!", "these", "this", "those", "that", 3, "That bird — одна птица вдали."),
      q_("Артикли · a/an/the/—", "Вставь: My mother is ___ doctor.", "an", "the", "—", "a", 3, "Перед профессией в единственном числе — a doctor."),
      q_("Личные местоимения · перевод", "Переведи: «Ты очень добрый».", "I am very kind.", "Your are very kind.", "You is very kind.", "You are very kind.", 3, "You требует are."),
      q_("Притяжательные прилагательные · выбор", "Вставь: The cat is eating ___ food.", "their", "his", "its", "our", 2, "Its — притяжательная форма it."),
      q_("Множественное число · формы", "Вставь: We saw three ___. (sheep)", "sheeps", "sheepes", "sheep", "sheepies", 2, "Sheep не меняется во множественном числе."),
      q_("To be · вопросы и отрицания", "Вставь: The weather ___ not cold today.", "are", "am", "is", "be", 2, "The weather — единственное число, is."),
      q_("Артикли · a/an/the/—", "Выбери: She bought ___ apple yesterday.", "a", "the", "—", "an", 3, "Apple начинается с гласного звука, нужен an."),
      q_("Артикли · a/an/the/—", "Вставь: There is ___ cat under the table. (Кот упоминается впервые.)", "the", "a", "an", "—", 1, "Впервые упомянутый исчисляемый предмет — a.")
    ]
  },
  {
    title: "Наречия A2–B1 · Уровень 1 из 5",
    questions: [
      q_("Вставь пропущенное", "I have ___ started learning tennis.", "recently", "rarely", "therefore", "hardly", 0, "По смыслу подходит «recently»."),
      q_("Вставь пропущенное", "She ___ goes to the cinema because she is busy.", "therefore", "rarely", "recently", "certainly", 1, "По смыслу подходит «rarely»."),
      q_("Вставь пропущенное", "I have felt tired ___.", "therefore", "maybe", "lately", "seldom", 2, "По смыслу подходит «lately»."),
      q_("Вставь пропущенное", "I can ___ see the road in this fog.", "certainly", "recently", "therefore", "hardly", 3, "По смыслу подходит «hardly»."),
      q_("Найди ошибку", "Найди предложение с ошибкой в употреблении наречия.", "I hardly can hear you.", "I can hardly hear you.", "I rarely watch TV.", "Maybe he is busy.", 0, "Hardly обычно ставится после модального can: I can hardly hear you."),
      q_("Найди ошибку", "Найди ошибочный перевод слова hardly.", "certainly = конечно", "hardly = усердно", "rarely = редко", "lately = в последнее время", 1, "Hardly означает «едва, почти не», а hard может означать «усердно»."),
      q_("Найди ошибку", "Найди предложение с ошибкой.", "We seldom eat meat.", "I have seen him recently.", "She goes rarely to school.", "She rarely goes to school.", 2, "Наречие частотности rarely обычно стоит перед смысловым глаголом."),
      q_("Найди ошибку", "Найди неверное употребление.", "He hardly ever goes out.", "Perhaps it is true.", "I have been tired lately.", "He hardly ever never goes out.", 3, "Hardly ever уже означает «почти никогда»; never здесь лишнее."),
      q_("RU → EN", "Переведи на английский: «Я недавно купил книгу».", "I recently bought a book.", "I rarely bought a book.", "I lately buy a book.", "I hardly bought a book.", 0, "Правильный перевод: I recently bought a book."),
      q_("RU → EN", "Переведи на английский: «Она редко играет в теннис».", "She certainly plays tennis.", "She rarely plays tennis.", "She recently plays tennis.", "She hardly plays tennis.", 1, "Правильный перевод: She rarely plays tennis."),
      q_("RU → EN", "Переведи на английский: «Возможно, он дома».", "Hardly he is at home.", "Seldom he is at home.", "Maybe he is at home.", "Therefore he is at home.", 2, "Правильный перевод: Maybe he is at home."),
      q_("RU → EN", "Переведи на английский: «Я едва тебя слышу».", "I can hard hear you.", "I hardly ever hear you now.", "I certainly hear you.", "I can hardly hear you.", 3, "Правильный перевод: I can hardly hear you."),
      q_("EN → RU", "Переведи на русский: I have been very busy lately.", "В последнее время я был очень занят.", "Недавно я был очень занят один раз.", "Я редко бываю очень занят.", "Я, конечно, очень занят.", 0, "Правильный перевод: В последнее время я был очень занят."),
      q_("EN → RU", "Переведи на русский: He hardly ever eats fish.", "Он, конечно, ест рыбу.", "Он почти никогда не ест рыбу.", "Он усердно ест рыбу.", "Он недавно ел рыбу.", 1, "Правильный перевод: Он почти никогда не ест рыбу."),
      q_("EN → RU", "Переведи на русский: Perhaps we will go tomorrow.", "Мы редко ходим завтра.", "Мы точно пойдём завтра.", "Возможно, мы пойдём завтра.", "Следовательно, мы пойдём завтра.", 2, "Правильный перевод: Возможно, мы пойдём завтра.")
    ]
  },
  {
    title: "Наречия A2–B1 · Уровень 2 из 5",
    questions: [
      q_("Вставь пропущенное", "He ___ drinks coffee; perhaps once a year.", "certainly", "recently", "therefore", "seldom", 3, "По смыслу подходит «seldom»."),
      q_("Вставь пропущенное", "___, we can meet after school. I am not sure.", "Maybe", "Therefore", "Certainly", "Hardly", 0, "По смыслу подходит «Maybe»."),
      q_("Вставь пропущенное", "She has ___ finished her homework.", "hardly ever", "recently", "seldom", "therefore", 1, "По смыслу подходит «recently»."),
      q_("Вставь пропущенное", "They ___ ever eat fast food.", "certainly", "therefore", "hardly", "recently", 2, "По смыслу подходит «hardly»."),
      q_("Найди ошибку", "Где ошибка?", "He is rarely late.", "I seldom get angry.", "Maybe she will come.", "He rarely is late.", 3, "С глаголом to be наречие частотности обычно ставится после него: is rarely."),
      q_("Найди ошибку", "Найди неверное предложение.", "I have lately bought this phone yesterday.", "I bought this phone yesterday.", "I have been busy lately.", "I recently bought a phone.", 0, "Yesterday задаёт конкретное прошлое время, поэтому обычно Past Simple; lately здесь неуместно."),
      q_("Найди ошибку", "Найди ошибку.", "I am certainly tired.", "Therefore I am maybe tired.", "Maybe I am tired.", "Perhaps I am tired.", 1, "Maybe — «возможно», therefore — логический вывод; сочетание в этом контексте неуместно."),
      q_("Найди ошибку", "Где неправильный перевод?", "recently = недавно", "hardly ever = почти никогда", "seldom = всегда", "perhaps = возможно", 2, "Seldom означает «редко», не «всегда»."),
      q_("RU → EN", "Переведи на английский: «В последнее время я много работаю».", "I have been working a lot rarely.", "I worked a lot therefore.", "I am working seldom a lot.", "I have been working a lot lately.", 3, "Правильный перевод: I have been working a lot lately."),
      q_("RU → EN", "Переведи на английский: «Он почти никогда не опаздывает».", "He hardly ever arrives late.", "He hardly arrives late ever.", "He recently arrives late.", "He certainly arrives late.", 0, "Правильный перевод: He hardly ever arrives late."),
      q_("RU → EN", "Переведи на английский: «Конечно, я помогу».", "I will recently help.", "I will certainly help.", "I will hardly help.", "I will seldom help.", 1, "Правильный перевод: I will certainly help."),
      q_("RU → EN", "Переведи на английский: «Мы редко едим вне дома».", "We therefore eat out.", "We certainly eat out.", "We seldom eat out.", "We lately eat out.", 2, "Правильный перевод: We seldom eat out."),
      q_("EN → RU", "Переведи на русский: She can hardly walk.", "Она много ходит пешком.", "Она редко ходит пешком.", "Она, конечно, умеет ходить.", "Она едва может ходить.", 3, "Правильный перевод: Она едва может ходить."),
      q_("EN → RU", "Переведи на русский: They seldom visit us.", "Они редко нас навещают.", "Они недавно нас навестили.", "Они обязательно нас навестят.", "Они едва нас видят.", 0, "Правильный перевод: Они редко нас навещают."),
      q_("EN → RU", "Переведи на русский: I will certainly call you.", "Я недавно тебе звонил.", "Я обязательно тебе позвоню.", "Возможно, я тебе позвоню.", "Я почти никогда тебе не звоню.", 1, "Правильный перевод: Я обязательно тебе позвоню.")
    ]
  },
  {
    title: "Наречия A2–B1 · Уровень 3 из 5",
    questions: [
      q_("Вставь пропущенное", "I have not seen him ___.", "seldom", "certainly", "lately", "therefore", 2, "По смыслу подходит «lately»."),
      q_("Вставь пропущенное", "The train was cancelled; ___, we took a bus.", "hardly", "recently", "seldom", "therefore", 3, "По смыслу подходит «therefore»."),
      q_("Вставь пропущенное", "I will ___ call you tonight. You can count on it.", "certainly", "perhaps", "hardly", "rarely", 0, "По смыслу подходит «certainly»."),
      q_("Вставь пропущенное", "___ she knows the answer, but I am not sure.", "Seldom", "Perhaps", "Therefore", "Certainly", 1, "По смыслу подходит «Perhaps»."),
      q_("Найди ошибку", "Найди ошибку в английском предложении.", "He rarely misses school.", "We seldom miss school.", "He hardly ever go to school.", "He hardly ever goes to school.", 2, "В Present Simple после he нужен goes."),
      q_("Найди ошибку", "Найди неправильный порядок слов.", "I have been very busy lately.", "She rarely plays football.", "He is certainly right.", "I am lately very busy.", 3, "Для периода «в последнее время» естественно I have been very busy lately."),
      q_("Найди ошибку", "Где ошибка?", "She can certainly to help us.", "She can certainly help us.", "Maybe we should wait.", "They seldom argue.", 0, "После can употребляется глагол без to: can help."),
      q_("Найди ошибку", "Найди неверный перевод.", "hardly = едва", "therefore = хотя", "certainly = конечно", "rarely = редко", 1, "Therefore — «поэтому, следовательно»; although — «хотя»."),
      q_("RU → EN", "Переведи на английский: «Был дождь, поэтому мы остались дома».", "It rained; rarely, we stayed home.", "It rained; hardly, we stayed home.", "It rained; therefore, we stayed home.", "It rained; perhaps, we stayed home.", 2, "Правильный перевод: It rained; therefore, we stayed home."),
      q_("RU → EN", "Переведи на английский: «Возможно, она придёт позже».", "Therefore she will come later.", "Certainly she will come later.", "Hardly she will come later.", "Perhaps she will come later.", 3, "Правильный перевод: Perhaps she will come later."),
      q_("RU → EN", "Переведи на английский: «Я недавно видел этот фильм».", "I recently saw this film.", "I seldom saw this film.", "I hardly ever saw this film recently.", "I lately see this film.", 0, "Правильный перевод: I recently saw this film."),
      q_("RU → EN", "Переведи на английский: «Он почти никогда не смотрит телевизор».", "He certainly watches TV.", "He hardly ever watches TV.", "He hardly watches ever TV.", "He recently watches TV.", 1, "Правильный перевод: He hardly ever watches TV."),
      q_("EN → RU", "Переведи на русский: We have recently moved.", "Мы едва можем переехать.", "Мы обязательно переедем.", "Мы недавно переехали.", "Мы редко переезжаем.", 2, "Правильный перевод: Мы недавно переехали."),
      q_("EN → RU", "Переведи на русский: It was late; therefore, we left.", "Было поздно, но мы остались.", "Возможно, мы уйдём поздно.", "Мы редко уходим поздно.", "Было поздно, поэтому мы ушли.", 3, "Правильный перевод: Было поздно, поэтому мы ушли."),
      q_("EN → RU", "Переведи на русский: Maybe he is right.", "Возможно, он прав.", "Он определённо прав.", "Следовательно, он прав.", "Он редко бывает прав.", 0, "Правильный перевод: Возможно, он прав.")
    ]
  },
  {
    title: "Наречия A2–B1 · Уровень 4 из 5",
    questions: [
      q_("Вставь пропущенное", "He ___ ever forgets his keys: perhaps once in five years.", "therefore", "hardly", "certainly", "lately", 1, "По смыслу подходит «hardly»."),
      q_("Вставь пропущенное", "We have ___ moved into a new apartment.", "hardly", "therefore", "recently", "seldom", 2, "По смыслу подходит «recently»."),
      q_("Вставь пропущенное", "She is ill; ___, she cannot go to school.", "recently", "hardly", "seldom", "therefore", 3, "По смыслу подходит «therefore»."),
      q_("Вставь пропущенное", "I can ___ believe how fast you run!", "hardly", "seldom", "therefore", "lately", 0, "По смыслу подходит «hardly»."),
      q_("Найди ошибку", "Найди предложение с ошибкой в форме глагола.", "He went there recently.", "He has hardly ever goes there.", "He hardly ever goes there.", "He has rarely gone there.", 1, "После has нужен V3: has gone; для Present Simple — goes без has."),
      q_("Найди ошибку", "Найди неправильное предложение.", "She does not often go shopping.", "She seldom goes shopping.", "She rarely does goes shopping.", "She rarely goes shopping.", 2, "В обычном утверждении does не нужен; после does используется go, не goes."),
      q_("Найди ошибку", "Найди предложение с неправильным сочетанием наречий.", "Perhaps he will arrive.", "He will certainly arrive.", "Maybe he will arrive.", "Perhaps he will certainly maybe arrive.", 3, "Perhaps и maybe выражают неопределённость, certainly — уверенность; нагромождение противоречит смыслу."),
      q_("Найди ошибку", "Найди неправильный перевод.", "hardly ever = часто", "hardly = едва", "lately = в последнее время", "recently = недавно", 0, "Hardly ever означает «почти никогда»."),
      q_("RU → EN", "Переведи на английский: «Я едва могу открыть дверь».", "I can seldom open the door.", "I can hardly open the door.", "I can hard open the door.", "I can hardly ever open the door.", 1, "Правильный перевод: I can hardly open the door."),
      q_("RU → EN", "Переведи на английский: «Она редко бывает дома».", "She is recently at home.", "She is therefore at home.", "She is rarely at home.", "She rarely is at home.", 2, "Правильный перевод: She is rarely at home."),
      q_("RU → EN", "Переведи на английский: «В последнее время мы часто учимся».", "We have been studying a lot seldom.", "We studied a lot therefore.", "We lately have studying a lot.", "We have been studying a lot lately.", 3, "Правильный перевод: We have been studying a lot lately."),
      q_("RU → EN", "Переведи на английский: «Конечно, он знает ответ».", "He certainly knows the answer.", "He hardly knows the answer.", "He rarely knows the answer.", "He maybe knows the answer certainly.", 0, "Правильный перевод: He certainly knows the answer."),
      q_("EN → RU", "Переведи на русский: I hardly know him.", "Я недавно познакомился с ним.", "Я почти не знаю его.", "Я усердно изучаю его.", "Я редко с ним встречаюсь.", 1, "Правильный перевод: Я почти не знаю его."),
      q_("EN → RU", "Переведи на русский: She has been ill lately.", "Она недавно заболела сегодня.", "Она, конечно, болеет.", "В последнее время она болела.", "Она редко болеет.", 2, "Правильный перевод: В последнее время она болела."),
      q_("EN → RU", "Переведи на русский: He rarely makes mistakes.", "Он едва замечает ошибки.", "Он недавно допустил ошибку.", "Он обязательно ошибётся.", "Он редко допускает ошибки.", 3, "Правильный перевод: Он редко допускает ошибки.")
    ]
  },
  {
    title: "Наречия A2–B1 · Уровень 5 из 5",
    questions: [
      q_("Вставь пропущенное", "I have been studying a lot ___.", "lately", "therefore", "seldom", "certainly", 0, "По смыслу подходит «lately»."),
      q_("Вставь пропущенное", "He ___ ever speaks during lessons.", "therefore", "hardly", "recently", "perhaps", 1, "По смыслу подходит «hardly»."),
      q_("Вставь пропущенное", "___ we will win, but no one knows yet.", "Therefore", "Hardly", "Maybe", "Certainly", 2, "По смыслу подходит «Maybe»."),
      q_("Вставь пропущенное", "She ___ visits us because she lives far away.", "lately", "certainly", "therefore", "rarely", 3, "По смыслу подходит «rarely»."),
      q_("Найди ошибку", "Найди ошибку в употреблении модального глагола.", "I can hardly to understand him.", "I can hardly understand him.", "I seldom understand him.", "Perhaps I misunderstood him.", 0, "После can употребляется инфинитив без to."),
      q_("Найди ошибку", "Где неверная фраза?", "She has been busy lately.", "She has been rarely late lately yesterday.", "She has rarely been late lately.", "She was late yesterday.", 1, "Yesterday требует конкретного прошлого времени; сочетание с lately и Present Perfect здесь ошибочно."),
      q_("Найди ошибку", "Найди ошибку.", "Maybe the shop is closed.", "We hardly ever visit that shop.", "The shop was closed; perhaps, we had to leave.", "The shop was closed; therefore, we had to leave.", 2, "Когда вывод логически следует из причины, употребляется therefore; perhaps выражает предположение."),
      q_("Найди ошибку", "Найди предложение с неверно построенным отрицанием.", "He hardly ever eats breakfast.", "He rarely eats breakfast.", "He seldom eats breakfast.", "He hardly ever does not eat breakfast.", 3, "Hardly ever само по себе отрицательно по смыслу; does not здесь не нужно."),
      q_("RU → EN", "Переведи на английский: «Возможно, они уже ушли».", "Perhaps they have already left.", "Therefore they have already left.", "Certainly they have already left.", "Hardly they have already left.", 0, "Правильный перевод: Perhaps they have already left."),
      q_("RU → EN", "Переведи на английский: «Он почти никогда не пропускает уроки».", "He recently misses lessons.", "He hardly ever misses lessons.", "He hardly never misses lessons.", "He rarely ever misses never lessons.", 1, "Правильный перевод: He hardly ever misses lessons."),
      q_("RU → EN", "Переведи на английский: «Я недавно начал изучать английский».", "I hardly started learning English.", "I seldom started learning English.", "I recently started learning English.", "I lately start learning English yesterday.", 2, "Правильный перевод: I recently started learning English."),
      q_("RU → EN", "Переведи на английский: «Шёл снег, следовательно, дорога была скользкой».", "It was snowing; perhaps, the road was slippery.", "It was snowing; seldom, the road was slippery.", "It was snowing; lately, the road was slippery.", "It was snowing; therefore, the road was slippery.", 3, "Правильный перевод: It was snowing; therefore, the road was slippery."),
      q_("EN → RU", "Переведи на русский: Perhaps it will snow; therefore, we should prepare.", "Возможно, пойдёт снег, поэтому нам стоит подготовиться.", "Снег точно пойдёт, но готовиться не нужно.", "Снег редко идёт, поэтому мы не готовимся.", "Недавно шёл снег, и мы подготовились.", 0, "Правильный перевод: Возможно, пойдёт снег, поэтому нам стоит подготовиться."),
      q_("EN → RU", "Переведи на русский: I can hardly believe it happened recently.", "Я, конечно, верю, что это происходит сейчас.", "Я едва могу поверить, что это произошло недавно.", "Я усердно верю, что это случится скоро.", "Я редко верю в то, что происходит.", 1, "Правильный перевод: Я едва могу поверить, что это произошло недавно."),
      q_("EN → RU", "Переведи на русский: He has hardly ever been late lately.", "Он недавно один раз опоздал.", "Он редко учился в последнее время.", "В последнее время он почти никогда не опаздывал.", "Он всегда опаздывал в последнее время.", 2, "Правильный перевод: В последнее время он почти никогда не опаздывал.")
    ]
  }
];

// Final adverb reinforcement: sets 16–25 use fresh server-side question variants after each failed attempt.
// All items and keys are generated server-side. A retry changes example sentences, not the set number.
const ADV_WORD_BANK_ = [
  {word:'recently', ru:'недавно', wrong:['редко','давно','постоянно'], distractors:['seldom','certainly','hardly'],
   examples:[
    ['I § bought a new notebook only yesterday.','Я § купил новую тетрадь, только вчера.'],
    ['Our class § started a science project last week.','Наш класс § начал научный проект, на прошлой неделе.'],
    ['She § joined our tennis team, just a few days ago.','Она § присоединилась к нашей теннисной команде, всего несколько дней назад.'],
    ['We § visited the new sports centre, on Saturday.','Мы § посетили новый спортивный центр, в субботу.'],
    ['My brother § learned to ride a skateboard, this month.','Мой брат § научился кататься на скейтборде, в этом месяце.'],
    ['I § downloaded a language app, only two days ago.','Я § скачал приложение для изучения языка, всего два дня назад.'],
    ['Dad § repaired my old bicycle, just this weekend.','Папа § починил мой старый велосипед, только в эти выходные.'],
    ['They § moved into a new house, last Friday.','Они § переехали в новый дом, в прошлую пятницу.']
   ]},
  {word:'lately',ru:'в последнее время',wrong:['когда-то давно','редко','вчера'],distractors:['seldom','therefore','certainly'],
   examples:[
    ['I have been sleeping much better §.','Я § сплю гораздо лучше.'],
    ['My sister has been practicing the piano every evening §.','Моя сестра § каждый вечер занимается на пианино.'],
    ['We have been studying new English words §.','Мы § изучаем новые английские слова.'],
    ['Our dog has been very playful §.','Наша собака § очень игривая.'],
    ['He has been spending more time outside §.','Он § проводит больше времени на улице.'],
    ['The weather has been unusually warm §.','Погода § необычно тёплая.'],
    ['I have been drinking more water §.','Я § пью больше воды.'],
    ['My friends have been playing basketball after school §.','Мои друзья § играют в баскетбол после школы.']
   ]},
  {word:'rarely',ru:'редко',wrong:['часто','каждый день','недавно'],distractors:['recently','certainly','therefore'],
   examples:[
    ['We § order pizza, perhaps once or twice a year.','Мы § заказываем пиццу, возможно один-два раза в год.'],
    ['My cousin § watches television, only on special occasions.','Мой двоюродный брат § смотрит телевизор, только по особым случаям.'],
    ['It § snows in our town, perhaps once in several years.','В нашем городе § идёт снег, может быть раз в несколько лет.'],
    ['He § forgets his lunch, perhaps once a school year.','Он § забывает обед, может быть раз за учебный год.'],
    ['I § eat fast food, maybe once every few months.','Я § ем фастфуд, может быть раз в несколько месяцев.'],
    ['They § visit this museum, perhaps once a decade.','Они § посещают этот музей, может быть раз в десять лет.'],
    ['Our teacher § cancels lessons, perhaps once a year.','Наш учитель § отменяет уроки, возможно раз в год.'],
    ['She § misses practice, maybe twice a year.','Она § пропускает тренировки, может быть дважды в год.']
   ]},
  {word:'seldom',ru:'редко',wrong:['часто','ежедневно','постоянно'],distractors:['recently','certainly','therefore'],
   examples:[
    ['Grandpa § uses a computer, maybe once a month.','Дедушка § пользуется компьютером, может быть раз в месяц.'],
    ['My uncle § travels by plane, perhaps once in five years.','Мой дядя § летает на самолёте, возможно раз в пять лет.'],
    ['We § miss the school bus, only once this year.','Мы § пропускаем школьный автобус, лишь один раз в этом году.'],
    ['She § eats chocolate, only on her birthday.','Она § ест шоколад, только в день рождения.'],
    ['I § wear a suit, perhaps once every two years.','Я § ношу костюм, возможно раз в два года.'],
    ['My brother § wakes up late, only on holidays.','Мой брат § просыпается поздно, только на каникулах.'],
    ['The cat § goes outside, maybe twice a month.','Кот § выходит на улицу, может быть дважды в месяц.'],
    ['Our family § eats in restaurants, perhaps once a year.','Наша семья § ест в ресторанах, возможно раз в год.']
   ]},
  {word:'hardly',ru:'едва',wrong:['легко','отлично','уверенно'],distractors:['recently','seldom','therefore'],
   examples:[
    ['I can § hear you because the music is so loud.','Я § тебя слышу, потому что музыка очень громкая.'],
    ['He could § walk after the exhausting race.','Он § мог идти после изнурительной гонки.'],
    ['She could § keep her eyes open because she was so tired.','Она § могла держать глаза открытыми, потому что сильно устала.'],
    ['We could § see the path in the thick fog.','Мы § могли разглядеть тропинку в густом тумане.'],
    ['I can § remember his name after so many years.','Я § могу вспомнить его имя спустя столько лет.'],
    ['They could § move the heavy table together.','Они § смогли сдвинуть тяжёлый стол вдвоём.'],
    ['I could § understand his whisper from across the room.','Я § мог разобрать его шёпот с другого конца комнаты.'],
    ['He could § breathe after running up ten flights of stairs.','Он § мог дышать после подъёма на десять лестничных пролётов.']
   ]},
  {word:'hardly ever',ru:'почти никогда',wrong:['каждый день','очень часто','постоянно'],distractors:['recently','certainly','therefore'],
   examples:[
    ['He § arrives late; I remember just one occasion.','Он § опаздывает; я помню лишь один случай.'],
    ['We § miss practice; perhaps once in two years.','Мы § пропускаем тренировку; может быть раз в два года.'],
    ['She § loses her keys; it happened only once.','Она § теряет ключи; такое случилось только однажды.'],
    ['My friends § argue; I heard them quarrel just once.','Мои друзья § спорят; я слышал их ссору всего однажды.'],
    ['Dad § forgets our birthdays; it happened only one time.','Папа § забывает наши дни рождения; такое было только раз.'],
    ['I § take a taxi; I did it only once last year.','Я § езжу на такси; в прошлом году это было только раз.'],
    ['My sister § eats sweets; maybe once at Christmas.','Моя сестра § ест сладости; может быть раз на Рождество.'],
    ['Our teacher § gives homework on Friday; once this term.','Наш учитель § задаёт домашнюю работу в пятницу; лишь раз за четверть.']
   ]},
  {word:'barely',ru:'едва',wrong:['с лёгкостью','прекрасно','без труда'],distractors:['recently','seldom','therefore'],
   examples:[
    ['I could § lift the box because it was so heavy.','Я § смог поднять коробку, потому что она была очень тяжёлая.'],
    ['She could § read the tiny letters without glasses.','Она § могла прочитать крошечные буквы без очков.'],
    ['We could § hear the announcement over the crowd.','Мы § могли услышать объявление из-за шума толпы.'],
    ['He § caught the last train, just seconds before departure.','Он § успел на последний поезд, за секунды до отправления.'],
    ['I could § stay awake after the long journey.','Я § мог не заснуть после долгой дороги.'],
    ['They could § see the lighthouse through the storm.','Они § могли разглядеть маяк сквозь бурю.'],
    ['My phone battery § lasted until I reached home.','Заряда телефона § хватило до моего возвращения домой.'],
    ['She § passed the exam, scoring just enough points.','Она § сдала экзамен, набрав ровно столько баллов, сколько нужно.']
   ]},
  {word:'perhaps',ru:'возможно',wrong:['точно','без сомнения','обязательно'],distractors:['certainly','rarely','therefore'],
   examples:[
    ['§ we will go hiking, but the plan is not certain yet.','§, мы пойдём в поход, но план пока не определён.'],
    ['§ the train will be late; nobody knows yet.','§, поезд опоздает; пока никто не знает.'],
    ['§ my cousins will visit us this weekend; they have not decided.','§, двоюродные братья навестят нас в выходные; они ещё не решили.'],
    ['§ she will join the club, but she is still thinking.','§, она вступит в клуб, но пока размышляет.'],
    ['§ there is a better route, although I am not sure.','§, есть маршрут получше, хотя я не уверен.'],
    ['§ our team will win, but it is impossible to know.','§, наша команда победит, но знать это невозможно.'],
    ['§ the shop is open today; I have not checked.','§, магазин сегодня открыт; я не проверял.'],
    ['§ we should leave earlier, but I need to ask Dad.','§, нам стоит выйти раньше, но нужно спросить папу.']
   ]},
  {word:'maybe',ru:'может быть',wrong:['точно','безусловно','непременно'],distractors:['certainly','seldom','therefore'],
   examples:[
    ['§ I will take my bike, but I have not decided.','§, я возьму велосипед, но ещё не решил.'],
    ['§ she is at the library; I am not sure.','§, она в библиотеке; я не уверен.'],
    ['§ the lesson will finish early, but nobody knows.','§, урок закончится раньше, но никто не знает.'],
    ['§ they will come tomorrow; they have not confirmed it.','§, они придут завтра; они ещё не подтвердили.'],
    ['§ we can play tennis after lunch, if it stops raining.','§, мы сыграем в теннис после обеда, если дождь прекратится.'],
    ['§ my friend forgot the meeting; I do not know.','§, мой друг забыл о встрече; я не знаю.'],
    ['§ there will be a test next week; the teacher has not said.','§, на следующей неделе будет тест; учитель ещё не сказал.'],
    ['§ we will travel in July, but our plans could change.','§, мы поедем путешествовать в июле, но планы могут измениться.']
   ]},
  {word:'certainly',ru:'определённо',wrong:['вряд ли','может быть','едва ли'],distractors:['perhaps','rarely','hardly'],
   examples:[
    ['I will § remember this holiday; it was unforgettable.','Я § запомню этот праздник; он был незабываемым.'],
    ['She will § recognize her own handwriting; I am sure.','Она § узнает свой почерк; я уверен.'],
    ['He will § help us; he has already promised.','Он § поможет нам; он уже обещал.'],
    ['We will § arrive on time; we are already at the station.','Мы § прибудем вовремя; мы уже на вокзале.'],
    ['Our teacher will § explain it again; she has agreed.','Наш учитель § объяснит это снова; она согласилась.'],
    ['They will § remember the concert; it was amazing.','Они § запомнят концерт; он был потрясающим.'],
    ['My sister will § enjoy this book; it is her favourite kind.','Моей сестре § понравится эта книга; это её любимый жанр.'],
    ['I can § finish the task; I have everything I need.','Я § могу закончить задание; у меня есть всё необходимое.']
   ]},
  {word:'therefore',ru:'поэтому',wrong:['однако','случайно','вместо этого'],distractors:['perhaps','hardly','seldom'],
   examples:[
    ['The road was icy; §, we drove slowly for safety.','Дорога была скользкой; § мы ехали медленно ради безопасности.'],
    ['He had a fever; §, he stayed home from school.','У него была температура; § он остался дома и не пошёл в школу.'],
    ['It was getting dark; §, we turned on the lights.','Темнело; § мы включили свет.'],
    ['The tickets were sold out; §, we could not enter.','Билеты закончились; § мы не смогли войти.'],
    ['Her phone was broken; §, she could not call us.','Её телефон сломался; § она не могла нам позвонить.'],
    ['There was no milk left; §, we went to the shop.','Молоко закончилось; § мы пошли в магазин.'],
    ['I forgot my umbrella; §, I got wet in the rain.','Я забыл зонтик; § промок под дождём.'],
    ['Our team practiced a lot; §, we played much better.','Наша команда много тренировалась; § мы сыграли гораздо лучше.']
   ]}
];

const ADV_ERROR_BANK_ = [
  ['She rarely go to the cinema.', 'После she нужно goes, не go.'],
  ['I have recently buy a skateboard.', 'После have нужна третья форма bought.'],
  ['He can hardly to hear us.', 'После can используется глагол без to.'],
  ['We have seldom saw that bird.', 'После have нужна третья форма seen.'],
  ['Maybe she will comes tomorrow.', 'После will используется форма come без -s.'],
  ['They rarely plays tennis after school.', 'После they используется play без -s.'],
  ['Perhaps he does not knows the answer.', 'После does not употребляется know без -s.'],
  ['I will certainly to call you.', 'После will не нужно to перед call.'],
  ['She has hardly ever visit London.', 'После has употребляется V3: visited.'],
  ['We have recently went to the zoo.', 'После have нужна третья форма gone.'],
  ['Maybe they is at home.', 'С they нужна форма are.'],
  ['He has certainly writes the email.', 'После has требуется V3: written.'],
  ['She seldom go there alone.', 'С she в Present Simple нужна форма goes.'],
  ['I can barely opens this door.', 'После can нужна начальная форма open.'],
  ['My friends rarely drinks tea.', 'С my friends используется drink без -s.'],
  ['He could hardly to stand after the race.', 'После could используется stand без to.'],
  ['They has barely finished their dinner.', 'С they используется have, не has.'],
  ['Perhaps she will visits us later.', 'После will нужно visit без -s.'],
  ['We has been working a lot lately.', 'С we используется have been, не has been.'],
  ['My sister hardly ever forget her keys.', 'С my sister в Present Simple нужно forgets.'],
  ['I have recently brokened my old phone.', 'Правильная третья форма глагола break — broken.'],
  ['Maybe the boys was in the garden.', 'С boys во множественном числе требуется were.'],
  ['I will certainly helps you tomorrow.', 'После will нужна форма help без -s.'],
  ['Our teacher seldom give us extra homework.', 'В Present Simple с teacher нужна форма gives.']
];

const ADV_CORRECT_SENTENCES_ = [
  'We have been learning new words lately.',
  'He rarely forgets his homework.',
  'Perhaps the museum is closed today.',
  'I recently saw an interesting film.',
  'They can barely hear the music.',
  'She seldom drinks fizzy drinks.',
  'Maybe our team will win tomorrow.',
  'Dad will certainly pick us up.',
  'It was late; therefore, we left.',
  'I can hardly believe the news.',
  'We hardly ever miss tennis practice.',
  'They have been very busy lately.'
];

function retryKeyForSet_(setNumber) {
  return 'ARTYOM_ADVERB_RETRY_SET_' + setNumber;
}
function retryRoundForSet_(setNumber) {
  if (setNumber < 16) return 0;
  const raw = Number(PropertiesService.getScriptProperties().getProperty(retryKeyForSet_(setNumber)));
  return Number.isSafeInteger(raw) && raw >= 0 ? raw : 0;
}

function buildNewAdverbQuestions_(setNumber, round) {
  if (!Number.isInteger(setNumber) || setNumber < 16 || setNumber > 25 ||
      !Number.isSafeInteger(round) || round < 0) {
    throw new Error('Некорректный новый набор наречий.');
  }
  const questions = [];
  const setOffset = setNumber - 16;
  for (let slot = 0; slot < 13; slot++) {
    const wordIndex = (setOffset * 3 + slot * 7) % ADV_WORD_BANK_.length;
    const item = ADV_WORD_BANK_[wordIndex];
    const contextIndex = (setOffset * 2 + round + Math.floor(slot / ADV_WORD_BANK_.length) * 4) % item.examples.length;
    const pair = item.examples[contextIndex];
    const correctIndex = (slot + round + setOffset) % 4;
    let prompt;
    let options;
    let type;
    let explanation;
    const en = pair[0].replace('§', item.word);
    const ru = pair[1].replace('§', item.ru);
    if (slot < 5) {
      type = 'Вставь наречие';
      prompt = 'Выбери подходящее слово по смыслу: ' + pair[0].replace('§', '____');
      options = [item.word].concat(item.distractors);
      explanation = 'Здесь подходит ' + item.word + ' — «' + item.ru + '». ' + en;
    } else if (slot < 9) {
      type = 'RU → EN';
      prompt = 'Выбери правильный перевод: «' + ru + '»';
      options = [en].concat(item.distractors.map(function(w) {
        return pair[0].replace('§', w);
      }));
      explanation = 'Правильный перевод: ' + en;
    } else {
      type = 'EN → RU';
      prompt = 'Выбери перевод на русский: ' + en;
      options = [ru].concat(item.wrong.map(function(w) {
        return pair[1].replace('§', w);
      }));
      explanation = 'Правильный перевод: ' + ru;
    }
    const correct = options[0];
    const wrong = options.slice(1);
    const ordered = wrong.slice();
    ordered.splice(correctIndex, 0, correct);
    questions.push(q_(type, prompt, ordered[0], ordered[1], ordered[2], ordered[3],
      correctIndex, explanation));
  }
  for (let errorSlot = 0; errorSlot < 2; errorSlot++) {
    const bankIndex = (setOffset * 5 + round * 2 + errorSlot) % ADV_ERROR_BANK_.length;
    const issue = ADV_ERROR_BANK_[bankIndex];
    const correctIndex = (round + setOffset + errorSlot + 2) % 4;
    const correctChoices = [0, 1, 2].map(function(i) {
      return ADV_CORRECT_SENTENCES_[(bankIndex * 3 + i) % ADV_CORRECT_SENTENCES_.length];
    });
    const ordered = correctChoices.slice();
    ordered.splice(correctIndex, 0, issue[0]);
    questions.push(q_('Найди ошибку',
      'В каком предложении допущена грамматическая ошибка? Пример ' + (errorSlot + 1) + '.',
      ordered[0], ordered[1], ordered[2], ordered[3], correctIndex, issue[1]));
  }
  return questions;
}
[16,17,18,19,20,21,22,23,24,25].forEach(function(setNumber) {
  TEST_SETS.push({
    title: setNumber <= 20
      ? 'Наречия A2–B1 · Новый блок · Набор ' + (setNumber - 15) + ' из 5'
      : 'Наречия A2–B1 · Финальное закрепление · Набор ' + (setNumber - 20) + ' из 5',
    questions: buildNewAdverbQuestions_(setNumber, 0)
  });
});


/* Four phrasal-verb questions per test, taken exclusively from the 15 bold
 * phrases in the user's "The Secret Coin" printout. Every five recent sets
 * cover all fifteen phrases; successive retries rotate examples and answers.
 * The original 15 questions and their server-side answer keys are unchanged.
 */
const PHRASAL_CHALLENGE_BANK_ = [["wake up","woke up","проснуться",[["I ___ when my alarm started ringing.","Я проснулся, когда зазвонил будильник."],["My sister ___ early because she heard a bird.","Моя сестра проснулась рано, потому что услышала птицу."],["We ___ before sunrise on Saturday.","Мы проснулись до восхода солнца в субботу."],["My brother ___ at seven and checked the time.","Мой брат проснулся в семь и посмотрел на часы."]]],["get up","got up","встать с кровати",[["I ___ from bed and opened the curtains.","Я встал с кровати и открыл шторы."],["She ___ and walked into the kitchen.","Она встала с кровати и пошла на кухню."],["We ___ from our beds and got dressed.","Мы встали с кроватей и оделись."],["He ___ immediately after waking up.","Он встал с кровати сразу после пробуждения."]]],["turn on","turned on","включить",[["I ___ the computer to start my game.","Я включил компьютер, чтобы начать играть."],["He ___ the lamp because the room was dark.","Он включил лампу, потому что в комнате было темно."],["We ___ the TV to watch the match.","Мы включили телевизор, чтобы посмотреть матч."],["She ___ the light to read her book.","Она включила свет, чтобы почитать книгу."]]],["look for","looked for","искать",[["I ___ my keys because I could not find them.","Я искал ключи, потому что не мог их найти."],["We ___ the missing cat around the garden.","Мы искали пропавшего кота в саду."],["He ___ his schoolbag under the table.","Он искал рюкзак под столом."],["She ___ her pencil in every drawer.","Она искала карандаш в каждом ящике."]]],["put on","put on","надеть",[["I ___ my jacket before I went outside.","Я надел куртку перед выходом."],["She ___ her helmet before riding her bike.","Она надела шлем перед поездкой на велосипеде."],["We ___ our coats because it was cold.","Мы надели пальто, потому что было холодно."],["He ___ his glasses to read the small words.","Он надел очки, чтобы прочитать мелкие слова."]]],["pick up","picked up","поднять с пола",[["I ___ the pencil that fell on the floor.","Я поднял карандаш, который упал на пол."],["She ___ her dropped phone from the carpet.","Она подняла телефон, упавший на ковёр."],["We ___ the papers that fell off the desk.","Мы подняли листы, упавшие со стола."],["He ___ the coins from the ground.","Он поднял монеты с земли."]]],["run into","ran into","случайно встретить",[["I ___ my teacher by chance at the supermarket.","Я случайно встретил учителя в супермаркете."],["She ___ an old friend while walking in the park.","Она случайно встретила старого друга в парке."],["We ___ our neighbour unexpectedly at the station.","Мы случайно встретили соседа на станции."],["He ___ his cousin by chance on the bus.","Он случайно встретил двоюродного брата в автобусе."]]],["come over","came over","зайти в гости",[["My friend ___ to my house after school.","Мой друг зашёл ко мне в гости после школы."],["Our cousins ___ to visit us on Sunday.","Наши двоюродные братья зашли к нам в гости в воскресенье."],["Max ___ to play Geometry Dash with me.","Макс зашёл ко мне в гости поиграть в Geometry Dash."],["The neighbours ___ to have tea with us.","Соседи зашли к нам в гости попить чаю."]]],["find out","found out","выяснить, узнать",[["I ___ why the secret door would not open.","Я выяснил, почему секретная дверь не открывалась."],["She ___ the answer by asking the teacher.","Она узнала ответ, спросив учителя."],["We ___ when the new game would be released.","Мы выяснили, когда выйдет новая игра."],["He ___ where his missing notebook was.","Он узнал, где лежала потерянная тетрадь."]]],["look up","looked up","найти информацию в справочнике или интернете",[["I ___ the word in an online dictionary.","Я нашёл слово в онлайн-словаре."],["She ___ the train times on the internet.","Она нашла расписание поездов в интернете."],["We ___ the meaning of the phrase in a dictionary.","Мы посмотрели значение фразы в словаре."],["He ___ the answer on a learning website.","Он нашёл ответ на учебном сайте."]]],["turn down","turned down","сделать тише",[["I ___ the music because the baby was sleeping.","Я убавил музыку, потому что малыш спал."],["She ___ the TV because her dad was working.","Она сделала телевизор тише, потому что папа работал."],["We ___ the sound so we could hear the teacher.","Мы убавили звук, чтобы услышать учителя."],["He ___ the radio because it was too loud.","Он убавил радио, потому что оно играло слишком громко."]]],["figure out","figured out","разобраться, разгадать",[["We ___ how to open the hidden door.","Мы разобрались, как открыть скрытую дверь."],["I ___ the puzzle after three attempts.","Я разгадал головоломку после трёх попыток."],["She ___ how the new app worked.","Она разобралась, как работало новое приложение."],["He ___ the secret pattern in the level.","Он разгадал секретный рисунок в уровне."]]],["give up","gave up","сдаться, перестать пытаться",[["I almost ___ after ten failed attempts.","Я чуть не сдался после десяти неудачных попыток."],["He ___ because the puzzle seemed impossible.","Он сдался, потому что головоломка казалась невозможной."],["She ___ trying after several unsuccessful days.","Она перестала пытаться после нескольких неудачных дней."],["We nearly ___ when the final level got too hard.","Мы почти сдались, когда последний уровень стал слишком сложным."]]],["carry on","carried on","продолжить",[["I ___ playing although the level was difficult.","Я продолжил играть, хотя уровень был сложным."],["She ___ reading even when it became late.","Она продолжила читать, даже когда стало поздно."],["We ___ practising until we got it right.","Мы продолжили тренироваться, пока не получилось."],["He ___ studying after a short break.","Он продолжил учиться после небольшого перерыва."]]],["turn off","turned off","выключить",[["I ___ the computer before going to bed.","Я выключил компьютер перед сном."],["She ___ the lights before leaving the room.","Она выключила свет перед выходом из комнаты."],["We ___ the television after the film ended.","Мы выключили телевизор после окончания фильма."],["He ___ the radio before starting his homework.","Он выключил радио перед домашним заданием."]]]];
function buildPhrasalReviewQuestions_(setNumber, retryRound) {
  if (!Number.isInteger(setNumber) || setNumber < 1 || setNumber > TOTAL_SETS ||
      !Number.isSafeInteger(retryRound) || retryRound < 0) {
    throw new Error('Неверный набор фразовых глаголов.');
  }
  const out = [];
  for (let slot = 0; slot < 4; slot++) {
    const index = ((setNumber - 1) * 4 + slot) % PHRASAL_CHALLENGE_BANK_.length;
    const phrase = PHRASAL_CHALLENGE_BANK_[index];
    const scenario = phrase[3][(retryRound + slot + setNumber) % 4];
    const correctIndex = (retryRound + setNumber + slot) % 4;
    const other = [4,8,12].map(function(delta){
      return PHRASAL_CHALLENGE_BANK_[(index + delta) % PHRASAL_CHALLENGE_BANK_.length];
    });
    let prompt, correct, distractors, explanation, type;
    if (slot === 0) {
      type = 'Phrasal verbs · Вставь';
      prompt = 'Вставь подходящий фразовый глагол: ' + scenario[0].replace('___','□□□□');
      correct = phrase[1];
      distractors = other.map(function(p){return p[1];});
      explanation = phrase[0] + ' (' + phrase[1] + ') — ' + phrase[2] + '. ' +
                    scenario[0].replace('___',phrase[1]);
    } else if (slot === 1) {
      type = 'Phrasal verbs · RU → EN';
      prompt = 'Какой фразовый глагол нужен для перевода: «' + scenario[1] + '»?';
      correct = phrase[1];
      distractors = other.map(function(p){return p[1];});
      explanation = phrase[0] + ' в прошедшем времени — ' + phrase[1] +
                    '. ' + scenario[0].replace('___',phrase[1]);
    } else if (slot === 2) {
      type = 'Phrasal verbs · EN → RU';
      prompt = 'Что означает фразовый глагол в предложении: ' +
               scenario[0].replace('___',phrase[1]);
      correct = phrase[2];
      distractors = other.map(function(p){return p[2];});
      explanation = phrase[0] + ' означает «' + phrase[2] +
                    '». Перевод: «' + scenario[1] + '»';
    } else {
      type = 'Phrasal verbs · Значение';
      prompt = 'Какой английский фразовый глагол соответствует ситуации: «' +
               scenario[1] + '»?';
      correct = phrase[0];
      distractors = other.map(function(p){return p[0];});
      explanation = phrase[0] + ' — «' + phrase[2] +
                    '». В Past Simple: ' + phrase[1] + '.';
    }
    const options = distractors.slice();
    options.splice(correctIndex,0,correct);
    if (new Set(options).size !== 4) throw new Error('Дубли в ответах на фразовый глагол.');
    out.push(q_(type,prompt,options[0],options[1],options[2],options[3],
      correctIndex,explanation));
  }
  return out;
}

const BARELY_REVIEW_EXAMPLES_ = [
  ['I could barely hear my friend over the noise.',
   'Я едва мог слышать друга из-за шума.',
   'Я отчётливо слышал друга из-за шума.',
   'Я часто слышал друга из-за шума.',
   'Я недавно слышал друга из-за шума.'],
  ['She barely had time to finish her homework.',
   'У неё едва хватило времени закончить домашнее задание.',
   'У неё было очень много времени закончить домашнее задание.',
   'Она никогда не делала домашнее задание.',
   'Она недавно начала делать домашнее задание.'],
  ['We could barely see the road in the fog.',
   'Мы едва различали дорогу в тумане.',
   'Мы прекрасно видели дорогу в тумане.',
   'Мы часто ходили по этой дороге.',
   'Мы недавно построили эту дорогу.'],
  ['The player barely reached the last platform.',
   'Игрок едва добрался до последней платформы.',
   'Игрок легко добрался до последней платформы.',
   'Игрок часто добирался до последней платформы.',
   'Игрок недавно построил последнюю платформу.']
];
function extraBarelyQuestion_(setNumber, round) {
  // Keep the original pinned 16th item exactly unchanged in its former set.
  if (setNumber <= 15 && setNumber === barelyExtraSetNumber_()) {
    return q_('Vocabulary · barely', 'Как перевести предложение: I could barely hear the teacher?',
      'Я прекрасно слышал учителя.',
      'Я едва мог слышать учителя.',
      'Я часто слышал учителя.',
      'Я специально не слушал учителя.',
      1, 'Barely означает «едва», «еле», «почти не».');
  }
  const e = BARELY_REVIEW_EXAMPLES_[(round + setNumber) % BARELY_REVIEW_EXAMPLES_.length];
  const correctIndex = (setNumber + round) % 4;
  const answers = e.slice(2);
  answers.splice(correctIndex,0,e[1]);
  return q_('Vocabulary · barely', 'Переведи на русский: ' + e[0],
    answers[0],answers[1],answers[2],answers[3],correctIndex,
    'Barely — «едва, еле». Правильный перевод: ' + e[1]);
}

// Pin the extra vocabulary question to the set active on first request after release.
// Other sets keep their original 15 questions.
const BARELY_EXTRA_SET_KEY = 'ARTYOM_BARELY_EXTRA_SET_NUMBER';
function barelyExtraSetNumber_() {
  const props = PropertiesService.getScriptProperties();
  const saved = Number(props.getProperty(BARELY_EXTRA_SET_KEY));
  if (Number.isInteger(saved) && saved >= 1 && saved <= TOTAL_SETS) return saved;
  const active = currentSetIndex_() + 1;
  props.setProperty(BARELY_EXTRA_SET_KEY, String(active));
  return active;
}

function buildSetQuestions_(setNumber) {
  const set = TEST_SETS[setNumber - 1];
  const source = setNumber >= 16 ? buildNewAdverbQuestions_(setNumber, retryRoundForSet_(setNumber)) : (set && set.questions);
  if (!source || source.length !== 15) {
    throw new Error('Некорректный банк вопросов набора ' + setNumber);
  }
  let activeCount = 0;
  let passiveCount = 0;
  const seenPrompts = {};

  source.forEach(function(item, index) {
    if (item.type.indexOf('Active') >= 0 && item.type.indexOf('Passive') < 0) activeCount++;
    if (item.type.indexOf('Passive') >= 0) passiveCount++;
    if (seenPrompts[item.prompt]) throw new Error('Повтор вопроса в наборе ' + setNumber);
    seenPrompts[item.prompt] = true;
    if (!Array.isArray(item.options) || item.options.length !== 4 ||
        !Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex > 3 ||
        !item.explanation) {
      throw new Error('Некорректный вопрос ' + (index + 1) + ' набора ' + setNumber);
    }
  });

  if (setNumber <= 5 && (activeCount !== 8 || passiveCount !== 7)) {
    throw new Error('В каждом наборе должно быть 8 Active и 7 Passive вопросов. Набор ' + setNumber);
  }

  const retryRound = setNumber >= 16 ? retryRoundForSet_(setNumber) : 0;
  const additionalBarely = extraBarelyQuestion_(setNumber, retryRound);
  // Retain all 15 existing questions verbatim; add the known barely review
  // as question 16 (or keep the original pinned review at question 1).
  const baseQuestions = setNumber <= 15 && setNumber === barelyExtraSetNumber_()
    ? [additionalBarely].concat(source)
    : source.concat([additionalBarely]);
  // Four questions use the 15 source phrasal verbs, yielding 20 total.
  const questions = baseQuestions.concat(buildPhrasalReviewQuestions_(setNumber,retryRound));
  if (questions.length !== 20) {
    throw new Error('Ожидалось ровно 20 вопросов в каждом наборе.');
  }

  return questions.map(function(item, index) {
    return {
      id: 'q' + String(index + 1).padStart(2, '0'),
      type: item.type,
      prompt: item.prompt,
      options: item.options.slice(),
      correctIndex: item.correctIndex,
      explanation: item.explanation
    };
  });
}

function currentSetIndex_() {
  const raw = PropertiesService.getScriptProperties().getProperty(PROGRESS_KEY);
  const parsed = raw === null ? 0 : Number(raw);
  if (!Number.isInteger(parsed) || parsed < 0) return 0;
  return Math.min(TOTAL_SETS - 1, parsed);
}

// Teacher control: set the active test set manually (1..25).
// This does not delete history or modify previous attempts.
function setArtyomCurrentSet(setNumber) {
  const value = Number(setNumber);
  if (!Number.isInteger(value) || value < 1 || value > TOTAL_SETS) {
    throw new Error('Номер набора должен быть от 1 до ' + TOTAL_SETS + '.');
  }
  PropertiesService.getScriptProperties().setProperty(PROGRESS_KEY, String(value - 1));
  return 'Текущий набор Артёма установлен: ' + value + ' из ' + TOTAL_SETS;
}

// Баллы привязаны к уникальному набору внутри текущего периода наград.
// Старые результаты не меняются, повторные попытки не дают повторную награду.
function rewardEpoch_() {
  const props = PropertiesService.getScriptProperties();
  let epoch = props.getProperty(REWARD_EPOCH_KEY);
  if (!epoch) {
    epoch = Utilities.getUuid();
    props.setProperty(REWARD_EPOCH_KEY, epoch);
  }
  return epoch;
}

// The GitHub journal is updated only through authenticated repository writes.
// The public browser never receives a write credential.
function readArtyomRewardJournal_() {
  const response = UrlFetchApp.fetch(REWARD_JOURNAL_URL + '?v=' + Date.now(), {
    muteHttpExceptions: true, followRedirects: true
  });
  if (response.getResponseCode() !== 200) {
    throw new Error('Журнал баллов временно недоступен. Повтори попытку позже.');
  }
  const journal = JSON.parse(response.getContentText());
  if (!journal || journal.schemaVersion !== 1 || journal.student !== 'Артём' ||
      !Array.isArray(journal.transactions)) {
    throw new Error('Неверный формат журнала баллов.');
  }
  const seen = {};
  const transactions = journal.transactions.map(function(t) {
    if (!t || typeof t.id !== 'string' || !/^[A-Za-z0-9_-]{8,80}$/.test(t.id) || seen[t.id] ||
        (t.type !== 'spend' && t.type !== 'adjustment') ||
        !Number.isSafeInteger(t.amount) || t.amount <= 0 || t.amount > 100000 ||
        typeof t.date !== 'string' || typeof t.reason !== 'string') {
      throw new Error('Некорректная или повторная операция в журнале баллов.');
    }
    seen[t.id] = true;
    return {id:t.id, type:t.type, amount:t.amount, date:t.date, reason:t.reason.slice(0,200)};
  });
  return transactions;
}

function rewardStatusFromSheet_(sheet, epoch) {
  const earnedSets = {};
  const earnedHistory = [];
  let penaltyTotal = 0;
  const penaltyHistory = [];
  const lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    const rows = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
    rows.forEach(function(row) {
      let d;
      try { d = JSON.parse(String(row[8] || '{}')); } catch (ignore) { return; }
      if (d && d.student === 'Артём' && d.penaltyApplied === true &&
          Number(d.setNumber) >= PENALTY_START_SET && d.rewardEpoch === epoch &&
          d.verified === true && d.passed === false) {
        penaltyTotal += PENALTY_POINTS;
        penaltyHistory.push({type:'penalty',amount:PENALTY_POINTS,
          date:row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
          reason:'Тест '+d.setNumber+' — результат '+d.score+'/'+(d.total||15)});
      }
      if (d && d.rewardEpoch === epoch && d.rewardGranted === true &&
          d.student === 'Артём' && Number.isInteger(Number(d.setNumber))) {
        if (!earnedSets[String(d.setNumber)]) {
          earnedHistory.push({type:'earn',amount:REWARD_POINTS,
            date:row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
            reason:'Тест '+d.setNumber+' — '+(d.total||15)+'/'+(d.total||15)});
        }
        earnedSets[String(d.setNumber)] = true;
      }
    });
  }
  const earned = Object.keys(earnedSets).length * REWARD_POINTS;
  const legacySpent = Math.max(0, Number(PropertiesService.getScriptProperties().getProperty(SPENT_POINTS_KEY)) || 0);
  const transactions = readArtyomRewardJournal_();
  const journalSpent = transactions.reduce(function(sum,t){
    return sum + (t.type === 'spend' ? t.amount : 0);
  },0);
  const journalAdjustment = transactions.reduce(function(sum,t){
    return sum + (t.type === 'adjustment' ? t.amount : 0);
  },0);
  // Existing legacy spending is preserved; new GitHub entries are incremental.
  const spent = legacySpent + journalSpent + penaltyTotal;
  return {balance:Math.max(0,earned + journalAdjustment - spent),earned:earned,
    spent:spent,legacySpent:legacySpent,earnedSets:earnedSets,
    history:earnedHistory.concat(transactions,penaltyHistory).sort(function(a,b){return String(b.date).localeCompare(String(a.date));})};
}

// Только для владельца: запустить вручную в редакторе Apps Script.
// Сбрасывает баллы, но не историю и не текущий набор вопросов.
function resetArtyomPoints() {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    PropertiesService.getScriptProperties().setProperty(REWARD_EPOCH_KEY, Utilities.getUuid());
    PropertiesService.getScriptProperties().setProperty(SPENT_POINTS_KEY, '0');
    return 'Баланс Артёма обнулён. История тестов сохранена.';
  } finally {
    lock.releaseLock();
  }
}

// Run ONCE before Block 2: retains earned rewards, records 60 points spent.
// Safe to run again: this sets spent to 60 rather than deducting another 60.
function startArtyomBlock2() {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const props = PropertiesService.getScriptProperties();
    const reward = rewardStatusFromSheet_(getOrCreateSheet_(), rewardEpoch_());
    for (let i = 1; i <= 5; i++) {
      if (!reward.earnedSets[String(i)]) {
        throw new Error('Не найдено подтверждённое начисление за набор ' + i + '. Настройки не изменены.');
      }
    }
    props.setProperty(SPENT_POINTS_KEY, '60');
    props.setProperty(PROGRESS_KEY, '5');
    return 'Блок 2 активирован. Баланс: ' + rewardStatusFromSheet_(getOrCreateSheet_(), rewardEpoch_()).balance;
  } finally {
    lock.releaseLock();
  }
}

// Run once to open the new adverbs block after sets 6–10 are completed.
// Does not change the reward epoch, spent balance, or previous attempts.
function startArtyomAdverbsBlock() {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = getOrCreateSheet_();
    const last = sheet.getLastRow();
    const passed = {};
    if (last >= 2) {
      sheet.getRange(2,9,last-1,1).getValues().forEach(function(row){
        try {
          const d = JSON.parse(String(row[0] || '{}'));
          if (d.student === 'Артём' && d.verified === true && d.passed === true) {
            passed[String(d.setNumber)] = true;
          }
        } catch(ignore) {}
      });
    }
    for (let n=6; n<=10; n++) {
      if (!passed[String(n)]) throw new Error('Не подтверждено прохождение набора '+n+' (15/15).');
    }
    PropertiesService.getScriptProperties().setProperty(PROGRESS_KEY, '10');
    return 'Блок наречий активирован: набор 11 из 15. Баланс сохранён.';
  } finally {lock.releaseLock();}
}

function testIdForSet_(setNumber) {
  // New bank version rejects stale cached 15- or 16-question submissions
  // without corrupting already saved attempts or the reward history.
  return 'phrasal-20-v1-' + (setNumber >= 16
    ? 'adverbs-retry-a2b1-v2-set-' + setNumber + '-round-' + retryRoundForSet_(setNumber)
    : setNumber <= 5
    ? 'active-passive-formula-a2plus-v2-set-' + setNumber
    : setNumber <= 10 ? 'foundation-mixed-a1a2-v1-set-' + setNumber
    : 'adverbs-a2b1-v1-set-' + (setNumber - 10));
}


function unlockNextAdverbsAfterVerifiedSet15_() {
  const props = PropertiesService.getScriptProperties();
  // The original app stored set 15 as index 14 and did not advance after 15/15.
  if (props.getProperty(PROGRESS_KEY) !== '14') return;
  const sheet = getOrCreateSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  const data = sheet.getRange(2, 9, lastRow - 1, 1).getValues();
  const completed15 = data.some(function(row) {
    try {
      const attempt = JSON.parse(String(row[0] || '{}'));
      return attempt.student === 'Артём' && Number(attempt.setNumber) === 15 &&
        attempt.verified === true && attempt.passed === true;
    } catch (ignore) { return false; }
  });
  if (completed15) props.setProperty(PROGRESS_KEY, '15');
}

function unlockNextAdverbsAfterVerifiedSet20_() {
  const props = PropertiesService.getScriptProperties();
  // In the previous 20-set release, passing the final set did not
  // advance PROGRESS_KEY. Open set 21 only after a verified 15/15
  // record for set 20; leave the historic reward and balance unchanged.
  if (props.getProperty(PROGRESS_KEY) !== '19') return;
  const sheet = getOrCreateSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  const data = sheet.getRange(2, 9, lastRow - 1, 1).getValues();
  const completed20 = data.some(function(row) {
    try {
      const attempt = JSON.parse(String(row[0] || '{}'));
      return attempt.student === 'Артём' && Number(attempt.setNumber) === 20 &&
        attempt.verified === true && attempt.passed === true &&
        Number(attempt.score) === 15 && Number(attempt.total) === 15;
    } catch (ignore) { return false; }
  });
  if (completed20) props.setProperty(PROGRESS_KEY, '20');
}

function currentSetPayload_() {
  unlockNextAdverbsAfterVerifiedSet15_();
  unlockNextAdverbsAfterVerifiedSet20_();
  const reward = rewardStatusFromSheet_(getOrCreateSheet_(), rewardEpoch_());
  const setNumber = currentSetIndex_() + 1;
  const questions = buildSetQuestions_(setNumber).map(function(item) {
    // Never send the answer key or explanation to the browser.
    return {
      id: item.id,
      type: item.type,
      prompt: item.prompt,
      options: item.options
    };
  });
  return {
    ok: true,
    testId: testIdForSet_(setNumber),
    setNumber: setNumber,
    totalSets: TOTAL_SETS,
    title: TEST_SETS[setNumber - 1].title,
    totalQuestions: questions.length,
    pointsBalance: reward.balance,
    rewardPerSet: REWARD_POINTS,
    questions: questions
  };
}

function jsonpOutput_(callback, result) {
  if (!/^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService.createTextOutput('/* Invalid callback */')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  const json = JSON.stringify(result).replace(/</g, '\\u003c');
  return ContentService.createTextOutput(callback + '(' + json + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function handleGetTest_(e) {
  const callback = String(e.parameter.callback || '');
  let response;
  try {
    response = currentSetPayload_();
  } catch (error) {
    response = {ok: false, error: String(error.message || error)};
  }
  return jsonpOutput_(callback, response);
}

// При открытии URL показываем Dashboard.
// GitHub Pages использует action=getTest и action=submit через JSONP.
function doGet(e) {
  const action = e && e.parameter ? String(e.parameter.action || '') : '';
  if (action === 'getTest') return handleGetTest_(e);
  if (action === 'getRewards') {
    let response;
    try {
      const status = rewardStatusFromSheet_(getOrCreateSheet_(), rewardEpoch_());
      response = {ok:true,pointsBalance:status.balance,earned:status.earned,spent:status.spent,history:status.history};
    } catch(error) { response = {ok:false,error:String(error.message || error)}; }
    return jsonpOutput_(String(e.parameter.callback || ''),response);
  }
  if (action === 'submit') return handleSubmission_(e);

  return HtmlService.createHtmlOutputFromFile('Dashboard')
    .setTitle('Журнал английских тестов Артёма')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function handleSubmission_(e) {
  const callback = String(e.parameter.callback || '');
  if (!/^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService.createTextOutput('/* Invalid callback */')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  let result;
  try {
    const payload = JSON.parse(String(e.parameter.payload || '{}'));
    result = verifyAndSave_(payload);
  } catch (error) {
    result = {ok: false, error: String(error.message || error)};
  }
  return jsonpOutput_(callback, result);
}

// Server is the sole authority for grading and progression.
function verifyAndSave_(data) {
  const attemptId = String(data.attemptId || '');
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(attemptId)) {
    throw new Error('Некорректный ID попытки.');
  }

  const answers = Array.isArray(data.answers) ? data.answers : [];
  // Validate the current 20-answer payload after the idempotency lookup below.

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const sheet = getOrCreateSheet_();
    const epoch = rewardEpoch_();
    const rewardBefore = rewardStatusFromSheet_(sheet, epoch);
    const lastRow = sheet.getLastRow();

    // Idempotency: the same attempt can safely be submitted again after a timeout.
    if (lastRow >= 2) {
      const ids = sheet.getRange(2, 10, lastRow - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === attemptId) {
          const rowNumber = i + 2;
          const savedRow = sheet.getRange(rowNumber, 5, 1, 5).getValues()[0];
          let savedData = {};
          try { savedData = JSON.parse(String(savedRow[4] || '{}')); } catch (ignore) {}
          const savedSetNumber = Number(savedData.setNumber || 0);
          const savedPassed = Number(savedRow[0]) === Number(savedRow[1]) && Number(savedRow[1]) >= 15;

          // Recover the rare case where the row was appended but progress write failed.
          // Recover a missing retry update if appendRow succeeded but property write failed.
          if (!savedPassed && savedSetNumber >= 16 &&
              currentSetIndex_() + 1 === savedSetNumber &&
              Number.isSafeInteger(Number(savedData.retryRound)) &&
              retryRoundForSet_(savedSetNumber) === Number(savedData.retryRound)) {
            PropertiesService.getScriptProperties().setProperty(
              retryKeyForSet_(savedSetNumber), String(Number(savedData.retryRound) + 1));
          }

          if (savedPassed && savedSetNumber >= 1 && savedSetNumber <= TOTAL_SETS) {
            const current = currentSetIndex_();
            if (current === savedSetNumber - 1 && savedSetNumber < TOTAL_SETS) {
              PropertiesService.getScriptProperties().setProperty(
                PROGRESS_KEY, String(Math.min(TOTAL_SETS - 1, savedSetNumber))
              );
            }
          }

          return {
            ok: true,
            duplicate: true,
            verified: true,
            attemptId: attemptId,
            setNumber: savedSetNumber,
            score: Number(savedRow[0]),
            total: Number(savedRow[1]),
            passed: savedPassed,
            results: Array.isArray(savedData.answers) ? savedData.answers : [],
            currentSet: currentSetIndex_() + 1,
            pointsBalance: rewardBefore.balance,
            pointsAwarded: Number(savedData.pointsAwarded || 0),
            pointsPenalty: Number(savedData.pointsPenalty || 0),
            message: 'Эта попытка уже была сохранена.'
          };
        }
      }
    }

    const currentIndex = currentSetIndex_();
    const currentSetNumber = currentIndex + 1;
    const expectedTestId = testIdForSet_(currentSetNumber);

    if (String(data.testId || '') !== expectedTestId) {
      throw new Error('Этот набор уже изменился. Обнови страницу, чтобы загрузить актуальный набор.');
    }
    if (Number(data.setNumber) !== currentSetNumber) {
      throw new Error('Номер набора не совпадает с текущим. Обнови страницу.');
    }

    const bank = buildSetQuestions_(currentSetNumber);
    if (answers.length !== bank.length) {
      throw new Error('Нужно ответить на все ' + bank.length + ' вопросов. Обнови тест.');
    }
    const keyById = {};
    bank.forEach(function(question) { keyById[question.id] = question; });

    const seen = {};
    let score = 0;
    const checked = [];

    answers.forEach(function(answer) {
      const id = String(answer.questionId || '');
      if (!keyById[id]) throw new Error('Неизвестный вопрос: ' + id);
      if (seen[id]) throw new Error('В отправке повторяется вопрос: ' + id);
      seen[id] = true;

      let selected = answer.selectedIndex;
      if (selected === null || selected === '' || typeof selected === 'undefined') {
        selected = null;
      } else {
        selected = Number(selected);
        if (!Number.isInteger(selected) || selected < 0 || selected > 3) {
          throw new Error('Некорректный вариант ответа.');
        }
      }

      const key = keyById[id];
      const correct = selected === key.correctIndex;
      if (correct) score++;
      checked.push({
        questionId: id,
        selectedIndex: selected,
        correctIndex: key.correctIndex,
        isCorrect: correct,
        explanation: key.explanation
      });
    });

    if (Object.keys(seen).length !== bank.length) {
      throw new Error('Не все вопросы присутствуют в отправке.');
    }

    // Normalize saved order by question ID, not the client's randomized screen order.
    checked.sort(function(a, b) {
      return a.questionId.localeCompare(b.questionId);
    });

    const total = bank.length;
    const passed = score === total;
    const rewardGranted = passed && !rewardBefore.earnedSets[String(currentSetNumber)];
    const pointsAwarded = rewardGranted ? REWARD_POINTS : 0;
    const penaltyApplied = currentSetNumber >= PENALTY_START_SET && !passed;
    const pointsPenalty = penaltyApplied ? PENALTY_POINTS : 0;
    const pointsBalanceAfter = Math.max(0,rewardBefore.balance + pointsAwarded - pointsPenalty);
    const submittedAt = new Date();
    const duration = Math.max(0, Math.min(86400, Number(data.durationSeconds) || 0));

    const details = checked.map(function(a, i) {
      return (i + 1) + '. ' + a.questionId +
        '\nОтвет: ' + (a.selectedIndex === null ? 'Нет ответа' : String.fromCharCode(65 + a.selectedIndex)) +
        '\nПравильный ответ: ' + String.fromCharCode(65 + a.correctIndex) +
        '\n' + (a.isCorrect ? 'Верно' : 'Ошибка') +
        '\n' + a.explanation;
    }).join('\n\n');

    const storedData = {
      student: 'Артём',
      testId: expectedTestId,
      setNumber: currentSetNumber,
      attemptId: attemptId,
      score: score,
      total: total,
      durationSeconds: duration,
      verified: true,
      passed: passed,
      rewardEpoch: epoch,
      rewardGranted: rewardGranted,
      pointsAwarded: pointsAwarded,
      penaltyApplied: penaltyApplied,
      pointsPenalty: pointsPenalty,
      retryRound: currentSetNumber >= 16 ? retryRoundForSet_(currentSetNumber) : null,
      answers: checked
    };

    // Append first; only then advance the server-side progress.
    sheet.appendRow([
      submittedAt,
      'Артём',
      TEST_SETS[currentSetNumber - 1].title,
      currentSetNumber <= 5 ? 'A2+' : currentSetNumber <= 10 ? 'A1–A2+' : 'A2–B1',
      score,
      total,
      duration,
      details,
      JSON.stringify(storedData),
      attemptId,
      expectedTestId,
      'Да',
      passed ? 'Да' : 'Нет'
    ]);

    if (passed && currentSetNumber < TOTAL_SETS) {
      PropertiesService.getScriptProperties().setProperty(
        PROGRESS_KEY, String(Math.min(TOTAL_SETS - 1, currentIndex + 1))
      );
    }
    if (!passed && currentSetNumber >= 16) {
      PropertiesService.getScriptProperties().setProperty(
        retryKeyForSet_(currentSetNumber), String(retryRoundForSet_(currentSetNumber) + 1)
      );
    }

    // Notify only for a newly saved, server-verified attempt.
    // Telegram errors must never cancel the test result or points.
    try {
      sendTelegramTestResult_({
        student: 'Артём',
        title: TEST_SETS[currentSetNumber - 1].title,
        setNumber: currentSetNumber,
        totalSets: TOTAL_SETS,
        score: score,
        total: total,
        durationSeconds: duration,
        pointsAwarded: pointsAwarded,
        pointsBalance: pointsBalanceAfter,
        pointsPenalty: pointsPenalty,
        attemptId: attemptId
      });
    } catch (telegramError) {
      console.error('Telegram notification failed: ' + String(telegramError.message || telegramError));
    }

    return {
      ok: true,
      verified: true,
      duplicate: false,
      attemptId: attemptId,
      setNumber: currentSetNumber,
      score: score,
      total: total,
      passed: passed,
      topicCompleted: passed && currentSetNumber === TOTAL_SETS,
      pointsAwarded: pointsAwarded,
      pointsBalance: pointsBalanceAfter,
      pointsPenalty: pointsPenalty,
      currentSet: currentSetIndex_() + 1,
      submittedAt: submittedAt.toISOString(),
      results: checked
    };
  } finally {
    lock.releaseLock();
  }
}

// Legacy doPost remains for compatibility with older clients.
// These records are explicitly marked unverified.
function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(raw);
    const answers = Array.isArray(data.answers) ? data.answers : [];
    const submittedAt = new Date();

    const details = answers.map(function(a, i) {
      return (i + 1) + '. ' + (a.question || '') +
        '\nОтвет: ' + (a.selectedAnswer || 'Нет ответа') +
        '\nПравильный ответ: ' + (a.correctAnswer || '') +
        '\n' + (a.isCorrect ? 'Верно' : 'Ошибка');
    }).join('\n\n');

    getOrCreateSheet_().appendRow([
      submittedAt,
      data.student || 'Артём',
      data.testTitle || 'English Challenge',
      data.level || '',
      Number(data.score || 0),
      Number(data.total || answers.length),
      data.durationSeconds || '',
      details,
      JSON.stringify(Object.assign({}, data, {
        verified: false,
        note: 'Старая версия отправки: данные клиента не проверены сервером.'
      })),
      data.attemptId || '',
      data.testId || 'legacy',
      'Нет',
      'Не проверено'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ok: true, verified: false}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: String(error)
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Existing Dashboard history API, retained.
function getResults() {
  const sheet = getOrCreateSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  return values.slice(1).reverse().map(function(row) {
    return {
      submittedAt: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
      student: row[1],
      testTitle: row[2],
      level: row[3],
      score: row[4],
      total: row[5],
      durationSeconds: row[6],
      details: row[7],
      raw: row[8],
      attemptId: row[9] || '',
      testId: row[10] || '',
      verified: row[11] || 'Нет',
      passed: row[12] || ''
    };
  });
}

// Existing spreadsheet setup and all 13 columns retained.
function getOrCreateSheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('RESULTS_SPREADSHEET_ID');
  let ss;

  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create('Журнал результатов английских тестов Артёма');
    props.setProperty('RESULTS_SPREADSHEET_ID', ss.getId());
  }

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  const headers = [
    'Дата и время отправки', 'Ученик', 'Тест', 'Уровень', 'Баллы', 'Всего',
    'Время прохождения (сек)', 'Разбор ответов', 'Полные данные JSON',
    'ID попытки', 'ID теста', 'Проверено сервером', 'Переход на следующий уровень'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(8, 500);
    sheet.setColumnWidth(9, 300);
  } else if (sheet.getLastColumn() < headers.length) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function debugLastResult() {
  const sheet = getOrCreateSheet_();
  const row = sheet.getLastRow();
  if (row < 2) {
    Logger.log('Нет результатов');
    return;
  }
  Logger.log(sheet.getRange(row, 9).getValue());
}

function debugGetResults() {
  const rows = getResults();
  Logger.log('Тип результата: ' + typeof rows);
  Logger.log('Это массив: ' + Array.isArray(rows));
  Logger.log('Количество записей: ' + (rows ? rows.length : 'нет данных'));
  if (rows && rows.length > 0) {
    Logger.log('Первая запись: ' + JSON.stringify(rows[0]));
    Logger.log('Последняя запись: ' + JSON.stringify(rows[rows.length - 1]));
  }
}


function testTelegramNotification() {
  const props = PropertiesService.getScriptProperties();

  const token = props.getProperty('TELEGRAM_BOT_TOKEN');
  const chatId = props.getProperty('TELEGRAM_CHAT_ID');

  if (!token || !chatId) {
    throw new Error('Не заполнены настройки Telegram');
  }

  const url = 'https://api.telegram.org/bot' + token + '/sendMessage';

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    payload: {
      chat_id: chatId,
      text: '🎉 Telegram подключён!\nУведомления о тестах Артёма скоро заработают.'
    },
    muteHttpExceptions: true
  });

  const result = JSON.parse(response.getContentText());

  if (!result.ok) {
    throw new Error('Telegram: ' + result.description);
  }

  Logger.log('Сообщение успешно отправлено');
}


// Automatic notification for a new, server-verified test attempt.
// Token and chat ID are stored only in Script Properties.
function sendTelegramTestResult_(info) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('TELEGRAM_BOT_TOKEN');
  const chatId = props.getProperty('TELEGRAM_CHAT_ID');
  if (!token || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not configured');
  }

  const seconds = Math.max(0, Math.floor(Number(info.durationSeconds) || 0));
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, '0');
  const percent = Math.round(Number(info.score) / Number(info.total) * 100);
  const passed = Number(info.score) === Number(info.total);
  const message = [
    (passed ? '🏆' : '📚') + ' ' + info.student + ' завершил тест!',
    '',
    '📖 Тема: ' + info.title,
    '🧩 Набор: ' + info.setNumber + ' из ' + info.totalSets,
    (passed ? '✅' : '📝') + ' Результат: ' + info.score + '/' + info.total + ' (' + percent + '%)',
    '⏱ Время: ' + minutes + ' мин ' + remainder + ' сек',
    '🎁 Начислено: +' + info.pointsAwarded + ' баллов',
    '⚠️ Штраф: −' + (info.pointsPenalty || 0) + ' баллов',
    '⭐ Всего баллов: ' + info.pointsBalance,
    passed ? '🎉 Набор пройден!' : '🔁 Нужно повторить тест.'
  ].join('\n');

  const response = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'post',
    payload: { chat_id: chatId, text: message },
    muteHttpExceptions: true
  });
  let result;
  try {
    result = JSON.parse(response.getContentText());
  } catch (e) {
    throw new Error('Telegram returned invalid JSON (HTTP ' + response.getResponseCode() + ')');
  }
  if (!result.ok) {
    throw new Error('Telegram API error: ' + String(result.description || response.getResponseCode()));
  }
  return true;
}

// Run this read-only function BEFORE the first GitHub spending transaction.
function auditArtyomRewardBalance() {
  const r = rewardStatusFromSheet_(getOrCreateSheet_(), rewardEpoch_());
  const summary = {earned:r.earned,legacySpent:r.legacySpent,spent:r.spent,balance:r.balance,history:r.history};
  Logger.log(JSON.stringify(summary));
  return summary;
}