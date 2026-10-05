"use client";
import { useCatalog } from "./catalog-provider";
import { useState } from 'react';
import Link from 'next/link';

import { processCapabilityRequirements, machineCapabilityProvisions } from '@/lib/capabilities';


export function LibraryGraph() {
 const {processes,capabilities,machineModels}=useCatalog();
 const [slug,setSlug]=useState('drilling');
 const selected=processes.find(p=>p.slug===slug)!;
 const required=processCapabilityRequirements.filter(r=>r.processSlug===slug);
 return <section className="process-detail-section"><h2>Three connected libraries</h2><p>Process Library → requires → Capability Library → offered by → Machine Library</p><label>Explore a process <select value={slug} onChange={e=>setSlug(e.target.value)}>{processes.map(p=><option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label><div className="library-graph"><article><small>PROCESS LIBRARY</small><h3><Link href={`/processes/${slug}`}>{selected.name}</Link></h3><p>Inputs · Outputs · Parameters · Steps · Required capabilities</p></article><div aria-hidden="true">requires →</div><article><small>CAPABILITY LIBRARY</small><h3>Required functions</h3>{required.length?<ul>{required.map(r=><li key={r.capabilityId}><Link href={`/capabilities?capability=${r.capabilityId}`}>{capabilities.find(c=>c.id===r.capabilityId)?.name}</Link><details><summary>Evidence</summary><p>{r.evidence}</p><Link href={`/processes/${slug}#required-capabilities`}>View source requirements</Link></details></li>)}</ul>:<p>No normalized relationships documented yet. This does not mean no capabilities are required.</p>}</article><div aria-hidden="true">offered by →</div><article><small>MACHINE LIBRARY</small><h3>Machine models</h3>{machineCapabilityProvisions.filter(m=>required.some(r=>r.capabilityId===m.capabilityId)).map(m=><p key={`${m.machineModelId}-${m.capabilityId}`}>{machineModels.find(model=>model.id===m.machineModelId)?.name}</p>)}{!machineCapabilityProvisions.some(m=>required.some(r=>r.capabilityId===m.capabilityId))&&<p>No documented model-level offerings for these relationships yet.</p>}<Link href="/machines">Browse machine types</Link></article></div><p className="source-note">Relationships are partial and source-derived, not verified compatibility matches. Engineering values and diagram labels have not been independently verified.</p></section>;
}
