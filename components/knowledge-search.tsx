"use client";
import { useCatalog } from "./catalog-provider";
import { useEffect, useState } from 'react';
import Link from 'next/link';


import { LibraryGraph } from './library-graph';

export function KnowledgeSearch() {
 const {processes,capabilities,machineTypes,machineModels}=useCatalog();
 const [view,setView]=useState<'search'|'graph'>('search');
 const [query,setQuery]=useState('');
 useEffect(()=>setQuery(new URLSearchParams(window.location.search).get('q')??''),[]);
 const q=query.trim().toLowerCase();
 const materials=Array.from(new Set(processes.flatMap(p=>p.materials)));
 const groups=[
  {title:'Processes',entries:processes.map(p=>({name:p.name,text:`${p.summary} ${p.materials.join(' ')}`,href:`/processes/${p.slug}`}))},
  {title:'Capabilities',entries:capabilities.map(c=>({name:c.name,text:c.description,href:'/capabilities'}))},
  {title:'Machines',entries:[...machineTypes.map(m=>({name:m.name,text:`Machine Type · ${m.text}`,href:'/machines'})),...machineModels.map(m=>({name:`${m.manufacturer} ${m.name}`,text:`Machine Model · ${m.configuration}`,href:'/machines'}))]},
  {title:'Materials',entries:materials.map(m=>({name:m,text:'Processes indexed with this material',href:`/processes?q=${encodeURIComponent(m)}`}))},
 ].map(g=>({...g,entries:g.entries.filter(e=>`${e.name} ${e.text}`.toLowerCase().includes(q))}));
 return <section className="portal-section"><h1>Knowledge Explorer</h1><p>Processes • Capabilities • Machines • Materials</p><div className="imported-view"><button aria-pressed={view==='search'} onClick={()=>setView('search')}>Search libraries</button><button aria-pressed={view==='graph'} onClick={()=>setView('graph')}>Explore relationships</button></div>{view==='graph'?<LibraryGraph/>:<><label className="portal-search"><input aria-label="Search manufacturing knowledge" placeholder="Search OMKAR…" value={query} onChange={e=>setQuery(e.target.value)}/></label>{groups.map(g=><section className="process-detail-section" key={g.title}><h2>{g.title} ({g.entries.length})</h2>{g.entries.length?<div className="related-links">{g.entries.map(e=><Link key={e.name} href={e.href}>{e.name}<small>{g.title==='Machines'?e.text.split(' · ')[0]:''}</small></Link>)}</div>:<p>No matching entries.</p>}</section>)}</>}</section>;
}
