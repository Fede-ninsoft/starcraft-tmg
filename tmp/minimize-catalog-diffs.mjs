import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
for (const file of ['src/catalog/data/core.json','src/catalog/data/scenarios.json','src/catalog/data/protoss.json','src/catalog/data/terran.json','src/catalog/data/zerg.json','tools/extract/card-assets.manifest.json']) {
  let original=execFileSync('git',['show',`HEAD:${file}`],{encoding:'utf8'});
  const before=JSON.parse(original), after=JSON.parse(fs.readFileSync(file,'utf8'));
  for(const key of Object.keys(after)) {
    if(JSON.stringify(before[key])===JSON.stringify(after[key]))continue;
    const marker=new RegExp(`^  "${key}":\\s*`,'m').exec(original);
    const start=marker.index+marker[0].length;
    let end=start, depth=0, quoted=false, escaped=false;
    for(;end<original.length;end++){
      const c=original[end];
      if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;}
      else if(c==='"')quoted=true;
      else if(c==='['||c==='{')depth++;
      else if(c===']'||c==='}')depth--;
      if(!quoted && depth===0){end++;break;}
    }
    let replacement;
    if(Array.isArray(after[key])){
      const added=after[key].slice(before[key].length);
      replacement=original.slice(start,end-1).trimEnd()+',\n'+added.map(v=>JSON.stringify(v,null,2).split('\n').map(l=>'    '+l).join('\n')).join(',\n')+'\n  ]';
    } else if(key==='sources'){
      const added=Object.fromEntries(Object.entries(after[key]).filter(([k])=>!before[key][k]));
      const inner=JSON.stringify(added,null,2).slice(2,-2).split('\n').map(l=>'  '+l).join('\n');
      replacement=original.slice(start,end-1).trimEnd()+',\n'+inner+'\n  }';
    } else replacement=JSON.stringify(after[key]);
    original=original.slice(0,start)+replacement+original.slice(end);
  }
  if(JSON.stringify(JSON.parse(original))!==JSON.stringify(after))throw new Error(file);
  fs.writeFileSync(file,original);
}
