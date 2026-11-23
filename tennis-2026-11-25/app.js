import {names,pairs,standings} from './model.js';
const api='https://court-score-nov25-ms.timelessbream4.chatgpt.site/scores';
const edit=document.body.dataset.page==='edit', rows=document.querySelector('tbody');
const notice=document.querySelector('#sync');
const prefix='tennis-20261125-';
let key=location.hash.slice(1)||sessionStorage.getItem(prefix+'key')||'';
if(edit && location.hash){sessionStorage.setItem(prefix+'key',key);}
let scores={},loaded=false,refreshTask;
const drafts=new Map(), controls=new Map(), busy=new Set();
const escId=id=>prefix+'start2-draft-'+id;
function remember(id,value){
  if(value){drafts.set(id,value);localStorage.setItem(escId(id),JSON.stringify(value));}
  else {drafts.delete(id);localStorage.removeItem(escId(id));}
}
function time(i){const m=21*60+i*8;return Math.floor(m/60)+':'+String(m%60).padStart(2,'0');}
function init(){
  pairs.forEach(([l,r],i)=>{
    const id=i+1,tr=rows.insertRow();
    tr.innerHTML='<td class="time">'+time(i)+'</td><td><strong>'+names[l]+' — '+names[r]+'</strong></td><td><div class="fields"><input aria-label="Мячи: '+names[l]+'" inputmode="numeric" type="number" min="0" max="9999"><span>:</span><input aria-label="Мячи: '+names[r]+'" inputmode="numeric" type="number" min="0" max="9999"></div></td><td><button>Отправить</button><small role="status"></small></td>';
    const [a,b]=tr.querySelectorAll('input'),button=tr.querySelector('button'),msg=tr.querySelector('small');
    controls.set(id,{a,b,button,msg});
    try{const d=JSON.parse(localStorage.getItem(escId(id)));if(d){drafts.set(id,d);a.value=d.a;b.value=d.b;}}catch{}
    for(const field of [a,b])field.addEventListener('input',()=>{
      remember(id,{a:a.value,b:b.value,rev:drafts.get(id)?.rev??scores[id]?.rev??''});
      paintRow(id);
    });
    button.onclick=()=>save(id);
  });
  if(!key)document.querySelector('#access').hidden=false;
}
function paintRow(id){
  const {a,b,button,msg}=controls.get(id),s=scores[id],d=drafts.get(id);
  if(!d){a.value=s?.a??'';b.value=s?.b??'';}
  const conflict=loaded&&d&&d.rev!==(s?.rev??'');
  button.textContent=conflict?'Заменить счёт':'Отправить';
  button.disabled=busy.has(id)||!key||!loaded;
  a.disabled=b.disabled=busy.has(id)||!key||!loaded;
  msg.textContent=busy.has(id)?'Отправка…':conflict?'На сервере '+s?.a+' : '+s?.b+'. Проверьте правку.':d?'Черновик':s?'Сохранено':'';
}
function paint(){
  document.querySelector('#count').textContent=Object.keys(scores).length+' из 21';
  if(edit){for(const id of controls.keys())paintRow(id);return;}
  rows.replaceChildren();
  for(const p of standings(scores)){
    const tr=rows.insertRow();
    for(const value of [p.place,p.name,p.w,p.f,p.a])tr.insertCell().textContent=value;
  }
}
async function refresh(){
  if(refreshTask)return refreshTask;
  refreshTask=(async()=>{
    try{
      const res=await fetch(api,{cache:'no-store'});if(!res.ok)throw Error();
      scores=await res.json();loaded=true;paint();
      notice.textContent='Обновлено '+new Date().toLocaleTimeString('ru-RU');
      return true;
    }catch{notice.textContent='Нет связи с протоколом. Повторяем запрос…';return false;}
  })().finally(()=>refreshTask=null);
  return refreshTask;
}
async function save(id){
  if(busy.has(id))return;
  const {a,b,msg}=controls.get(id),s=scores[id];
  if(![a,b].every(x=>/^\d{1,4}$/.test(x.value))||Number(a.value)===Number(b.value)){
    msg.textContent='Введите целые числа от 0 до 9999. При равном счёте сыграйте решающий мяч.';return;
  }
  const d=drafts.get(id);if(!d&&s){msg.textContent='Этот счёт уже сохранён';return;}
  if(d && d.rev!==(s?.rev??'') && !confirm('Сейчас сохранено '+s.a+' : '+s.b+'. Заменить на '+a.value+' : '+b.value+'?'))return;
  const result={id,a:Number(a.value),b:Number(b.value),rev:s?.rev??'',key};
  busy.add(id);paintRow(id);let message='';
  try{
    const res=await fetch(api,{method:'POST',body:JSON.stringify(result)});
    if(res.status===409){message='Счёт изменился. Проверьте сохранённый результат.';await refresh();return;}
    if(!res.ok)throw Error(res.status===403?'Нужна действующая ссылка для ввода.':'Ошибка отправки. Черновик сохранён.');
    const saved=await res.json();
    if(refreshTask)await refreshTask;
    scores[id]=saved;remember(id,null);paint();await refresh();
  }catch(error){message=error.message.includes('fetch')?'Нет связи. Черновик сохранён.':error.message;}
  finally{busy.delete(id);paintRow(id);if(message)msg.textContent=message;}
}
if(edit)init();
if(edit)for(const id of controls.keys())paintRow(id);
refresh();setInterval(()=>{if(!document.hidden)refresh();},10000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
