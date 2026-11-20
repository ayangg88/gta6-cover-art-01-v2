export function attachCrop(canvas,getPanels,getState,change,select,load){
 let drag=null;
 function point(e){let r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height}}
 function hit(e){const q=point(e),ps=getPanels();for(let i=ps.length-1;i>=0;i--){let p=ps[i];if(q.x>=p.x&&q.x<=p.x+p.w&&q.y>=p.y&&q.y<=p.y+p.h)return i}return 0}
 canvas.addEventListener('pointerdown',e=>{const i=hit(e);select(i);drag={i,q:point(e),crop:{...getState().panels[i]}};canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;let q=point(e),p=getPanels()[drag.i];change(s=>{s.panels[drag.i].x=Math.max(-1,Math.min(1,(drag.crop.x||0)+(q.x-drag.q.x)/p.w));s.panels[drag.i].y=Math.max(-1,Math.min(1,(drag.crop.y||0)+(q.y-drag.q.y)/p.h))},false)});
 canvas.addEventListener('pointerup',()=>{if(drag){drag=null;change(()=>{},true)}});
 canvas.addEventListener('dragover',e=>e.preventDefault());canvas.addEventListener('drop',e=>{e.preventDefault();select(hit(e));load(e.dataTransfer.files,true)});
}
