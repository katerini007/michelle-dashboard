import { webcrypto as c } from 'crypto';
import fs from 'fs';
const [,, inPath, outPath, password] = process.argv;
const enc = new TextEncoder();
const html = fs.readFileSync(inPath);
const salt = c.getRandomValues(new Uint8Array(16));
const iv = c.getRandomValues(new Uint8Array(12));
const ITER = 200000;
const baseKey = await c.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await c.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITER,hash:'SHA-256'}, baseKey, {name:'AES-GCM',length:256}, false, ['encrypt']);
const ct = new Uint8Array(await c.subtle.encrypt({name:'AES-GCM',iv}, key, html));
const b64 = u => Buffer.from(u).toString('base64');
const page = `<!doctype html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Michelle — Reels Lab</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0f1117;color:#e8eaf0;font:16px/1.5 -apple-system,Segoe UI,Roboto,sans-serif}
.box{background:#171a23;border:1px solid #2a2f3c;border-radius:14px;padding:32px;width:min(92vw,360px);text-align:center}
h1{font-size:19px;margin:0 0 6px}p{color:#9aa3b2;font-size:13px;margin:0 0 18px}
input{width:100%;padding:11px 13px;border-radius:9px;border:1px solid #2a2f3c;background:#0f1117;color:#e8eaf0;font-size:15px;box-sizing:border-box}
button{margin-top:12px;width:100%;padding:11px;border:0;border-radius:9px;background:#b9a4ff;color:#1a1230;font-weight:700;font-size:15px;cursor:pointer}
.err{color:#e0836a;font-size:13px;min-height:18px;margin-top:10px}</style></head>
<body><div class=box><h1>🏃‍♀️ Michelle — Reels Lab</h1><p>Private analysis. Enter the password to view.</p>
<form id=f><input id=p type=password placeholder="Password" autofocus autocomplete=off><button>View dashboard</button><div class=err id=e></div></form></div>
<script>
const SALT="${b64(salt)}",IV="${b64(iv)}",CT="${b64(ct)}",ITER=${ITER};
const dec=s=>Uint8Array.from(atob(s),x=>x.charCodeAt(0));
document.getElementById('f').addEventListener('submit',async ev=>{ev.preventDefault();const e=document.getElementById('e');e.textContent='Decrypting…';
try{const bk=await crypto.subtle.importKey('raw',new TextEncoder().encode(document.getElementById('p').value),'PBKDF2',false,['deriveKey']);
const k=await crypto.subtle.deriveKey({name:'PBKDF2',salt:dec(SALT),iterations:ITER,hash:'SHA-256'},bk,{name:'AES-GCM',length:256},false,['decrypt']);
const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:dec(IV)},k,dec(CT));
const html=new TextDecoder().decode(pt);document.open();document.write(html);document.close();
}catch(x){e.textContent='Wrong password.';}});
</script></body></html>`;
fs.writeFileSync(outPath, page);
console.log('wrote', outPath, Math.round(page.length/1024)+'KB');
