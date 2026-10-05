"use client";
import { createContext,useContext,useEffect,useState } from 'react';
import { processes as baseProcesses } from '@/lib/processes';
import { capabilities as baseCapabilities } from '@/lib/capabilities';
import { machineTypes as baseTypes,machineModels } from '@/lib/machines';
const defaults={processes:baseProcesses,capabilities:baseCapabilities.map(c=>({...c,name:String(c.name),description:String(c.description)})),machineTypes:baseTypes.map(m=>({...m,name:String(m.name),text:String(m.text)})),machineModels};
const Context=createContext(defaults);
export function CatalogProvider({children}:{children:React.ReactNode}){
 const [catalog,setCatalog]=useState(defaults);
 useEffect(()=>{const controller=new AbortController();fetch('/api/catalog',{signal:controller.signal}).then(r=>r.ok?r.json():[]).then((rows:{key:string;data:Record<string,unknown>}[])=>{const updates=new Map(rows.map(r=>[r.key,r.data]));setCatalog({...defaults,processes:baseProcesses.map(p=>({...p,...updates.get(`process:${p.slug}`),...(updates.get(`process:${p.slug}`)?.markdown?{sourceKey:p.sourceKey??'managed',sourceFile:p.sourceFile??'Administrator-authored profile'}:{})})),capabilities:defaults.capabilities.map(c=>({...c,...updates.get(`capability:${c.id}`)})),machineTypes:defaults.machineTypes.map(m=>({...m,...updates.get(`machine-type:${m.id}`)}))});}).catch(()=>{});return()=>controller.abort();},[]);
 return <Context.Provider value={catalog}>{children}</Context.Provider>;
}
export function useCatalog(){return useContext(Context);}
