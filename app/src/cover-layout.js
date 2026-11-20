import {arrange} from './layouts.js';
import {drawPanel} from './panel.js';
import {effects} from './effects.js';
import {titleBlock} from './lettering.js';
export function drawCover(canvas,state,photos){
 const [w,h]=state.size;canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');let g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#ffb16e');g.addColorStop(.5,'#c8568f');g.addColorStop(1,'#282750');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const panels=arrange(state.layout,w,h);panels.forEach((p,i)=>{const crop=state.panels[i]||{photo:i%Math.max(photos.length,1)};drawPanel(ctx,p,photos[crop.photo%Math.max(photos.length,1)],crop,i,state)});effects(ctx,w,h,state);titleBlock(ctx,w,h,state);ctx.strokeStyle='#0d1020';ctx.lineWidth=10;ctx.strokeRect(0,0,w,h);return panels;
}
