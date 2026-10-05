import { processes } from './processes';
import { capabilities } from './capabilities';
import { machineTypes } from './machines';
export function validateContent(key:string,value:unknown): value is Record<string,unknown>{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const data=value as Record<string,unknown>;
 const [type,id,...extra]=key.split(':');if(extra.length||!id)return false;
 const fields=type==='process'&&processes.some(p=>p.slug===id)?['name','summary','description','markdown','materials','features','applications']:type==='capability'&&capabilities.some(c=>c.id===id)?['name','description']:type==='machine-type'&&machineTypes.some(m=>m.id===id)?['name','text']:[];
 if(!fields.length||Object.keys(data).some(k=>!fields.includes(k)))return false;
 return Object.entries(data).every(([field,v])=>['materials','features','applications'].includes(field)?Array.isArray(v)&&v.length<=100&&v.every(x=>typeof x==='string'&&x.length<=300):typeof v==='string'&&v.trim().length>0&&v.length<=(field==='markdown'?200000:field==='name'?200:10000));
}
