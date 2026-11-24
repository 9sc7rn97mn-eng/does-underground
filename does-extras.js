/* DOES extras: one-shot pool game, personal invitation, all-sections menu. Loaded on demand. Nothing here is sent anywhere. */
function doesOpen(html){const m=document.getElementById('modal');m.innerHTML=html;document.getElementById('overlay').classList.add('open');m.scrollTop=0;}
function doesGo(fn){closeModal();setTimeout(fn,60);}
function doesCat(i){const h=document.querySelectorAll('#sections>h2')[i];(h||document.getElementById('sections')).scrollIntoView({behavior:'smooth',block:'start'});}
function openAllSections(){
 const goId=id=>"doesGo(()=>document.getElementById('"+id+"').scrollIntoView({behavior:'smooth',block:'start'}))";
 const items=[['بلايستيشن',"doesGo(()=>doesCat(0))"],['بلياردو',"doesGo(()=>doesCat(1))"],['بينج بونج',"doesGo(()=>doesCat(2))"],['حسابي · نقاطي ودعواتي',"openAccount()"],['اهتمام البطولات',"openTournament()"],['كارت نتيجة الماتش',"openResultCard()"],['العب بلياردو',"openMiniGame()"],['دعوة للشلة',"openInvite()"],['أيقونة الموبايل',goId('siteAddCard')],['رأيك يهمنا',goId('feedbackTitle')],['المكان والاتجاهات',goId('location')],['التواصل والمشاركة',"doesGo(()=>document.querySelector('footer').scrollIntoView({behavior:'smooth'}))"]];
 doesOpen('<h3>كل أقسام DOES</h3><p class="note" style="margin-bottom:16px">كل اللي محتاجه في مكان واحد</p><div class="does-menu">'+items.map(x=>'<button type="button" onclick="'+x[1]+'">'+x[0]+'</button>').join('')+'</div><button class="btn ghost" style="margin-top:14px" onclick="closeModal()">إغلاق</button>');
}
/* ---------- mini pool ---------- */
const POOL={W:660,H:850,R:17,P:30,pockets:[[40,40],[620,40],[40,810],[620,810],[26,425],[634,425]]};
let pool=null,poolRaf=0;
function poolRack(){const b=[{x:330,y:630,vx:0,vy:0,cue:1,in:0}];let n=0;for(let r=0;r<3;r++)for(let k=0;k<=r;k++){b.push({x:330+(k-r/2)*37,y:260-r*33,vx:0,vy:0,cue:0,in:0,n:++n});}return b;}
function openMiniGame(){
 const best=+(localStorage.getItem('does_pool_best')||0);
 doesOpen('<h3>ضربة بعد ضربة. ركّز.</h3><p class="note">اسحب من الكرة البيضا ناحية العكس، وسيب. كل ما تسحب أكتر الضربة أقوى.</p><div style="display:flex;justify-content:space-between;padding:14px 0;font-size:15px"><span>الكور اللي دخلت <b id="poolScore">0</b></span><span>الضربة <b id="poolShot">1</b> / 7</span><span>أحسن رقم <b id="poolBest">'+best+'</b></span></div><canvas id="poolCanvas" width="660" height="850" style="width:100%;border-radius:20px;border:1px solid #8c6a43;display:block;touch-action:none"></canvas><p class="note" id="poolMsg" style="margin-top:12px">للمتعة بس. مفيش فلوس أو جوائز، ومش مربوطة بالحجز أو النقاط. أحسن رقم محفوظ على موبايلك بس.</p><button class="btn" id="poolAgain" hidden onclick="openMiniGame()">العب تاني</button><button class="btn ghost" onclick="closeMiniGame()">إغلاق</button>');
 poolStart();
}
function closeMiniGame(){cancelAnimationFrame(poolRaf);pool=null;closeModal();}
function poolStart(){
 const cv=document.getElementById('poolCanvas');pool={balls:poolRack(),shot:1,score:0,drag:null,moving:false,pocketedThisShot:0,over:false,cv};
 const pt=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*POOL.W/r.width,y:(e.clientY-r.top)*POOL.H/r.height};};
 cv.onpointerdown=e=>{if(!pool||pool.moving||pool.over)return;const p=pt(e),c=pool.balls[0];if(Math.hypot(p.x-c.x,p.y-c.y)<110){pool.drag=p;cv.setPointerCapture(e.pointerId);poolDraw();}};
 cv.onpointermove=e=>{if(pool&&pool.drag){pool.drag=pt(e);poolDraw();}};
 cv.onpointerup=e=>{if(!pool||!pool.drag)return;const c=pool.balls[0],p=pool.drag;pool.drag=null;let dx=c.x-p.x,dy=c.y-p.y;const d=Math.hypot(dx,dy);if(d<12){poolDraw();return;}const pw=Math.min(d,170)/170*20;c.vx=dx/d*pw;c.vy=dy/d*pw;pool.moving=true;pool.pocketedThisShot=0;document.getElementById('poolMsg').textContent='...';poolLoop();};
 poolDraw();
}
function poolLoop(){
 if(!pool)return;const B=pool.balls,R=POOL.R;
 for(let s=0;s<3;s++){
  for(const b of B){if(b.in)continue;b.x+=b.vx/3;b.y+=b.vy/3;}
  for(let i=0;i<B.length;i++){const a=B[i];if(a.in)continue;for(let j=i+1;j<B.length;j++){const b=B[j];if(b.in)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<2*R&&d>0){const nx=dx/d,ny=dy/d,ov=2*R-d;a.x-=nx*ov/2;a.y-=ny*ov/2;b.x+=nx*ov/2;b.y+=ny*ov/2;const rv=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(rv>0){a.vx-=rv*nx;a.vy-=rv*ny;b.vx+=rv*nx;b.vy+=rv*ny;}}}}
  for(const b of B){if(b.in)continue;
   for(const [px,py] of POOL.pockets){if(Math.hypot(b.x-px,b.y-py)<POOL.P+8){b.in=1;b.vx=b.vy=0;if(b.cue){pool.cueIn=1;}else{pool.score++;pool.pocketedThisShot++;}}}
   if(b.in)continue;
   if(b.x<24+R){b.x=24+R;b.vx=Math.abs(b.vx)*.9;}if(b.x>636-R){b.x=636-R;b.vx=-Math.abs(b.vx)*.9;}
   if(b.y<24+R){b.y=24+R;b.vy=Math.abs(b.vy)*.9;}if(b.y>826-R){b.y=826-R;b.vy=-Math.abs(b.vy)*.9;}}
 }
 let moving=false;for(const b of B){if(b.in)continue;b.vx*=.982;b.vy*=.982;if(Math.hypot(b.vx,b.vy)<.12){b.vx=b.vy=0;}else moving=true;}
 poolDraw();
 if(moving){poolRaf=requestAnimationFrame(poolLoop);return;}
 pool.moving=false;poolEndShot();
}
function poolEndShot(){
 const c=pool.balls[0];if(c.in){c.in=0;c.x=330;c.y=630;c.vx=c.vy=0;pool.cueIn=0;}
 document.getElementById('poolScore').textContent=pool.score;
 const left=pool.balls.filter(b=>!b.cue&&!b.in).length,msg=document.getElementById('poolMsg');
 if(pool.shot>=7||!left){
  pool.over=true;const best=+(localStorage.getItem('does_pool_best')||0);let t='خلصت! دخّلت '+pool.score+' من 6 كور.';
  if(pool.score>best){localStorage.setItem('does_pool_best',pool.score);document.getElementById('poolBest').textContent=pool.score;t+=' رقم جديد على موبايلك!';}
  msg.textContent=t;document.getElementById('poolAgain').hidden=false;poolDraw();return;
 }
 pool.shot++;document.getElementById('poolShot').textContent=pool.shot;
 msg.textContent=pool.pocketedThisShot?'حلوة! كمّل.':'ولا كورة. جرّب زاوية تانية.';poolDraw();
}
function poolDraw(){
 if(!pool)return;const c=pool.cv.getContext('2d'),B=pool.balls;c.clearRect(0,0,660,850);c.fillStyle='#241d1d';c.fillRect(0,0,660,850);
 const g=c.createLinearGradient(0,0,660,850);g.addColorStop(0,'#154e4e');g.addColorStop(1,'#062d33');c.fillStyle=g;c.fillRect(24,24,612,802);c.strokeStyle='#c7a46c';c.lineWidth=2;c.strokeRect(23,23,614,804);
 for(const [x,y] of POOL.pockets){c.fillStyle='#030d12';c.beginPath();c.arc(x,y,POOL.P+4,0,7);c.fill();}
 c.save();c.fillStyle='#8bb4b222';c.font='bold 53px Arial';c.textAlign='center';c.fillText('DOES',330,440);c.restore();
 const col=['#d2a85e','#c97b9c','#8fa8e8','#cbb5f4','#e0a060','#7fc9b4','#e8e0a0'];
 for(const b of B){if(b.in)continue;c.fillStyle=b.cue?'#f6f4ee':col[(b.n||0)%col.length];c.beginPath();c.arc(b.x,b.y,POOL.R,0,7);c.fill();if(!b.cue){c.fillStyle='#101117';c.beginPath();c.arc(b.x,b.y,7,0,7);c.fill();}}
 if(pool.drag){const q=B[0],p=pool.drag;let dx=q.x-p.x,dy=q.y-p.y;const d=Math.hypot(dx,dy)||1,pw=Math.min(d,170);c.setLineDash([8,10]);c.strokeStyle='#ffffff77';c.lineWidth=2;c.beginPath();c.moveTo(q.x,q.y);c.lineTo(q.x+dx/d*700,q.y+dy/d*700);c.stroke();c.setLineDash([]);c.strokeStyle='#e7c98f';c.lineWidth=7;c.beginPath();c.moveTo(q.x-dx/d*(24+pw*.5),q.y-dy/d*(24+pw*.5));c.lineTo(q.x-dx/d*(24+pw*.5+120),q.y-dy/d*(24+pw*.5+120));c.stroke();}
}
/* ---------- personal invitation ---------- */
function openInvite(){
 doesOpen('<h3>جمّع الشلة</h3><p class="note">اكتب اسم الشلة والمعاد. الصورة بتتجهز على موبايلك وبتتبعتها إنت لصحابك، مفيش إرسال تلقائي.</p><label for="invName">اسم الشلة</label><input id="invName" maxlength="24" placeholder="مثال: شلة آخر الأسبوع" autocomplete="off"><label for="invDate">اليوم</label><input id="invDate" type="date"><label for="invTime">الساعة</label><input id="invTime" type="time" value="20:00"><p class="note" id="invErr" style="margin-top:10px;color:#ff9ab0"></p><button class="btn" id="invMake" onclick="makeInvite()">جهّز الدعوة</button><canvas id="invCanvas" width="1080" height="1920" hidden style="width:100%;border-radius:16px;margin-top:14px;border:1px solid #453852"></canvas><button class="btn green" id="invSave" hidden onclick="saveInvite()">احفظ الدعوة كصورة ↓</button><p class="note" style="margin-top:10px">دعوة شخصية للتجمع، مش تأكيد حجز ومش بتحجز روم. الحجز بيتم من الموقع بشكل منفصل.</p><button class="btn ghost" onclick="closeModal()">إغلاق</button>');
 for(const id of ['invName','invDate','invTime'])document.getElementById(id).addEventListener('input',()=>{document.getElementById('invCanvas').hidden=true;document.getElementById('invSave').hidden=true;});
}
function inviteWhen(d,t){const [y,m,day]=d.split('-').map(Number),[hh,mm]=t.split(':').map(Number);const dt=new Date(Date.UTC(y,m-1,day,12));const ds=new Intl.DateTimeFormat('ar-EG',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(dt);const ap=hh>=12?'م':'ص';let h12=hh%12||12;return[ds,h12+(mm?':'+String(mm).padStart(2,'0'):'')+' '+ap+' · بتوقيت القاهرة'];}
async function makeInvite(){
 const err=document.getElementById('invErr'),name=document.getElementById('invName').value.trim(),d=document.getElementById('invDate').value,t=document.getElementById('invTime').value;
 if(!name||!d||!t){err.textContent='اكتب اسم الشلة واختار اليوم والساعة.';return;}
 err.textContent='جاري التجهيز…';
 try{
  await resultFonts();const logo=new Image();logo.src=document.querySelector('img.logo').src;await logo.decode();
  const [ds,ts]=inviteWhen(d,t),cv=document.getElementById('invCanvas'),c=cv.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,1080,1920);c.scale(2,2);
  c.fillStyle='#09090e';c.fillRect(0,0,540,960);let g=c.createRadialGradient(540,576,0,540,576,380);g.addColorStop(0,'#43305255');g.addColorStop(1,'#09090e00');c.fillStyle=g;c.fillRect(0,0,540,960);
  c.drawImage(logo,235,70,70,72);c.textAlign='center';c.direction='ltr';c.fillStyle='#c5b7d2';c.font='12px Arial';c.fillText('D O E S   U N D E R G R O U N D',270,178);
  const L=45,Rr=495,T=230,Bm=640;c.strokeStyle='#8f7c9b';c.lineWidth=1;c.strokeRect(L,T,Rr-L,Bm-T);
  for(const x of [L,Rr]){c.fillStyle='#0c0912';c.beginPath();c.arc(x,435,13,0,7);c.fill();c.stroke();}
  c.fillStyle='#a69aaf';c.font='10px Arial';c.fillText('Y O U ’ R E   I N V I T E D',270,276);
  c.direction='rtl';c.fillStyle='#f4ecfb';let sz=36;do{c.font=sz+'px DoesKufiBold';sz--;}while(c.measureText(name).width>360&&sz>14);c.fillText(name,270,338);
  c.fillStyle='#c8bbd0';c.font='16px DoesKufi';c.fillText('سيبها على جنب. القعدة دي لينا.',270,392);
  c.strokeStyle='#62506e';c.setLineDash([4,4]);c.beginPath();c.moveTo(70,430);c.lineTo(470,430);c.stroke();c.moveTo(70,540);c.lineTo(470,540);c.stroke();c.setLineDash([]);
  c.fillStyle='#f4ecfb';c.font='20px DoesKufiBold';c.fillText(ds,270,472);c.font='18px DoesKufi';c.fillStyle='#d8cbe2';c.fillText(ts,270,506);
  c.direction='ltr';c.fillStyle='#f4ecfb';c.font='600 17px Arial';c.fillText('DOES UNDERGROUND',270,580);c.direction='rtl';c.fillStyle='#a395ad';c.font='13px DoesKufi';c.fillText('دمنهور',270,608);
  c.font='12px DoesKufi';c.fillStyle='#a395ad';c.fillText('دعوة شخصية للتجمع، مش تأكيد حجز',270,720);c.fillText('راجعوا حجز المكان بشكل منفصل',270,744);
  cv.hidden=false;document.getElementById('invSave').hidden=false;err.style.color='';err.textContent='الدعوة جاهزة. راجعها قبل الحفظ.';
 }catch(e){err.textContent='تعذر تجهيز الصورة. حاول تاني.';}
}
function saveInvite(){
 const cv=document.getElementById('invCanvas');if(!cv||cv.hidden)return;
 cv.toBlob(async blob=>{if(!blob)return;const f=new File([blob],'DOES-invitation.png',{type:'image/png'});
  try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f]});return;}}catch(e){if(e&&e.name==='AbortError')return;}
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='DOES-invitation.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);},'image/png');
}
window.openMiniGame=openMiniGame;window.openInvite=openInvite;window.openAllSections=openAllSections;
