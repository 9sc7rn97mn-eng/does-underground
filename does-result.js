/* Story artwork is generated only on this device. No submission or standings. */
let doesResultFonts;
function resultFonts(){
 if(!doesResultFonts)doesResultFonts=Promise.all([
  new FontFace('DoesKufi','url(./does-kufi.ttf)').load(),
  new FontFace('DoesKufiBold','url(./does-kufi-semibold.ttf)').load(),
  new FontFace('DoesScore','url(./does-score.ttf)').load()
 ]).then(fs=>fs.forEach(f=>document.fonts.add(f)));
 return doesResultFonts;
}
function openResultCard(){
 document.getElementById('modal').innerHTML='<h3>مين كسب القعدة؟</h3><p class="note">استخدم أسامي مستعارة. البيانات والصورة بتتجهز على جهازك بس، ومش بتتبعت للمكان.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><label for="resultName1">الاسم الأول</label><input id="resultName1" maxlength="18" placeholder="اسم مستعار" autocomplete="off"><label for="resultScore1">نتيجته</label><input id="resultScore1" inputmode="numeric" type="number" min="0" max="99" step="1" value="0"></div><div><label for="resultName2">الاسم التاني</label><input id="resultName2" maxlength="18" placeholder="اسم مستعار" autocomplete="off"><label for="resultScore2">نتيجته</label><input id="resultScore2" inputmode="numeric" type="number" min="0" max="99" step="1" value="0"></div></div><p class="note" style="margin-top:12px">الاسم الأول تحت النتيجة اليمين في الكارت.</p><button class="btn" id="resultPreviewBtn" style="margin-top:12px" onclick="previewResultCard()">اعرض الكارت</button><p id="resultError" role="status" class="note"></p><canvas id="doesResultCanvas" width="1080" height="1920" hidden style="display:block;width:100%;height:auto;border:1px solid var(--line);border-radius:12px;margin-top:14px" aria-label="معاينة كارت النتيجة"></canvas><button class="btn" id="resultSaveBtn" hidden style="margin-top:12px" onclick="saveResultCard()">حفظ صورة PNG للستوري ↓</button><p class="note" id="resultSaveHelp" hidden>لو الصورة اتفتحت في تبويب جديد، اضغط عليها مطولًا واختار حفظ الصورة. النتيجة بإدخال اللاعبين، مش نتيجة رسمية معتمدة. المشاركة باختيارك من تطبيقك.</p><button class="btn ghost" style="margin-top:12px" onclick="closeModal()">إغلاق</button>';
 document.getElementById('overlay').classList.add('open');document.getElementById('modal').scrollTop=0;
 for(const el of document.querySelectorAll('#resultName1,#resultName2,#resultScore1,#resultScore2'))el.addEventListener('input',()=>{document.getElementById('doesResultCanvas').hidden=true;document.getElementById('resultSaveBtn').hidden=true;document.getElementById('resultSaveHelp').hidden=true;});
}
async function previewResultCard(){
 const err=document.getElementById('resultError'),btn=document.getElementById('resultPreviewBtn');
 const names=[1,2].map(i=>document.getElementById('resultName'+i).value.trim());
 const scores=[1,2].map(i=>document.getElementById('resultScore'+i).value.trim());
 if(names.some(x=>!x)||scores.some(x=>!/^\d{1,2}$/.test(x))){err.textContent='اكتب اسمين مستعارين ونتيجتين صحيحتين من 0 لـ99.';return;}
 btn.disabled=true;err.textContent='جاري تجهيز الكارت…';
 try{
  await resultFonts();const logo=new Image();logo.src=document.querySelector('img.logo').src;await logo.decode();
  const cv=document.getElementById('doesResultCanvas');if(!cv)return;const c=cv.getContext('2d');c.resetTransform();c.clearRect(0,0,1080,1920);c.scale(2,2);
  c.fillStyle='#09090e';c.fillRect(0,0,540,960);
  let g=c.createRadialGradient(-80,405,0,-80,405,420);g.addColorStop(0,'#2d326755');g.addColorStop(1,'#09090e00');c.fillStyle=g;c.fillRect(0,0,540,960);
  g=c.createRadialGradient(620,500,0,620,500,430);g.addColorStop(0,'#63294055');g.addColorStop(1,'#09090e00');c.fillStyle=g;c.fillRect(0,0,540,960);
  c.drawImage(logo,145,70,67,69);c.textAlign='left';c.direction='ltr';c.fillStyle='#f7f5fc';c.font='600 22px Arial';c.fillText('D O E S',229,99);c.fillStyle='#aaa2b5';c.font='10px Arial';c.fillText('U N D E R G R O U N D',229,122);
  c.textAlign='center';c.fillStyle='#ada4ba';c.font='11px Arial';c.fillText('T H E   F I N A L   S C O R E',270,190);
  c.direction='rtl';c.font='29px DoesKufiBold';c.fillStyle='#f7f5fc';c.fillText('القعدة خلصت كده!',270,249);
  c.strokeStyle='#ffffff13';c.lineWidth=1;c.beginPath();c.moveTo(40,301);c.lineTo(500,301);c.lineTo(500,581);c.moveTo(447,634);c.lineTo(40,634);c.closePath();c.stroke();
  const metal=c.createLinearGradient(0,350,0,510);metal.addColorStop(0,'#ffffff');metal.addColorStop(.7,'#aaa6b8');metal.addColorStop(1,'#f5f1fb');c.fillStyle=metal;c.direction='ltr';c.font='176px DoesScore';
  function number(x,v){c.save();const width=c.measureText(v).width;if(width>181){c.translate(x,0);c.scale(181/width,1);c.fillText(v,0,481);}else c.fillText(v,x,481);c.restore();}
  number(158,scores[1]);number(382,scores[0]);c.fillStyle='#685f78';c.font='37px DoesScore';c.fillText(':',270,448);
  for(let i=0;i<2;i++){let x=i===0?382:158;c.fillStyle=i===0?'#e271b1':'#9c8aff';c.fillRect(x-32,534,64,2);c.fillStyle='#f7f5fc';c.direction='rtl';let size=23;do{c.font=size+'px DoesKufiBold';size--;}while(c.measureText(names[i]).width>190&&size>10);c.fillText(names[i],x,587);}
  c.strokeStyle='#51445b';c.lineWidth=1;c.beginPath();c.moveTo(106,704);c.lineTo(213,704);c.moveTo(327,704);c.lineTo(434,704);c.stroke();
  c.save();c.translate(233,660);g=c.createLinearGradient(10,0,70,0);g.addColorStop(0,'#747080');g.addColorStop(.28,'#f0edf5');g.addColorStop(.5,'#aaa4b8');g.addColorStop(.75,'#ece8f3');g.addColorStop(1,'#5a526a');c.fillStyle=g;c.strokeStyle=g;c.lineWidth=4;c.beginPath();c.moveTo(22,12);c.lineTo(58,12);c.lineTo(58,40);c.bezierCurveTo(58,75,22,75,22,40);c.closePath();c.fill();c.beginPath();c.moveTo(22,20);c.lineTo(10,20);c.lineTo(10,33);c.quadraticCurveTo(10,50,28,53);c.moveTo(58,20);c.lineTo(70,20);c.lineTo(70,33);c.quadraticCurveTo(70,50,52,53);c.stroke();c.lineWidth=6;c.beginPath();c.moveTo(40,65);c.lineTo(40,82);c.moveTo(26,88);c.lineTo(54,88);c.stroke();c.restore();
  c.direction='rtl';c.fillStyle='#f7f5fc';c.font='22px DoesKufiBold';c.fillText('الريماتش على مين؟',270,812);
  c.fillStyle='#66536c';c.fillRect(256,862,28,2);c.fillStyle='#8d829b';c.font='10px DoesKufi';c.fillText('النتيجة بإدخال اللاعبين',270,895);c.fillText('مش نتيجة رسمية معتمدة من المكان',270,918);
  cv.hidden=false;document.getElementById('resultSaveBtn').hidden=false;document.getElementById('resultSaveHelp').hidden=false;err.textContent='الكارت جاهز. راجع الأسامي والنتيجة قبل الحفظ.';
 }catch(e){err.textContent='تعذر تجهيز الصورة. راجع الاتصال وحاول تاني.';}finally{btn.disabled=false;}
}
function saveResultCard(){
 const cv=document.getElementById('doesResultCanvas');if(!cv||cv.hidden)return;
 cv.toBlob(blob=>{if(!blob){document.getElementById('resultError').textContent='تعذر حفظ الصورة، حاول تاني.';return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='DOES-result.png';a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);},'image/png');
}
