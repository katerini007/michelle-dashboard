import { webcrypto as c } from 'crypto';
import fs from 'fs';
const page = fs.readFileSync("/Volumes/KINGSTON/Zero to Real Marketing Agency/Michelle Alemi/michelle_dashboard_PROTECTED.html",'utf8');
const g = n => page.match(new RegExp(n+'="([^"]+)"'))[1];
const SALT=g('SALT'),IV=g('IV'),CT=g('CT'),ITER=+page.match(/ITER=(\d+)/)[1];
const dec=s=>Uint8Array.from(Buffer.from(s,'base64'));
const pw='meesh-runs';
const bk=await c.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);
const k=await c.subtle.deriveKey({name:'PBKDF2',salt:dec(SALT),iterations:ITER,hash:'SHA-256'},bk,{name:'AES-GCM',length:256},false,['decrypt']);
const pt=new TextDecoder().decode(await c.subtle.decrypt({name:'AES-GCM',iv:dec(IV)},k,dec(CT)));
const orig=fs.readFileSync("/Volumes/KINGSTON/Zero to Real Marketing Agency/Michelle Alemi/michelle_running_reels_dashboard.html",'utf8');
console.log('decrypt OK:', pt===orig, '| contains Running tab:', pt.includes('Running reels'), '| wrong-pass test below');
try{const bk2=await c.subtle.importKey('raw',new TextEncoder().encode('wrong'),'PBKDF2',false,['deriveKey']);const k2=await c.subtle.deriveKey({name:'PBKDF2',salt:dec(SALT),iterations:ITER,hash:'SHA-256'},bk2,{name:'AES-GCM',length:256},false,['decrypt']);await c.subtle.decrypt({name:'AES-GCM',iv:dec(IV)},k2,dec(CT));console.log('wrong pass: DECRYPTED (BAD)');}catch(e){console.log('wrong pass: rejected (good)');}
