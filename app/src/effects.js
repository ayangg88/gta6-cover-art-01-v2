export const grades=[['sunset','Sunset','#ffac54,#d8578e,#703d91'],['neon','Neon night','#27d9cf,#c62f9e'],['gold','Palm gold','#ffe09a,#c48135'],['teal','Teal dusk','#468797,#243d73'],['mono','Ink mono','#ddd,#333'],['plain','Plain','#9a9fa6,#6d7279']];
export function grade(ctx,w,h,name){
 if(name==='plain')return;
 const palette={sunset:['#ff9a3d','#ed4785','#45267b'],neon:['#24dbdb','#dc268f','#1a215c'],gold:['#ffd772','#c77036','#603150'],teal:['#69c9ce','#2c6387','#172b55'],mono:['#bdb4a1','#777','#111']}[name];
 const g=ctx.createLinearGradient(0,0,w*.3,h);palette.forEach((v,i)=>g.addColorStop(i/2,v));ctx.save();ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=.7;ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.restore();
}
export function effects(ctx,w,h,state){
 if(state.vignette){let g=ctx.createRadialGradient(w/2,h*.4,h*.1,w/2,h*.5,Math.max(w,h)*.7);g.addColorStop(0,'#0000');g.addColorStop(1,'#100b27aa');ctx.fillStyle=g;ctx.fillRect(0,0,w,h)}
 if(state.texture){ctx.fillStyle='#170e2420';for(let y=3;y<h;y+=7)for(let x=3;x<w;x+=7){ctx.beginPath();ctx.arc(x,y,.8,0,7);ctx.fill()}}
}
