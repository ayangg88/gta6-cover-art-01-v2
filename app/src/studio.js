import {layouts,sizes} from './layouts.js';
import {grades} from './effects.js';
import {drawCover} from './cover-layout.js';
import {attachCrop} from './photo-crop.js';
import {stageScene} from './scenes.js';
const $=id=>document.getElementById(id),canvas=$('preview');
let state={title:'NEON COAST',tagline:'A SUNSET HEIST STORY',badge:'LAUNCH WEEK',titleSize:1,spacing:2,color:'#ffb56b',heat:5,grade:'sunset',vignette:true,texture:true,layout:'grid',size:[1920,1080],panels:Array.from({length:9},(_,i)=>({photo:i%2,zoom:1,x:0,y:0}))};
stageScene(state);let photos=[],panelBoxes=[],selected=0,history=[],cursor=-1;
function snapshot(){return JSON.stringify({state,photos:photos.map(p=>p.src)})}
function record(){let value=snapshot();if(history[cursor]===value)return;history=history.slice(0,cursor+1);history.push(value);cursor++;sync()}
function render(){panelBoxes=drawCover(canvas,state,photos);$('dimensions').textContent=state.size.join(' × ')}
function change(fn,save=true){fn(state);render();if(save)record()}
function sync(){for(const id of ['title','tagline','badge','titleSize','spacing','color'])$(id).value=state[id];for(const id of ['vignette','texture'])$(id).checked=state[id];$('zoom').value=state.panels[selected].zoom;$('undo').disabled=cursor<=0;$('redo').disabled=cursor>=history.length-1;document.querySelectorAll('[data-layout]').forEach(b=>b.classList.toggle('active',b.dataset.layout===state.layout));document.querySelectorAll('[data-grade]').forEach(b=>b.classList.toggle('active',b.dataset.grade===state.grade));document.querySelectorAll('[data-size]').forEach(b=>b.classList.toggle('active',b.dataset.size===state.size.join(',')));$('heat').querySelectorAll('button').forEach((b,i)=>b.textContent=i<state.heat?'★':'☆')}
function select(i){selected=i;$('panelLabel').textContent=`PANEL ${String(i+1).padStart(2,'0')} SELECTED`;$('zoom').value=state.panels[i].zoom}
function image(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src})}
function thumbs(){$('photos').replaceChildren();photos.forEach((p,i)=>{let el=document.createElement('img');el.src=p.src;el.title='Assign to selected panel';el.onclick=()=>change(s=>{s.panels[selected].photo=i});$('photos').append(el)})}
async function restore(delta){if(cursor+delta<0||cursor+delta>=history.length)return;cursor+=delta;let old=JSON.parse(history[cursor]);state=old.state;photos=await Promise.all(old.photos.map(image));thumbs();sync();render()}
async function samples(){photos=await Promise.all(['samples/boulevard.jpg','samples/pier.jpg'].map(image));change(s=>s.panels.forEach((p,i)=>Object.assign(p,{photo:i%2,zoom:1,x:0,y:0})));thumbs()}
function toast(text){$('toast').textContent=text;$('toast').style.opacity=1;setTimeout(()=>$('toast').style.opacity=0,2400)}
async function load(files,drop=false){const incoming=[...files].filter(f=>f.type.startsWith('image/')).slice(0,4);if(!incoming.length)return;try{const loaded=await Promise.all(incoming.map(f=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>image(reader.result).then(resolve,reject);reader.onerror=reject;reader.readAsDataURL(f)})));if(drop){const index=photos.length<4?photos.length:state.panels[selected].photo;photos[index]=loaded[0];state.panels[selected]={photo:index,zoom:1,x:0,y:0}}else{photos=loaded;state.panels.forEach((p,i)=>Object.assign(p,{photo:i%photos.length,zoom:1,x:0,y:0}))}thumbs();render();record();toast('Photos ready. Drag a panel to find your frame.')}catch{toast('That image could not be opened. Try another photo.')}}
layouts.forEach(([id,icon,name])=>{let b=document.createElement('button');b.dataset.layout=id;b.innerHTML=`<b>${icon}</b>${name}`;b.onclick=()=>change(s=>s.layout=id);$('layouts').append(b)});
grades.forEach(([id,name,swatch])=>{let b=document.createElement('button');b.dataset.grade=id;b.style.setProperty('--swatch',`linear-gradient(90deg,${swatch})`);b.textContent=name;b.onclick=()=>change(s=>s.grade=id);$('grades').append(b)});
sizes.forEach(([w,h,name])=>{let b=document.createElement('button');b.dataset.size=[w,h];b.textContent=`${name} · ${w} × ${h}`;b.onclick=()=>change(s=>s.size=[w,h]);$('sizes').append(b)});
for(let i=1;i<=5;i++){let b=document.createElement('button');b.textContent='★';b.title=`${i} stars`;b.onclick=()=>change(s=>s.heat=i);$('heat').append(b)}
for(const id of ['title','tagline','badge','titleSize','spacing','color'])$(id).addEventListener('input',()=>change(s=>s[id]=['titleSize','spacing'].includes(id)?Number($(id).value):$(id).value));
for(const id of ['vignette','texture'])$(id).onchange=()=>change(s=>s[id]=$(id).checked);
$('zoom').oninput=()=>change(s=>s.panels[selected].zoom=Number($('zoom').value));$('files').onchange=e=>load(e.target.files);$('samples').onclick=samples;$('shuffle').onclick=()=>change(s=>s.panels.forEach((p,i)=>{p.photo=(p.photo+1+i%3)%photos.length}));$('undo').onclick=()=>restore(-1);$('redo').onclick=()=>restore(1);
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['z','y'].includes(e.key.toLowerCase())){e.preventDefault();restore(e.key.toLowerCase()==='y'||e.shiftKey?1:-1)}});
async function exportSize(size){const out=document.createElement('canvas');drawCover(out,{...state,size},photos);const blob=await new Promise(r=>out.toBlob(r,'image/png'));const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`neon-coast-${size.join('x')}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000)}
$('export').onclick=async()=>{await exportSize(state.size);toast('Your cover is ready. Go make some noise.')};$('exportAll').onclick=async()=>{for(const size of sizes){await exportSize(size.slice(0,2));await new Promise(r=>setTimeout(r,350))}toast('Four covers. Every format. All yours.')};
attachCrop(canvas,()=>panelBoxes,()=>state,change,select,load);
await samples();sync();render();window.studio={get state(){return state},get photos(){return photos},exportSize};
