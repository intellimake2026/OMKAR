"use client";
import { useCatalog } from "./catalog-provider";
import Link from 'next/link';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Process } from '@/lib/processes';
import { processCapabilityRequirements } from '@/lib/capabilities';
import { profileSections, overviewParts } from '@/lib/profile-sections';

function Document({text}:{text:string}) {
 return <div className="markdown-document"><Markdown remarkPlugins={[remarkGfm,remarkMath]} rehypePlugins={[[rehypeKatex,{strict:false,trust:false}]]} skipHtml components={{a:({href,children})=><a href={href} target="_blank" rel="noreferrer">{children}</a>,img:()=>null}}>{text}</Markdown></div>;
}
export function ProcessKnowledge({process,markdown}:{process:Process;markdown:string}) {
 const {capabilities}=useCatalog();
 const sections=profileSections(markdown);
 const find=(pattern:RegExp)=>sections.find(s=>pattern.test(s.title))?.body??'';
 const overview=overviewParts(find(/overview|definition/i));
 const parameters=find(/parameters/i);
 const steps=find(/process steps/i);
 const required=find(/required capabilities/i);
 const io=find(/inputs.*outputs/i);
 const mapped=processCapabilityRequirements.filter(r=>r.processSlug===process.slug);
 const parameterNames=Array.from(parameters.matchAll(/^\* \*\*(.+?)\*\*/gm)).slice(0,5).map(m=>m[1].replace(/\([^)]*\)/g,'').replace(/\$[^$]*\$/g,'').replace(/[():]/g,'').trim());
 const stepNames=Array.from(steps.matchAll(/^\d+\.\s+\*\*(.+?)\*\*/gm)).map(m=>m[1]);
 const drilling=process.slug==='drilling';
 const detailSections=[
  {id:'description',title:'Description / mechanism',body:overview.description||process.description},
  {id:'classification',title:'Classification',body:overview.classification||`${process.family} · ${process.group}`},
  {id:'materials',title:'Typical materials / applications',body:`**Materials indexed in this profile:** ${process.materials.join(', ')}.\n\n**Features / applications indexed in this profile:** ${process.features.join(', ')}.`},
  {id:'parameters',title:'Parameters',body:parameters},
  {id:'steps',title:'Process steps',body:steps},
  {id:'required-capabilities',title:'Required capabilities',body:required},
 ];
 const extra=sections.filter(s=>! /overview|definition|parameters|process steps|required capabilities|inputs.*outputs/i.test(s.title));
 return <>
  <section className="process-model" aria-label={`${process.name} process model`}>
   <a className="process-model-parameters" href="#parameters"><strong>PARAMETERS</strong><span>{parameterNames.join(' · ')||'View source parameters'}</span></a>
   <div className="process-model-flow">
    <a href="#inputs-outputs"><strong>INPUTS</strong><span>{drilling?'Workpiece · Drill tooling · Coolant / air · Energy · Fixturing · Control data':'Material · Tooling · Energy / media'}</span></a>
    <span className="flow-arrow" aria-hidden="true">→</span><div className="process-model-center">{process.name.toUpperCase()}</div><span className="flow-arrow" aria-hidden="true">→</span>
    <a href="#inputs-outputs"><strong>OUTPUTS</strong><span>{drilling?'Workpiece with holes · Chips / burrs · Heat / mist · Quality logs':'Processed workpiece · Byproducts / waste'}</span></a>
   </div>
   <a href="#steps"><strong>PROCESS STEPS</strong><span>{stepNames.length?stepNames.join(' → '):'View the source workflow'}</span></a>
   <a href="#required-capabilities"><strong>REQUIRED CAPABILITIES</strong><span>{mapped.length?mapped.map(r=>capabilities.find(c=>c.id===r.capabilityId)?.name).join(' · '):'View required functions and supporting subsystems'}</span></a>
   <p>Source-based overview. Functional capability mappings are partial; consult the detailed requirements below.</p>
  </section>
  <nav className="imported-sections" aria-label="Profile sections">{detailSections.map(s=><a key={s.id} href={`#${s.id}`}>{s.title}</a>)}<a href="#evidence">Evidence / references</a><a href="#related-processes">Related processes</a></nav>
  {detailSections.map(s=><section className="process-detail-section" id={s.id} key={s.id}><h2>{s.title}</h2>{s.id==='required-capabilities'&&mapped.length>0&&<><div className="portal-tags">{mapped.map(r=><Link href="/capabilities" key={r.capabilityId}>{capabilities.find(c=>c.id===r.capabilityId)?.name}</Link>)}</div><p>Functional mappings above are normalized from the source. The source table below also identifies implementation subsystems.</p></>}{s.body?<Document text={s.body}/>:<p>Not documented in the supplied profile.</p>}{s.id==='description'&&<details id="inputs-outputs"><summary>Inputs and outputs — source details</summary><Document text={io||'Not documented in the supplied profile.'}/></details>}</section>)}
  <section className="process-detail-section" id="evidence"><h2>Evidence / references</h2><p>Source: {process.sourceFile}. Imported engineering values have not been independently verified. The source document is available below; no independent reference validation has been completed.</p><a href={`/api/content/${process.slug}?download=1`}>Download original Markdown</a>{extra.map(s=><details key={s.title}><summary>{s.title}</summary><Document text={s.body}/></details>)}</section>
 </>;
}
