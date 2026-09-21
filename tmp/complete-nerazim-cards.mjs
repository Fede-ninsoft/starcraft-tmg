import fs from 'node:fs';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
const read=r=>JSON.parse(fs.readFileSync(`src/catalog/data/${r}.json`,'utf8'));
const p=read('protoss'),t=read('terran');
const a=(name,phase,type,en,es,cost=null)=>({name,phase,type,cost,fromUpgrade:false,text:{en,es}});
const adept=p.unitCards.find(c=>c.id==='protoss.card.adept');
p.unitCards.push({...structuredClone(adept),id:'protoss.card.nerazim_watchers',name:'Nerazim Watchers (Adept)',imageRefFront:'cards/protoss/unit-nerazim-watchers-front.webp',imageRefBack:undefined,
weapons:[{...adept.weapons[0],rateOfAttack:'3',keywords:['ANTI-EVADE (1)','PINPOINT']},{...adept.weapons[1],hit:'5+'}],
abilities:[
a('Path of Shadows','ANY','ACTIVE','This Unit gains HIDDEN Status until it performs another action.','Esta unidad gana el estado HIDDEN hasta que realice otra acción.',1),
a('Nerazim Farsight','ANY','PASSIVE','While Enemy Units are Within 6" of a Shade token, they lose HIDDEN Status.','Mientras las unidades enemigas estén a menos de 6" de una ficha Shade, pierden el estado HIDDEN.'),
structuredClone(adept.abilities[0])
]});
p.unitEntries.push({id:'protoss.entry.nerazim_watchers',seedId:4309,cardId:'protoss.card.nerazim_watchers',race:'PROTOSS',name:'Nerazim Watchers (Adept)',tags:['PROTOSS','NERAZIM'],slotType:'CORE',combatRole:{es:'Sin confirmar',en:'Unconfirmed'},unique:false,summoned:false,compositions:[{id:'4',models:4,mineralCost:210,supplyValue:1}],upgrades:[]});
const tactical=(race,id,seedId,name,cost,slots,unique,resource,tags,abilities)=>({id:`${race.toLowerCase()}.tactical.${id}`,seedId,race,name,tags,vespeneCost:cost,slotsGranted:slots,unique,resource,resourcePerRound:1,abilities,imageRef:`cards/${race.toLowerCase()}/tactical-${id.replaceAll('_','-')}.webp`});
p.tacticalCards.push(tactical('PROTOSS','robotics_facility',2311,'Robotics Facility',35,{ELITE:2},false,'PE',['PROTOSS'],[
a('Plasma Shields','ANY','REACTION','Use before a Friendly Mechanical Ground Unit makes an Armour Roll. If this Unit has the Shielded Status, it gains TOUGH (1) and DODGE (1) for this roll.','Úsala antes de que una unidad amiga Mecánica Terrestre haga una Tirada de Armadura. Si tiene el estado Shielded, gana TOUGH (1) y DODGE (1) para esta tirada.')
]),tactical('PROTOSS','void_seeker',2312,'Void Seeker',40,{CORE:1},true,'PE',['PROTOSS','NERAZIM'],[
a('Personal Transport','MOVEMENT','ACTIVE','Instead of performing an action, the active, Unengaged Ground Unit is returned to Reserves. Then, it performs a Deploy action.','En lugar de realizar una acción, la unidad Terrestre activa y no trabada vuelve a Reservas. Después realiza una acción de Despliegue.'),
a("Anakh Su'n",'MOVEMENT','ACTIVE','This Unit gains the HIDDEN Status until it performs another action.','Esta unidad gana el estado HIDDEN hasta que realice otra acción.')
]));
t.tacticalCards.push(tactical('TERRAN','factory_tech_lab',2211,'Factory (Tech Lab)',40,{ELITE:2},true,'CP',['TERRAN'],[
a('Field Repair','MOVEMENT','ACTIVE','The active Mechanical Unit resolves the HEAL (2) effect.','La unidad Mecánica activa resuelve el efecto HEAL (2).'),
a("Pound 'Em Flat!",'ASSAULT','ACTIVE','If the active Mechanical Unit has the Stationary Status, its first Ranged Weapon used gains PRECISION (2).','Si la unidad Mecánica activa tiene el estado Stationary, su primera arma a distancia utilizada gana PRECISION (2).')
]));
for(const race of ['core','scenarios','protoss','terran','zerg']){const d=race==='protoss'?p:race==='terran'?t:read(race);d.contentVersion='2026.09.21.2';fs.writeFileSync(`src/catalog/data/${race}.json`,JSON.stringify(d,null,2)+'\n');}
const manifest=JSON.parse(fs.readFileSync('tools/extract/card-assets.manifest.json','utf8'));
const sources=[['protoss','unit-nerazim-watchers-front','20 (2)'],['protoss','tactical-robotics-facility','21 (1)'],['protoss','tactical-void-seeker','21 (2)'],['terran','tactical-factory-tech-lab','20']];
for(const [race,slug,suffix] of sources){
 const sourcePath=`docs/sources/2026-09-21/WhatsApp Image 2026-09-21 at 16.11.${suffix}.jpeg`;
 const source=`attachment-${slug}`,output=`cards/${race}/${slug}.webp`;
 manifest.sources[source]={path:sourcePath,sha256:createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex'),format:'image'};
 manifest.assets.push({id:`${race}.${slug}`,source,layout:'attachment',output});
 await sharp(sourcePath).webp({quality:96,effort:6}).toFile(`public/${output}`);
}
await sharp('docs/sources/2026-09-21/WhatsApp Image 2026-09-21 at 16.11.20 (2).jpeg').extract({left:143,top:160,width:420,height:750}).resize({width:280}).jpeg({quality:90}).toFile('public/cards/protoss/mini-nerazim_watchers.jpg');
fs.writeFileSync('tools/extract/card-assets.manifest.json',JSON.stringify(manifest,null,2)+'\n');
for(const [input,output] of [['ec4bf70a-cc87-479a-ab67-badad65895bb','protoss-tactical-costs'],['c4fae684-4f1b-4a15-b70a-7ec614e21b0a','terran-tactical-costs'],['2dc7c607-adc8-48e8-a63d-1acbc8a35410','nerazim-watchers-core']])fs.copyFileSync(`C:/Users/FEde/AppData/Local/Temp/codex-clipboard-${input}.png`,`docs/sources/2026-09-21/${output}.png`);
