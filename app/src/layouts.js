export const layouts=[['grid','▦','Nine panels'],['hero','▣','Hero + three'],['snapshots','▱','Snapshots'],['full','□','Full bleed'],['triptych','▥','Triptych'],['duo','◩','Duo split']];
export const sizes=[[1920,1080,'Wide'],[1080,1350,'Portrait'],[1080,1080,'Square'],[1080,1920,'Story']];
export function arrange(kind,w,h){
 const gap=9,box=(x,y,a,b,extra={})=>({x:x*w+gap/2,y:y*h+gap/2,w:a*w-gap,h:b*h-gap,...extra}),tall=h>w*1.5,wide=w>h*1.3;
 if(kind==='full')return [box(0,0,1,1)];
 if(kind==='snapshots')return [box(.05,.08,.46,.66,{angle:-.09,snapshot:true}),box(.49,.12,.45,.65,{angle:.08,snapshot:true}),box(.27,.24,.45,.65,{angle:-.03,snapshot:true})];
 if(kind==='triptych')return tall?[0,1,2].map(i=>box(0,i/3,1,1/3)):[0,1,2].map(i=>box(i/3,0,1/3,1));
 if(kind==='duo')return [box(0,0,.56,1,{diagonal:1}),box(.44,0,.56,1,{diagonal:-1})];
 if(kind==='hero')return wide?[box(0,0,.68,1),...Array.from({length:3},(_,i)=>box(.68,i/3,.32,1/3))]:[box(0,0,1,.57),...Array.from({length:3},(_,i)=>tall?box(0,.57+i*.143,1,.143):box(i/3,.57,1/3,.43))];
 const hero=wide?.40:.48;
 const side=1-hero, split=side*.48;
 return [
  box(0,0,hero,.56),
  box(hero,0,split,.29),box(hero+split,0,side-split,.29),
  box(hero,.29,side-split,.27),box(hero+side-split,.29,split,.27),
  ...Array.from({length:4},(_,i)=>box(i/4,.80,.25,.20)),
 ];
}
