import {grade} from './effects.js';
export function drawPanel(ctx,p,img,crop,index,state){
 ctx.save();ctx.translate(p.x+p.w/2,p.y+p.h/2);ctx.rotate(p.angle||0);const x=-p.w/2,y=-p.h/2;
 if(p.snapshot){ctx.shadowColor='#0009';ctx.shadowBlur=25;ctx.shadowOffsetY=12;ctx.fillStyle='#fff5e3';ctx.fillRect(x-12,y-12,p.w+24,p.h+46);ctx.shadowColor='transparent'}
 ctx.beginPath();if(p.diagonal===1){ctx.moveTo(x,y);ctx.lineTo(x+p.w,y);ctx.lineTo(x+p.w*.78,y+p.h);ctx.lineTo(x,y+p.h)}else if(p.diagonal===-1){ctx.moveTo(x+p.w*.22,y);ctx.lineTo(x+p.w,y);ctx.lineTo(x+p.w,y+p.h);ctx.lineTo(x,y+p.h)}else ctx.rect(x,y,p.w,p.h);ctx.clip();ctx.fillStyle='#c66a87';ctx.fillRect(x,y,p.w,p.h);
 if(img){
  const scale=Math.max(p.w/img.width,p.h/img.height)*(crop.zoom||1),dw=img.width*scale,dh=img.height*scale;
  const frame=(span,imageSpan,anchor,offset)=>Math.min(0,Math.max(span-imageSpan,(span-imageSpan)*anchor+offset*span));
  ctx.filter=state.grade==='mono'?'grayscale(1) contrast(1.35)':state.grade==='plain'?'none':'saturate(1.25) contrast(1.12)';
  ctx.drawImage(img,x+frame(p.w,dw,crop.anchorX??.5,crop.x||0),y+frame(p.h,dh,crop.anchorY??.5,crop.y||0),dw,dh);
  ctx.filter='none';
 }
 ctx.translate(x,y);grade(ctx,p.w,p.h,state.grade);let g=ctx.createLinearGradient(0,p.h*.6,0,p.h);g.addColorStop(0,'#090b1700');g.addColorStop(1,'#090b17c9');ctx.fillStyle=g;ctx.fillRect(0,0,p.w,p.h);ctx.fillStyle='#100f22';ctx.fillRect(0,0,Math.max(5,p.w*.012),p.h);
 const labels=['COASTLINE','AFTER HOURS','NO LOOKING BACK','HEAT WAVE','NIGHT DRIVE','LAST LIGHT','THE GETAWAY','LOW TIDE','FIRST LIGHT'];
 const label=`${String(index+1).padStart(2,'0')} / ${labels[index]}`;
 const font=Math.max(13,Math.min(23,p.w*.045)), pad=Math.max(14,p.w*.035);
 const left=pad+(p.diagonal===-1?p.w*.22:0), maxWidth=p.w-left-pad-16;
 const top=state.layout==='grid'&&index===2&&state.badge?p.h-pad-font-10:pad;
 ctx.font=`700 ${font}px Arial`;ctx.textBaseline='middle';
 ctx.fillStyle='#151223e8';ctx.fillRect(left,top,Math.min(maxWidth,ctx.measureText(label).width)+16,font+10);
 ctx.fillStyle='#fff1cf';ctx.fillText(label,left+8,top+(font+10)/2,maxWidth);ctx.restore();
}
