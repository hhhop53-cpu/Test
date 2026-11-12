const SHEET_NAME = 'Результаты Артёма';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Dashboard')
    .setTitle('Журнал английских тестов Артёма')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(raw);
    const sheet = getOrCreateSheet_();
    const submittedAt = new Date();
    const answers = Array.isArray(data.answers) ? data.answers : [];
    const details = answers.map((a, i) =>
      (i + 1) + '. ' + (a.question || '') +
      '\nОтвет: ' + (a.selectedAnswer || 'Нет ответа') +
      '\nПравильный ответ: ' + (a.correctAnswer || '') +
      '\n' + (a.isCorrect ? 'Верно' : 'Ошибка')
    ).join('\n\n');

    sheet.appendRow([
      submittedAt,
      data.student || 'Артём',
      data.testTitle || 'English Challenge',
      data.level || '',
      Number(data.score || 0),
      Number(data.total || answers.length),
      data.durationSeconds || '',
      details,
      JSON.stringify(data)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, submittedAt: submittedAt.toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getResults() {
  const sheet = getOrCreateSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  return values.slice(1).reverse().map(row => ({
    submittedAt: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
    student: row[1],
    testTitle: row[2],
    level: row[3],
    score: row[4],
    total: row[5],
    durationSeconds: row[6],
    details: row[7],
    raw: row[8]
  }));
}

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
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Дата и время отправки', 'Ученик', 'Тест', 'Уровень', 'Баллы', 'Всего', 'Время прохождения (сек)', 'Разбор ответов', 'Полные данные JSON']);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(8, 500);
    sheet.setColumnWidth(9, 300);
  }
  return sheet;
}