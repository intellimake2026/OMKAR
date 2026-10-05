"use client";
import { useCatalog } from "./catalog-provider";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProcessKnowledge } from './process-knowledge';
import { BookOpen, Download, Image as ImageIcon } from 'lucide-react';
import { type Process } from '@/lib/processes';

export function ImportedProfile({process}:{process:Process}) {
 const {processes}=useCatalog();
 const [markdown,setMarkdown]=useState('');
 const [error,setError]=useState(false);
 const [attempt,setAttempt]=useState(0);
 const [view,setView]=useState<'text'|'images'>('text');
 useEffect(()=>{
  const controller=new AbortController();
  setError(false);setMarkdown('');
  fetch(`/api/content/${process.slug}`,{signal:controller.signal}).then(async response=>{
   if(!response.ok)throw new Error('Unavailable');
   const data=await response.json();setMarkdown(data.markdown);
  }).catch(e=>{if(e.name!=='AbortError')setError(true);});
  return ()=>controller.abort();
 },[process.slug,attempt]);
 return <section className="imported-profile"><aside className="imported-nav"><h2><BookOpen size={17}/> Process library</h2>{processes.filter(p=>p.sourceKey).map(p=><Link key={p.slug} href={`/processes/${p.slug}`} aria-current={p.slug===process.slug?'page':undefined}>{p.name}</Link>)}</aside><article className="imported-article"><div className="imported-heading"><div><span className="orange-label">{process.group}</span><h1>{process.name}</h1><p>{process.summary}</p></div><a href={`/api/content/${process.slug}?download=1`} className="orange-button"><Download size={15}/> Download Markdown</a></div><p className="source-note">Imported source profile · Engineering values and diagram labels have not been independently verified.</p><div className="imported-view"><button onClick={()=>setView('text')} aria-pressed={view==='text'}><BookOpen size={17}/> Text / Information</button><button onClick={()=>setView('images')} aria-pressed={view==='images'}><ImageIcon size={17}/> Images / Diagrams ({process.images?.length??0})</button></div>{view==='images'?<div className="imported-gallery">{process.images?.length?process.images.map((img,i)=><figure key={img.key}><a href={`/api/media/${process.slug}/${i}`} target="_blank" rel="noreferrer"><Image unoptimized src={`/api/media/${process.slug}/${i}`} alt={img.title} width={1408} height={768} sizes="(max-width:760px) 100vw, 75vw"/></a><figcaption>{img.title} · <a href={`/api/media/${process.slug}/${i}`} target="_blank" rel="noreferrer">Open full size</a></figcaption></figure>):<p className="source-note">No diagram was supplied for this process.</p>}</div>:<>{error?<div className="content-error" role="alert"><h2>Unable to load this document</h2><p>The source is temporarily unavailable. Please try again.</p><button className="orange-button" onClick={()=>setAttempt(v=>v+1)}>Retry</button></div>:!markdown?<p role="status">Loading process profile…</p>:<ProcessKnowledge process={process} markdown={markdown}/>}</>}<div className="imported-related" id="related-processes"><h2>Related processes</h2><div className="related-links">{process.related?.map(slug=><Link href={`/processes/${slug}`} key={slug}>{processes.find(p=>p.slug===slug)?.name}</Link>)}</div></div></article></section>;
}
