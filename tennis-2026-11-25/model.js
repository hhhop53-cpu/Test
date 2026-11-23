export const names=['Лена','Алёна','Максим','Вадим','Павел','Антон','Настя'];
export const pairs=[[3,6],[4,1],[5,0],[2,4],[5,6],[0,1],[3,5],[2,0],[1,6],[4,0],[3,1],[2,6],[5,1],[4,6],[2,3],[0,6],[2,5],[3,4],[2,1],[3,0],[4,5]];
export function standings(scores){
  const rows=names.map(name=>({name,w:0,f:0,a:0}));
  pairs.forEach(([i,j],index)=>{
    const s=scores[index+1]; if(!s)return;
    rows[i].f+=s.a; rows[i].a+=s.b;
    rows[j].f+=s.b; rows[j].a+=s.a;
    rows[s.a>s.b?i:j].w++;
  });
  const cmp=(x,y)=>y.w-x.w||(y.f-y.a)-(x.f-x.a)||y.f-x.f;
  rows.sort(cmp);
  rows.forEach((row,i)=>row.place=i&&cmp(rows[i-1],row)===0?rows[i-1].place:i+1);
  return rows;
}
