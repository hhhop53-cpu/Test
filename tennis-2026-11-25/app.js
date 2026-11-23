import {names,pairs,standings} from './model.js';
const api='https://court-score-nov25-ms.timelessbream4.chatgpt.site/scores';
const edit=document.body.dataset.page==='edit', rows=document.querySelector('tbody');
const notice=document.querySelector('#sync');
const prefix='tennis-20261125-';
let key='';
function readKey(){
  let stored='';
  try{stored=sessionStorage.getItem(prefix+'key')||'';}catch{}
  key=location.hash.slice(1)||stored;
  if(edit && key){try{sessionStorage.setItem(prefix+'key',key);}catch{}}
}
readKey();
let scores={},loaded=false,refreshTask;
const directLinks=new Set();
const drafts=new Map(), controls=new Map(), busy=new Set();
const escId=id=>prefix+'start2-draft-'+id;
function remember(id,value){
  if(value)drafts.set(id,value);else drafts.delete(id);
  try{if(value)localStorage.setItem(escId(id),JSON.stringify(value));else localStorage.removeItem(escId(id));}catch{}
}
function time(i){const m=21*60+i*8;return Math.floor(m/60)+':'+String(m%60).padStart(2,'0');}
function init(){
  pairs.forEach(([l,r],i)=>{
    const id=i+1,tr=rows.insertRow();
    tr.innerHTML='<td class="time">'+time(i)+'</td><td><strong>'+names[l]+' — '+names[r]+'</strong></td><td><div class="fields"><input aria-label="Мячи: '+names[l]+'" inputmode="numeric" type="text" pattern="[0-9]*" maxlength="4" autocomplete="off"><span>:</span><input aria-label="Мячи: '+names[r]+'" inputmode="numeric" type="text" pattern="[0-9]*" maxlength="4" autocomplete="off"></div></td><td><button>Отправить</button><small role="status"></small></td>';
    const [a,b]=tr.querySelectorAll('input'),button=tr.querySelector('button'),msg=tr.querySelector('small');
    controls.set(id,{a,b,button,msg});
    try{const d=JSON.parse(localStorage.getItem(escId(id)));if(d){drafts.set(id,d);a.value=d.a;b.value=d.b;}}catch{}
    for(const field of [a,b])field.addEventListener('input',()=>{
      remember(id,{a:a.value,b:b.value,rev:drafts.get(id)?.rev??scores[id]?.rev??''});
      paintRow(id);
    });
    button.onclick=()=>save(id);
  });
  const access=document.querySelector('#access');
  function updateAccess(){readKey();access.hidden=!!key;for(const id of controls.keys())paintRow(id);}
  window.addEventListener('hashchange',updateAccess);
  if(!key){
    access.innerHTML='<label>Вставьте полную ссылку для ввода счёта <input type="password" style="width:100%" autocomplete="off"></label><button type="button">Открыть ввод</button><small role="status"></small>';
    access.querySelector('button').onclick=()=>{
      const fragment=access.querySelector('input').value.trim().split('#').pop();
      if(!/^[a-f0-9]{48}$/i.test(fragment)){access.querySelector('small').textContent='Скопируйте ссылку организатора целиком.';return;}
      location.hash=fragment;updateAccess();
    };
  }
  updateAccess();
}
function paintRow(id){
  const {a,b,button,msg}=controls.get(id),s=scores[id],d=drafts.get(id);
  if(!d){a.value=s?.a??'';b.value=s?.b??'';}
  const conflict=loaded&&d&&d.rev!==(s?.rev??'');
  button.textContent=conflict?'Заменить счёт':'Отправить';
  button.disabled=busy.has(id)||!key;
  a.disabled=b.disabled=busy.has(id)||!key;
  msg.textContent=busy.has(id)?'Отправка…':conflict?'На сервере '+s?.a+' : '+s?.b+'. Проверьте правку.':d?'Черновик':s?'Сохранено':'';
  if(d && directLinks.has(id)){
    const link=document.createElement('a');
    link.href='https://court-score-nov25-ms.timelessbream4.chatgpt.site/#'+encodeURIComponent(key);
    link.textContent='Открыть прямую форму';
    msg.append(' · ',link);
  }
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
async function requestScores(options){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),30000);
  try{return await fetch(api,{...options,signal:controller.signal});}
  finally{clearTimeout(timer);}
}
async function refresh(){
  if(refreshTask)return refreshTask;
  refreshTask=(async()=>{
    try{
      const res=await requestScores({cache:'no-store'});if(!res.ok)throw Error();
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
  if(loaded && d && d.rev!==(s?.rev??'') && !confirm((s?'Сейчас сохранено '+s.a+' : '+s.b+'.':'Счёт очищен.')+' Записать '+a.value+' : '+b.value+'?'))return;
  const result={id,a:Number(a.value),b:Number(b.value),rev:loaded?(s?.rev??''):(d?.rev??''),key};
  busy.add(id);paintRow(id);let message='';
  try{
    const res=await requestScores({method:'POST',body:JSON.stringify(result)});
    if(res.status===409){message='Счёт изменился. Проверьте сохранённый результат.';await refresh();return;}
    if(!res.ok)throw Error(res.status===403?'Нужна действующая ссылка для ввода.':'Ошибка отправки. Черновик сохранён.');
    const saved=await res.json();
    if(refreshTask)await refreshTask;
    directLinks.delete(id);scores[id]=saved;remember(id,null);paint();await refresh();
  }catch(error){directLinks.add(id);message=error.name==='AbortError'||error instanceof TypeError?'Сервер не подтвердил запись. Проверьте связь и повторите.':error.message;}
  finally{busy.delete(id);paintRow(id);if(message)msg.prepend(message+' ');}
}
if(edit)init();
if(edit)for(const id of controls.keys())paintRow(id);
refresh();setInterval(()=>{if(!document.hidden)refresh();},10000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
