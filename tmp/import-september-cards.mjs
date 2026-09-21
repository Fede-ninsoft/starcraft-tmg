import fs from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const read = r => JSON.parse(fs.readFileSync(`src/catalog/data/${r}.json`, 'utf8'));
const data = Object.fromEntries(['protoss', 'terran', 'zerg'].map(r => [r, read(r)]));
const text = (en, es) => ({ en, es });
const ability = (name, phase, type, cost, en, es, resource) => ({ name, phase, type, cost, fromUpgrade: false, text: text(en, es), ...(resource ? { resource } : {}) });
const weapon = (name, phase, range, target, rateOfAttack, hit, surgeType, surgeDice, damage, keywords = []) => ({ name, phase, range, target, rateOfAttack, hit, surgeType, surgeDice, damage, keywords });
const upgrade = (id, seedId, name, costs, a, replacesWeapon = null, weapons = []) => ({ id, seedId, name, specialist: false, replacesWeapon, costByComposition: costs, grantsWeapons: weapons, grantsAbilities: a ? [{ ...a, fromUpgrade: true }] : [], ...(!a ? { text: text(`Replaces ${replacesWeapon} with ${name}.`, `Sustituye ${replacesWeapon} por ${name}.`) } : {}) });
const charge = (dice, hit) => ability('Devastating Charge', 'ASSAULT', 'PASSIVE', null, `Immediately after this Unit completes a successful Charge, resolve the IMPACT (${dice}) ${hit}+ effect.`, `Inmediatamente después de que esta unidad complete una Carga con éxito, resuelve el efecto IMPACT (${dice}) ${hit}+.`);
const indomitable = ability('Indomitable', 'ASSAULT', 'PASSIVE', null, 'While Engaged, this Unit may target and be targeted by Unengaged Enemy Units. In both cases, the defending Unit gains an Evade Roll against those attacks.', 'Mientras está trabada, esta unidad puede atacar y ser atacada por unidades enemigas no trabadas. En ambos casos, la unidad defensora obtiene una Tirada de Evasión contra esos ataques.');
function unit(r, slug, name, seedId, baseSize, profile, combatTags, slotType, role, compositions, supplyProfile, weapons, abilities, upgrades) {
  data[r].unitCards.push({ id: `${r}.card.${slug}`, race: r.toUpperCase(), name, baseSize, profile, combatTags, supplyProfile, weapons, abilities, imageRefFront: `cards/${r}/unit-${slug.replaceAll('_','-')}-front.webp`, imageRefBack: `cards/${r}/unit-${slug.replaceAll('_','-')}-back.webp` });
  data[r].unitEntries.push({ id: `${r}.entry.${slug}`, seedId, cardId: `${r}.card.${slug}`, race: r.toUpperCase(), name, tags: [r.toUpperCase()], slotType, combatRole: role, unique: false, summoned: false, compositions: compositions.map(([models, mineralCost, supplyValue]) => ({ id: String(models), models, mineralCost, supplyValue })), upgrades });
}
unit('zerg', 'ravager', 'Ravager', 4113, '80mm', { size:'3', hitPoints:'9', evade:'5+', armour:'5+', speed:'4/8', shield:null }, ['ARMOURED','BIOLOGICAL','GROUND'], 'CORE', text('Tactician','Táctico'), [[1,160,1],[2,270,2]], [{minModels:1,maxModels:1,supply:1},{minModels:2,maxModels:2,supply:2}], [weapon('Plasma Discharge','ASSAULT','12','Ground','4','3+','Light','D3+1','1'),weapon('Claws','COMBAT','E','Ground','2','4+',null,null,'1')], [
  ability('Squadron','ANY','PASSIVE',null,'This Unit’s Horizontal Coherency is 4".','La Coherencia Horizontal de esta unidad es de 4".'),
  ability('Corrosive Bile','MOVEMENT','ACTIVE',1,'For each model in this Unit, set one Corrosive Bile token on the battlefield Within 14" of that model. These tokens are not removed if this Unit is Destroyed. At the End of the Assault Phase, each Unit suffers HITS 5 (1) effect for each of this Unit’s Corrosive Bile tokens it is Within 1" of. Then, remove all of this Unit’s Corrosive Bile tokens from the battlefield.','Por cada miniatura de esta unidad, coloca una ficha de Corrosive Bile a menos de 14" de ella. Las fichas no se retiran si esta unidad es destruida. Al final de la Fase de Asalto, cada unidad sufre HITS 5 (1) por cada ficha de Corrosive Bile de esta unidad que tenga a menos de 1". Después, retira todas las fichas de Corrosive Bile de esta unidad.','BM'),
  ability('Deep Tunnel','MOVEMENT','ACTIVE',1,'Set a Ravager Burrow token Wholly Within 12" of any model in this Unit. At the End of the Round, the controlling player may set all models of this Unit in Coherency, treating the Ravager Burrow token as the Leading Model. The Ravager Burrow token has DISPLACEMENT.','Coloca una ficha de Ravager Burrow completamente a menos de 12" de cualquier miniatura de esta unidad. Al final de la ronda, el jugador que la controla puede colocar todas sus miniaturas en Coherencia, tratando la ficha como la Miniatura Líder. La ficha tiene DISPLACEMENT.','BM'), charge(2,4)
], [
  upgrade('bloated_bile_ducts',5181,'Bloated Bile Ducts',{'1':20,'2':40},ability('Bloated Bile Ducts','ANY','PASSIVE',null,'Increase the area of effect of this Unit’s Corrosive Bile ability to 2".','Aumenta a 2" el área de efecto de Corrosive Bile de esta unidad.')),
  upgrade('burrow_ambush',5182,'Burrow Ambush',{'1':20,'2':40},data.zerg.unitEntries.find(e=>e.name==='Hydralisk').upgrades.find(u=>u.id==='burrow_ambush').grantsAbilities[0]),
  upgrade('potent_bile',5183,'Potent Bile',{'1':20,'2':40},ability('Potent Bile','ASSAULT','PASSIVE',null,'Before an Enemy Unit resolves an Armour Roll against the HITS effect generated by this Unit’s Corrosive Bile ability, that Unit suffers DEBUFF Armour (1).','Antes de que una unidad enemiga resuelva una Tirada de Armadura contra el efecto HITS de Corrosive Bile de esta unidad, sufre DEBUFF Armadura (1).'))
]);
unit('terran','siege_tank','Siege Tank',4208,'150mm',{size:'2',hitPoints:'14',evade:'-',armour:'5+',speed:'7',shield:null},['ARMOURED','MECHANICAL','GROUND'],'ELITE',text('Damage Dealer','Especialista en daño'),[[1,220,2]],[{minModels:1,maxModels:1,supply:2}],[weapon('Twin Cannon','ASSAULT','12','Ground','8','3+','Armoured','D6','1',['PIERCE Armoured (2)']),weapon('Shock Cannon','ASSAULT','18','Ground','BT+4','4+','Light, Armoured','BT','1',['SIEGE MODE Status']),weapon('Rolling Over','COMBAT','E','Ground','2','2+',null,null,'1')],[
  ability('Large','ANY','PASSIVE',null,'When this Unit’s Leading Model moves, it cannot pass through physical gaps smaller than 3" wide, regardless of its size. If the Leading Model’s path of travel passes through, or any model in this Unit ends its movement on a Size 0 or Size 1 Impassable Terrain piece during any movement action, that terrain piece is immediately removed from the game.','Cuando la Miniatura Líder de esta unidad se mueve, no puede atravesar huecos físicos de menos de 3" de ancho, independientemente de su tamaño. Si su recorrido atraviesa un Terreno Infranqueable de Tamaño 0 o 1, o cualquier miniatura de esta unidad termina su movimiento sobre él durante cualquier acción de movimiento, retira inmediatamente ese terreno de la partida.'),
  ability('Heavy Plating','ANY','PASSIVE',null,'Whenever this Unit resolves an Armour Roll, it gains TOUGH (1), provided it does not currently have the SIEGE MODE Status.','Cada vez que esta unidad resuelve una Tirada de Armadura, gana TOUGH (1) si no tiene el estado SIEGE MODE.'), indomitable,
  ability('Point Blank','ASSAULT','PASSIVE',null,'While this Unit has the SIEGE MODE Status, it cannot target Enemy Units it is Engaged with.','Mientras tiene el estado SIEGE MODE, esta unidad no puede atacar a unidades enemigas con las que esté trabada.'),
  ability('Aftershock Rounds','ASSAULT','PASSIVE',null,'When this Unit has the SIEGE MODE Status, its Damage characteristic is treated as equal to the Size characteristic of the current target Unit (to a minimum of 1).','Cuando esta unidad tiene el estado SIEGE MODE, su Daño se considera igual al Tamaño de la unidad objetivo actual (mínimo 1).'),charge(4,3)
],[
  upgrade('mode_transformation',5251,'Mode Transformation',{'1':20},ability('Mode Transformation','MOVEMENT','ACTIVE',1,'The active Unit gains or loses the SIEGE MODE Status. While this Unit has the SIEGE MODE Status, its Size characteristic is treated as if it was 3.','La unidad activa gana o pierde el estado SIEGE MODE. Mientras lo tenga, su Tamaño se considera 3.','CP')),
  upgrade('coordinated_strike',5252,'Coordinated Strike',{'1':20},ability('Coordinated Strike','MOVEMENT','ACTIVE',0,'Target a Friendly Non-Engaged Unit on the battlefield (Line of Sight is not required). When this Unit resolves a Ranged Attack using the Shock Cannon weapon profile this Round, it may choose to ignore the weapon’s standard Range characteristic. If it does, it may target an Enemy Unit that is Within 8" of, and Visible to, a model of the selected Friendly Unit, treating that model as the acting model.','Selecciona una unidad amiga no trabada en el campo de batalla (no requiere Línea de Visión). Cuando esta unidad resuelva un Ataque a Distancia con Shock Cannon esta ronda, puede ignorar el Alcance habitual del arma. Si lo hace, puede atacar a una unidad enemiga a menos de 8" y visible para una miniatura de la unidad amiga seleccionada, tratando esa miniatura como la miniatura actuante.','CP')),
  upgrade('shaped_blast',5253,'Shaped Blast',{'1':10},ability('Shaped Blast','ASSAULT','REACTION',0,'Once per Game. When this Unit has SIEGE MODE Status, its weapon gains PINPOINT and LOCKED IN (4).','Una vez por partida. Cuando esta unidad tiene el estado SIEGE MODE, su arma gana PINPOINT y LOCKED IN (4).','CP')),
  upgrade('smart_shells',5254,'Smart Shells',{'1':10},ability('Smart Shells','ASSAULT','REACTION',0,'Once per Game. When this Unit has SIEGE MODE Status, its weapon gains INDIRECT FIRE and LONG RANGE (24).','Una vez por partida. Cuando esta unidad tiene el estado SIEGE MODE, su arma gana INDIRECT FIRE y LONG RANGE (24).','CP'))
]);
const disruptor = (side, phase) => weapon(`${side} ${phase ? 'Phase' : 'Photon'} Disruptor`,'ASSAULT','12','Ground','4','3+','Armoured','D3',phase?'1':'2',[...(phase?['PIERCE Armoured (3)']:['CONCENTRATED FIRE (1)','LONG RANGE (16)']),...(side==='Right'?['SIDEARM']:[])]);
unit('protoss','immortal','Immortal',4308,'100mm',{size:'3',hitPoints:'8',evade:'-',armour:'4+',speed:'7',shield:'6'},['ARMOURED','MECHANICAL','GROUND'],'ELITE',text('Tank','Tanque'),[[1,280,2]],[{minModels:1,maxModels:1,supply:2}],[disruptor('Left',false),disruptor('Right',false),weapon('Stomp','COMBAT','E','Ground','3','3+',null,null,'1')],[
  ability('Improved Barrier','ANY','REACTION',0,'Use when this Unit is selected as the target of an attack. If this Unit has the Shielded Status, the Damage characteristic of the attacking weapon is treated as a maximum of 1 for this attack.','Úsala cuando esta unidad sea seleccionada como objetivo de un ataque. Si tiene el estado Shielded, el Daño del arma atacante se considera como máximo 1 para este ataque.','PE'),indomitable,charge(4,3)
],[
  upgrade('shield_overcharge',5341,'Shield Overcharge',{'1':20},ability('Shield Overcharge','ANY','REACTION',1,'Use before this Unit makes an Armour Roll. If this Unit has the Shielded Status, it gains TOUGH (2) for this roll.','Úsala antes de que esta unidad haga una Tirada de Armadura. Si tiene el estado Shielded, gana TOUGH (2) para esta tirada.','PE')),
  ...['Left','Right'].map((side,i)=>upgrade(`${side.toLowerCase()}_phase_disruptor`,5342+i,`${side} Phase Disruptor`,{'1':20},null,`${side} Photon Disruptor`,[disruptor(side,true)])),
  upgrade('fury_unyielding',5344,'Fury Unyielding',{'1':20},ability('Fury Unyielding','ASSAULT','PASSIVE',null,'While this Unit is Within 3" of a Mission Marker, its Ranged Weapons gain CRITICAL HIT (1) when targeting an Enemy Unit that is also Within 3" of that same Mission Marker.','Mientras esta unidad esté a menos de 3" de un Marcador de Misión, sus armas a distancia ganan CRITICAL HIT (1) al atacar a una unidad enemiga que también esté a menos de 3" de ese mismo marcador.')),
  upgrade('for_the_ancients',5345,'For the Ancients',{'1':20},ability('For the Ancients','ASSAULT','PASSIVE',null,'When this Unit makes a Ranged Attack, if the target Unit is more than 8" away, the attacking weapons gain PRECISION (1).','Cuando esta unidad realiza un Ataque a Distancia, si el objetivo está a más de 8", las armas atacantes ganan PRECISION (1).'))
]);
data.protoss.factionCards.push({id:'protoss.faction.nerazim',seedId:1303,race:'PROTOSS',name:'Nerazim',tags:['PROTOSS','NERAZIM'],startingSlots:{CORE:2,ELITE:3,HERO:1},resource:'PE',resourcePerRound:1,imageRef:'cards/protoss/faction-nerazim.webp',abilities:[
  ability('Might of the Nerazim','ANY','REACTION',null,'If a Friendly Unit loses the HIDDEN Status it gains Buff Speed (2) and its first Weapon used CRITICAL HIT (2).','Si una unidad amiga pierde el estado HIDDEN, gana BUFF Velocidad (2) y su primera arma utilizada gana CRITICAL HIT (2).'),
  ability('Darkness Descends','MOVEMENT','ACTIVE',null,'The active Biological Unit gains the HIDDEN Status until the End of the Round.','La unidad Biológica activa gana el estado HIDDEN hasta el final de la ronda.')
]});
data.zerg.tacticalCards.push({id:'zerg.tactical.cocoon',seedId:2110,race:'ZERG',name:'Cocoon',tags:['ZERG'],vespeneCost:30,slotsGranted:{ELITE:1},unique:true,resource:null,resourcePerRound:0,imageRef:'cards/zerg/tactical-cocoon.webp',abilities:[
  ability('Spawn Larva','MOVEMENT','ACTIVE',null,'The active Friendly non-Unique Biological Unit with a Size Characteristic of 1 resolve the RESPAWN (2) effect.','La unidad amiga Biológica activa, no Única y con Tamaño 1 resuelve el efecto RESPAWN (2).'),
  ability('Ravager Morph','MOVEMENT','ACTIVE',null,'Once per Game. The active Friendly Roach Unit performs MORPH (Ravager) 1.','Una vez por partida. La unidad Roach amiga activa realiza MORPH (Ravager) 1.')
]});
for(const r of ['core','scenarios','protoss','terran','zerg']) {
  const d = data[r] ?? read(r); d.contentVersion='2026.09.21.1';
  if(data[r]) d.sourceRef += ' + cartas v1.06.26 y capturas de costes aportadas el 2026-09-21 (docs/catalog-import-2026-09-21.md)';
  fs.writeFileSync(`src/catalog/data/${r}.json`,JSON.stringify(d,null,2)+'\n');
}

// Keep immutable attachments in the repository so asset generation is reproducible.
const sources = [
 ['protoss','unit-immortal-front','20 (3)'],['protoss','unit-immortal-back','22 (1)'],
 ['terran','unit-siege-tank-front','19 (1)'],['terran','unit-siege-tank-back','18'],
 ['zerg','unit-ravager-front','19'],['zerg','unit-ravager-back','18 (1)'],
 ['protoss','faction-nerazim','20 (1)'],['zerg','tactical-cocoon','21'],
];
const manifest=JSON.parse(fs.readFileSync('tools/extract/card-assets.manifest.json','utf8'));
fs.mkdirSync('docs/sources/2026-09-21',{recursive:true});
for(const [race,slug,suffix] of sources){
  const filename=`WhatsApp Image 2026-09-21 at 16.11.${suffix}.jpeg`;
  const sourcePath=`docs/sources/2026-09-21/${slug}.jpeg`;
  fs.copyFileSync(`C:/Users/FEde/Desktop/${filename}`,sourcePath);
  const source=`attachment-${slug}`;
  manifest.sources[source]={path:sourcePath,sha256:createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex'),format:'image'};
  const output=`cards/${race}/${slug}.webp`;
  manifest.assets.push({id:`${race}.${slug}`,source,layout:'attachment',output});
  await sharp(sourcePath).webp({quality:96,effort:6}).toFile(`public/${output}`);
}
for(const [race,slug,suffix] of sources.filter(x=>x[1].endsWith('-front'))){
  await sharp(`docs/sources/2026-09-21/${slug}.jpeg`).extract({left:143,top:160,width:420,height:750}).resize({width:280}).jpeg({quality:90}).toFile(`public/cards/${race}/mini-${slug.slice(5,-6).replaceAll('-','_')}.jpg`);
}
fs.writeFileSync('tools/extract/card-assets.manifest.json',JSON.stringify(manifest,null,2)+'\n');
