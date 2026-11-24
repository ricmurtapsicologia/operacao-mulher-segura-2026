import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base='https://ricmurtapsicologia.github.io/operacao-mulher-segura-2026/';
const source=await fs.readFile(new URL('../index.html',import.meta.url),'utf8');
const forms=JSON.parse(source.match(/const FORMS=Object\.freeze\((\{[^\n]+\})\);/)[1]);
const build=source.match(/name="build" content="([^"]+)"/)[1];
const units={'Subdiretor':1,'Gabinete - Secretaria':1,'DAI/1':3,'DAI/2 - Coordenação':1,'DAI/2 - AFAS':1,'DAI/2 - ALMG':2,'DAI/2 - Intendência':6,'DAI/2 - CEDEC':6,'DAI/2 - CTPM':14,'DAI/2 - GMG':8,'DAI/2 - MPMG':6,'DAI/2 - OGE':4,'DAI/2 - SALVAR':5,'DAI/2 - SEMAD/IEF':1,'DAI/2 - SENASP/MJSP':1,'DAI/2 - TJMG':6,'DAI/2 - TJMMG':8,'DAI/3':4,'ASPAR':1,'AEST':5};
assert.equal(Object.keys(units).length,20);
assert.equal(Object.values(units).reduce((a,b)=>a+b,0),84);
for(const url of Object.values(forms))assert.match(url,/^https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform$/);
const browser=await chromium.launch({headless:true});
const results=[];
async function check(label,fn){try{await fn();results.push({label,ok:true});console.log('PASS',label);}catch(e){results.push({label,ok:false,error:String(e.message).slice(0,220)});console.error('FAIL',label,String(e.message).slice(0,220));}}
async function published(){for(let i=0;i<12;i++){try{const r=await fetch(base+'?qa='+Date.now(),{cache:'no-store'});if(r.ok&&(await r.text()).includes('name="build" content="'+build+'"'))return;}catch{}await new Promise(r=>setTimeout(r,15000));}throw Error('Versão publicada não confirmada');}
try{
 await check('Versão publicada e cartão social',async()=>{await published();const r=await fetch(base+'social-preview.png');assert.equal(r.status,200);const a=new Uint8Array(await r.arrayBuffer());assert.equal(a[0],137);assert.equal(a[1],80);assert.equal(new DataView(a.buffer).getUint32(16),600);assert.equal(new DataView(a.buffer).getUint32(20),315);});
 for(const [phase,day] of [['preAnuncio','24'],['anuncio','25']]){
   for(const viewport of [{width:390,height:844},{width:1366,height:768}]){
     await check('Página '+phase+' '+viewport.width,async()=>{
       const context=await browser.newContext({viewport,timezoneId:'America/Sao_Paulo',locale:'pt-BR'});
       try{const page=await context.newPage();await page.clock.install({time:new Date('2026-11-'+day+'T15:00:00Z')});await page.goto(base+'?qa='+Date.now(),{waitUntil:'domcontentloaded'});assert.equal(await page.locator('meta[name=build]').getAttribute('content'),build);await page.locator('#abrirRegistro').click();await page.locator('#registroFrame').waitFor({state:'visible'});assert.equal(await page.locator('#registroFrame').getAttribute('src'),forms[phase]+'?embedded=true');assert.ok((await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)));assert.equal(context.pages().length,1);await page.frameLocator('#registroFrame').getByRole('listbox').first().waitFor({timeout:30000});}finally{await context.close();}
     });
   }
   for(const [unit,count] of Object.entries(units)){
     await check(phase+' / '+unit+' / '+count,async()=>{
       const context=await browser.newContext({locale:'pt-BR'});
       try{
         const page=await context.newPage();await page.goto(forms[phase],{waitUntil:'domcontentloaded',timeout:45000});
         const box=page.getByRole('listbox').first();await box.waitFor({timeout:20000});await box.click();
         await page.getByRole('option',{name:unit,exact:true}).filter({visible:true}).first().click();
         await page.getByRole('button',{name:/^(Avançar|Next)$/i}).click();
         await page.getByText('Participação individual — '+unit,{exact:true}).waitFor({timeout:20000});
         const radios=page.getByRole('radio').filter({visible:true});
         assert.equal(await radios.count(),count*2+2,'Grade nominal e opções de confirmação');
         // Percorre a rota de impedimento; nunca aciona Enviar/Submit.
         for(let i=0;i<count;i++)await radios.nth(i*2+(i===0?1:0)).click();
         await page.getByRole('radio',{name:'Há impedidos',exact:true}).click();
         await page.getByRole('button',{name:/^(Avançar|Next)$/i}).click();
         await page.getByText('Justificativas — '+unit,{exact:true}).waitFor({timeout:20000});
       }finally{await context.close();}
     });
   }
 }
}finally{await browser.close();await fs.writeFile('qa-result.json',JSON.stringify({build,results,submitted:false},null,2));}
assert.ok(results.every(r=>r.ok),'Auditoria de navegador falhou; confira os resultados.');
