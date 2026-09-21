import fs from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const file='src/catalog/data/protoss.json';
const d=JSON.parse(fs.readFileSync(file,'utf8'));
const a=(name,phase,type,cost,en,es)=>({name,phase,type,cost,fromUpgrade:false,...(cost!==null?{resource:'PE'}:{}),text:{en,es}});
d.unitCards.push({id:'protoss.card.zeratul',race:'PROTOSS',name:'Zeratul',baseSize:d.unitCards.find(c=>c.name==='Artanis').baseSize,combatTags:['BIOLOGICAL','PSIONIC','GROUND'],profile:{shield:'3',speed:'7',armour:'5+',evade:'5+',hitPoints:'5',size:'2'},supplyProfile:[{minModels:1,maxModels:1,supply:1}],imageRefFront:'cards/protoss/unit-zeratul-front.webp',weapons:[{name:'Master Warp Blade',phase:'COMBAT',range:'E',target:'Ground',rateOfAttack:'4',hit:'3+',surgeType:'Light, Armoured',surgeDice:'D3',damage:'2',keywords:['INSTANT']}],abilities:[
a('One with the Shadows','ANY','PASSIVE',null,'After this Unit fully resolves an Action, it gains the HIDDEN Status.','Después de que esta unidad resuelva por completo una Acción, gana el estado HIDDEN.'),
a('Prophetic Vision','ANY','REACTION',1,'REPEATABLE. Use when this Unit is selected as the target of an attack. This Unit’s Evade characteristic is treated as 4+ against this attack.','REPETIBLE. Úsala cuando esta unidad sea seleccionada como objetivo de un ataque. Su Evasión se considera 4+ contra este ataque.'),
a('Sentenced to Death','MOVEMENT','ACTIVE',1,'Target Enemy Unit on the battlefield. Whenever Zeratul makes a Close Combat Attack targeting the selected Unit, its weapon gains CRITICAL HIT (2).','Selecciona una unidad enemiga en el campo de batalla. Cada vez que Zeratul realice un Ataque de Combate Cuerpo a Cuerpo contra la unidad seleccionada, su arma gana CRITICAL HIT (2).'),
a('Void Prison','MOVEMENT','ACTIVE',1,'Set a Faction Indicator on the battlefield Within 8" of this Unit. While Enemy Units are Within 2" of this Faction Indicator they suffer DEBUFF Speed (2).','Coloca un Indicador de Facción en el campo de batalla a menos de 8" de esta unidad. Mientras las unidades enemigas estén a menos de 2" de este indicador, sufren DEBUFF Velocidad (2).'),
a('Blink','MOVEMENT','ACTIVE',1,'Resolve the PLACE (6) effect. Models set by this effect cannot be set up Within the Engagement Range of any Enemy Unit.','Resuelve el efecto PLACE (6). Las miniaturas colocadas mediante este efecto no pueden colocarse dentro del Alcance de Enfrentamiento de ninguna unidad enemiga.'),
a('Devastating Charge','ASSAULT','PASSIVE',null,'Immediately after this Unit completes a successful Charge, resolve the IMPACT (4) 4+ effect.','Inmediatamente después de que esta unidad complete una Carga con éxito, resuelve el efecto IMPACT (4) 4+.'),
a('Shadow Strike','COMBAT','ACTIVE',1,'All Enemy Units Engaged with this Unit suffer HITS 4 (1).','Todas las unidades enemigas trabadas con esta unidad sufren HITS 4 (1).')
]});
d.unitEntries.push({id:'protoss.entry.zeratul',seedId:4310,cardId:'protoss.card.zeratul',race:'PROTOSS',name:'Zeratul',tags:['PROTOSS'],slotType:'HERO',combatRole:{es:'Sin confirmar',en:'Unconfirmed'},unique:true,summoned:false,compositions:[{id:'1',models:1,mineralCost:230,supplyValue:1}],upgrades:[]});
fs.writeFileSync(file,JSON.stringify(d,null,2)+'\n');
for(const race of ['core','scenarios','protoss','terran','zerg']){const path=`src/catalog/data/${race}.json`;const value=JSON.parse(fs.readFileSync(path,'utf8'));value.contentVersion='2026.09.21.3';fs.writeFileSync(path,JSON.stringify(value,null,2)+'\n');}
const sourcePath='docs/sources/2026-09-21/WhatsApp Image 2026-09-21 at 16.11.22.jpeg';
await sharp(sourcePath).webp({quality:96,effort:6}).toFile('public/cards/protoss/unit-zeratul-front.webp');
await sharp(sourcePath).extract({left:143,top:205,width:420,height:700}).resize({width:280}).jpeg({quality:90}).toFile('public/cards/protoss/mini-zeratul.jpg');
const path='tools/extract/card-assets.manifest.json',manifest=JSON.parse(fs.readFileSync(path,'utf8'));
manifest.sources['attachment-unit-zeratul-front']={path:sourcePath,sha256:createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex'),format:'image'};
manifest.assets.push({id:'protoss.unit-zeratul-front',source:'attachment-unit-zeratul-front',layout:'attachment',output:'cards/protoss/unit-zeratul-front.webp'});
fs.writeFileSync(path,JSON.stringify(manifest,null,2)+'\n');
