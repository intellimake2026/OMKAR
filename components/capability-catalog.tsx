"use client";
import { useCatalog } from "./catalog-provider";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Boxes, Cog, Search } from "lucide-react";
import { processCapabilityRequirements, machineCapabilityProvisions } from "@/lib/capabilities";
import { manufacturingRequirements } from "@/lib/manufacturing-requirements";


export function CapabilityCatalog({ domain }: { domain: "capabilities" | "requirements" }) {
 const {processes,capabilities}=useCatalog();
  const functional = domain === "capabilities";
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(()=>{const id=new URLSearchParams(window.location.search).get("capability"); if(id && capabilities.some(c=>c.id===id)) setSelected(id);},[capabilities]);
  const entries = functional
    ? capabilities.map(c => ({ id: c.id, name: c.name, text: c.description }))
    : manufacturingRequirements.map(r => ({ id: r.name, name: r.name, text: r.text }));
  const visible = entries.filter(c => `${c.name} ${c.text}`.toLowerCase().includes(query.trim().toLowerCase()));
  const current = visible.find(c => c.id === selected);
  const requirements = processCapabilityRequirements.filter(r => r.capabilityId === current?.id);
  const outcome = manufacturingRequirements.find(r => r.name === current?.id);
  const Icon = functional ? Cog : Boxes;
  return <>
    <section className="catalog-hero capabilities">
      <span className="orange-label">{functional ? "FUNCTIONS FOR PROCESS-TO-MACHINE MATCHING" : "DESIRED PART FEATURES"}</span>
      <h1>{functional ? "Capability Library" : "Manufacturing Requirements / Outcomes"}</h1>
      <p>{functional ? "A capability is a function a process requires and a machine or supporting system provides." : "Explore the geometry, features, and surface requirements your manufacturing process needs to achieve."}</p>
    </section>
    <section className="portal-section">
      <nav className="domain-navigation" aria-label="Manufacturing knowledge domains">
        <Link href="/capabilities" aria-current={functional ? "page" : undefined}>Functional Capabilities</Link>
        <Link href="/requirements" aria-current={!functional ? "page" : undefined}>Requirements / Outcomes</Link>
      </nav>
      <p className="domain-explanation">{functional ? "Processes require functions; equipment provides them. Matching also needs compatible operating ranges, tooling, and configuration. A shared capability alone does not establish machine suitability." : "These describe the result you want to manufacture. Use functional capabilities to assess the operations and equipment needed to produce it."}</p>
      <div className="catalog-tools"><label className="portal-search"><Search size={18}/><input aria-label={functional ? "Search functional capabilities" : "Search manufacturing requirements"} placeholder={functional ? "Search functions, e.g. XYZ Positioning…" : "Search geometry, features, or surfaces…"} value={query} onChange={e => setQuery(e.target.value)}/></label></div>
      <div className="results-label">{visible.length} {functional ? "functional capabilities" : "requirement / outcome groups"}</div>
      <div className="capability-grid">
        {visible.map(c => <button key={c.id} aria-pressed={selected === c.id} aria-controls="domain-details" className={selected === c.id ? "selected" : ""} onClick={() => setSelected(c.id)}><Icon size={36}/><h2>{c.name}</h2><p>{c.text}</p><span>{functional ? "View process requirements" : "Explore related processes"} <ArrowRight size={15}/></span></button>)}
      </div>
      {!visible.length && <p role="status">No entries match your search.</p>}
      <section id="domain-details" className="capability-results" aria-live="polite">
        {current && <><h2>{current.name}</h2>{functional ? <>
          <h3>Definition</h3><p>{current.text}</p><h3>Parameters</h3><p>Capability-level parameter definitions are not documented yet. Process operating values remain in their source profiles.</p><h3>Constraints</h3><p>Capability constraints are not documented yet. Machine-specific limits must be evidenced at model and configuration level.</p><h3>Evidence / required by processes</h3>
          <p>Initial mappings from supplied process profiles. Coverage is partial; an absent mapping does not mean a function is unnecessary.</p>
          {requirements.length ? <ul className="capability-evidence">{requirements.map(r => <li key={r.processSlug}><Link href={`/processes/${r.processSlug}`}>{processes.find(p => p.slug === r.processSlug)?.name}</Link><p>{r.evidence}</p></li>)}</ul> : <p>No process requirements have been mapped to this function yet.</p>}
          <h3>Machine models providing this function</h3>
          {machineCapabilityProvisions.filter(m => m.capabilityId === current.id).length === 0 && <p>Model-level capability provisions have not been documented yet. Generic machine types are not verified model matches.</p>}
        </> : <><p>Related processes to explore for this outcome. Suitability depends on the part and process conditions.</p><div className="related-links">{outcome?.slugs.map(slug => <Link href={`/processes/${slug}`} key={slug}>{processes.find(p => p.slug === slug)?.name}<ArrowRight size={16}/></Link>)}</div></>}</>}
      </section>
    </section>
  </>;
}
