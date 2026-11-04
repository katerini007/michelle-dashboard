import { webcrypto as c } from 'crypto'; import fs from 'fs';
const page=fs.readFileSync('index.html','utf8');
const g=n=>page.match(new RegExp(n+'="([^"]+)"'))[1];
const dec=s=>Uint8Array.from(Buffer.from(s,'base64'));
const bk=await c.subtle.importKey('raw',new TextEncoder().encode('famous'),'PBKDF2',false,['deriveKey']);
const k=await c.subtle.deriveKey({name:'PBKDF2',salt:dec(g('SALT')),iterations:+page.match(/ITER=(\d+)/)[1],hash:'SHA-256'},bk,{name:'AES-GCM',length:256},false,['decrypt']);
const pt=new TextDecoder().decode(await c.subtle.decrypt({name:'AES-GCM',iv:dec(g('IV'))},k,dec(g('CT'))));
console.log("'famous' decrypts OK:", pt.includes('Running reels') && pt.includes('Our conclusion'));
