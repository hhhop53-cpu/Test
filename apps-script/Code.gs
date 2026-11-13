const SHEET_NAME = 'Результаты Артёма';
const PROGRESS_SHEET_NAME = 'Текущий прогресс';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Dashboard')
    .setTitle('Общий журнал английских тестов')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    const data = JSON.parse(e && e.postData && e.postData.contents ? e.postData.contents : '{}');
    if (data.type === 'progress') {
      upsertProgress_(data, 'В процессе');
      return json_({ok:true});
    }
    const sheet = getOrCreateSheet_();
    const submittedAt = new Date();
    const answers = Array.isArray(data.answers) ? data.answers : [];
    const details = answers.map((a,i) => (i+1)+'. '+(a.question||'')+'\nОтвет: '+(a.selectedAnswer||'Нет ответа')+'\nПравильный ответ: '+(a.correctAnswer||'')+'\n'+(a.isCorrect?'Верно':'Ошибка')).join('\n\n');
    sheet.appendRow([submittedAt,data.student||'Артём',data.testTitle||'English Challenge',data.level||'',Number(data.score||0),Number(data.total||answers.length),data.durationSeconds||'',details,JSON.stringify(data)]);
    upsertProgress_({student:data.student||'Артём',testTitle:data.testTitle||'English Challenge',level:data.level||'',answered:Number(data.total||answers.length),total:Number(data.total||answers.length),currentQuestion:Number(data.total||answers.length)},'Завершён');
    return json_({ok:true,submittedAt:submittedAt.toISOString()});
  } catch(err) { return json_({ok:false,error:String(err)}); }
}
function json_(v){return ContentService.createTextOutput(JSON.stringify(v)).setMimeType(ContentService.MimeType.JSON);}
function getResults(){
 const s=getOrCreateSheet_(),v=s.getDataRange().getValues();if(v.length<2)return [];
 return v.slice(1).reverse().map(r=>({submittedAt:r[0] instanceof Date?r[0].toISOString():String(r[0]),student:r[1],testTitle:r[2],level:r[3],score:r[4],total:r[5],durationSeconds:r[6],details:r[7],raw:r[8]}));
}
function getProgress(){
 const s=getOrCreateProgressSheet_(),v=s.getDataRange().getValues();if(v.length<2)return [];
 return v.slice(1).reverse().map(r=>({student:r[0],testTitle:r[1],level:r[2],answered:r[3],total:r[4],currentQuestion:r[5],updatedAt:r[6] instanceof Date?r[6].toISOString():String(r[6]),status:r[7]}));
}
function upsertProgress_(d,status){
 const s=getOrCreateProgressSheet_(),v=s.getDataRange().getValues(),student=d.student||'Ученик',test=d.testTitle||'English Challenge';let n=0;
 for(let i=1;i<v.length;i++){if(v[i][0]===student&&v[i][1]===test){n=i+1;break;}}
 const row=[student,test,d.level||'',Number(d.answered||0),Number(d.total||0),Number(d.currentQuestion||0),new Date(),status];
 if(n)s.getRange(n,1,1,row.length).setValues([row]);else s.appendRow(row);
}
function getSpreadsheet_(){
 const p=PropertiesService.getScriptProperties();let id=p.getProperty('RESULTS_SPREADSHEET_ID');
 if(!id){const ss=SpreadsheetApp.create('Журнал результатов английских тестов Артёма и Даши');p.setProperty('RESULTS_SPREADSHEET_ID',ss.getId());return ss;}
 return SpreadsheetApp.openById(id);
}
function getOrCreateSheet_(){
 const ss=getSpreadsheet_();let s=ss.getSheetByName(SHEET_NAME);if(!s)s=ss.insertSheet(SHEET_NAME);
 if(s.getLastRow()===0){s.appendRow(['Дата и время отправки','Ученик','Тест','Уровень','Баллы','Всего','Время прохождения (сек)','Разбор ответов','Полные данные JSON']);s.setFrozenRows(1);s.getRange(1,1,1,9).setFontWeight('bold');s.setColumnWidth(1,180);s.setColumnWidth(8,500);s.setColumnWidth(9,300);}
 return s;
}
function getOrCreateProgressSheet_(){
 const ss=getSpreadsheet_();let s=ss.getSheetByName(PROGRESS_SHEET_NAME);if(!s)s=ss.insertSheet(PROGRESS_SHEET_NAME);
 if(s.getLastRow()===0){s.appendRow(['Ученик','Тест','Уровень','Отвечено','Всего','Текущий вопрос','Последнее обновление','Статус']);s.setFrozenRows(1);s.getRange(1,1,1,8).setFontWeight('bold');}
 return s;
}