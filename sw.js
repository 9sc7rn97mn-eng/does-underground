const U='https://vjvwjnnlmcofeufawnqq.supabase.co',K='sb_publishable_nzJJp96sUGVPMCs_bDUmoQ_13hM7juc',R={'marvel': 'Room Marvel', 'porsche': 'Room Porsche', 'room5': 'Room 5', 'galaxy': 'Galaxy Room', 'blue': 'Blue Table', 'red': 'Red Table', 'pong': 'King Pong Room', 'netflix': 'Room Netflix VIP'};
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{e.waitUntil((async()=>{
  let body='فيه طلب حجز جديد بانتظار ردك';
  try{const r=await fetch(U+'/rest/v1/rpc/dug_push_latest',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json',apikey:K,Authorization:'Bearer '+K},body:'{}'});
    const j=await r.json();
    if(j&&j.room){body='طلب حجز جديد: '+(R[j.room]||j.room)+(j.date?'، '+j.date:'')+(j.start?' '+j.start:'');}
  }catch(_){}
  await self.registration.showNotification('DOES Underground',{body:body,icon:'./does-icon-192.png',badge:'./does-icon-192.png',tag:'dug-new-request',renotify:true,dir:'rtl',lang:'ar'});
})());});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil((async()=>{
  const u=new URL('./#dug7-admin-x9k2',self.registration.scope).href;
  const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const c of cs){if('focus' in c){try{await c.focus();return;}catch(_){}}}
  await self.clients.openWindow(u);
})());});
