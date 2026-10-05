"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Boxes,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Download,
  FileText,
  GitBranch,
  Grid2X2,
  Home,
  Image as ImageIcon,
  Info,
  Menu,
  Microscope,
  Search,
  Share2,
  Sparkles,
  Star,
  LogIn,
  ShieldCheck,
  Plus,
  PencilLine,
  Maximize2,
  Network,
  Wrench,
  X,
} from "lucide-react";
import type { Process } from "@/lib/processes";
import { processGroups } from "@/lib/processes";

type Props = { initialProcesses: Process[]; initialSlug?: string; embedded?: boolean };
type Tab = "Overview" | "Process details" | "Materials" | "Equipment" | "Tooling" | "Parameters" | "Capabilities" | "Quality" | "Limitations" | "Applications" | "Evidence";

const tabs: Tab[] = ["Overview", "Process details", "Materials", "Equipment", "Tooling", "Parameters", "Capabilities", "Quality", "Limitations", "Applications", "Evidence"];

export function ManufacturingLibrary({ initialProcesses, initialSlug, embedded = false }: Props) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(initialSlug ?? initialProcesses[0].slug);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("Overview");
  const [mode, setMode] = useState<"text" | "visual">("text");
  const [favorite, setFavorite] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [relatedOpen, setRelatedOpen] = useState(false);
  const [dialog, setDialog] = useState<"signup" | "login" | "admin" | "contribute" | "suggest" | null>(null);

  const selected = initialProcesses.find((process) => process.slug === selectedSlug) ?? initialProcesses[0];
  const visibleProcesses = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return initialProcesses;
    return initialProcesses.filter((process) => [process.name, process.family, process.group, process.summary, ...process.features].join(" ").toLowerCase().includes(term));
  }, [initialProcesses, search]);

  function chooseProcess(slug: string) {
    if (embedded) { router.push(`/processes/${slug}`); return; }
    setSelectedSlug(slug);
    setTab("Overview");
    setSidebarOpen(false);
  }

  return (
    <main className="app-shell">
      {!embedded && <><header className="brand-header">
        <div className="brand-mark" aria-hidden="true"><Boxes size={28} /><span /></div>
        <div className="wordmark">OMKAR</div>
        <div className="brand-expansion" aria-label="Open Manufacturing Knowledge and Resources">
          <span><b>O</b><small>Open</small></span>
          <span><b>M</b><small>Manufacturing</small></span>
          <span><b>K</b><small>Knowledge</small></span>
          <span><b>A</b><small>and</small></span>
          <span><b>R</b><small>Resources</small></span>
        </div>
        <p>Connecting manufacturing knowledge. Powering smarter engineering.</p>
        <div className="account-actions">
          <button onClick={() => setDialog("signup")}>Sign up</button>
          <button onClick={() => setDialog("login")}><LogIn size={14} />Log in</button>
          <button className="admin" onClick={() => setDialog("admin")}><ShieldCheck size={14} />Admin</button>
        </div>
      </header>

      <nav className="top-nav" aria-label="Primary navigation">
        <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open process library"><Menu size={19} /></button>
        <a className="active"><Home size={16} />Home</a>
        <a><Search size={16} />Explore</a>
        <a><BarChart3 size={16} />Compare</a>
        <a><GitBranch size={16} />Knowledge graph</a>
        <a><BookOpen size={16} />Resources</a>
        <label className="global-search">
          <Search size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search processes, materials, tools, features…" />
          <kbd>⌘ K</kbd>
        </label>
        <button className="ask-button"><Sparkles size={16} /><span>Ask OMKAR</span></button>
        <button className="related-toggle" onClick={() => setRelatedOpen(true)} aria-label="Open related knowledge"><Network size={17} /></button>
      </nav></>}

      <div className="workspace">
        {sidebarOpen && <button className="sidebar-scrim" aria-label="Close process library" onClick={() => setSidebarOpen(false)} />}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-heading"><span><BookOpen size={18} />Process library</span><button onClick={() => setSidebarOpen(false)}><X size={18} /></button></div>
          <label className="side-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a process" /></label>
          <div className="library-label">Manufacturing families <span>{processGroups.length}</span></div>
          <div className="tree">
            {processGroups.map((group) => (
              <div key={group.name}>
                <button className={`group-row ${group.active ? "expanded" : ""}`} onClick={() => { if (embedded) router.push(`/processes?family=${encodeURIComponent(group.name)}`); }}>
                  {group.active ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  <span>{group.name}</span><small>{initialProcesses.filter(p => p.family === group.name || p.group === group.name).length}</small>
                </button>
                {group.active && (
                  <div className="process-list">
                    <div className="subgroup"><Wrench size={14} />Machining</div>
                    {visibleProcesses.filter((process) => process.family === "Subtractive Manufacturing").map((process) => (
                      <button key={process.slug} className={process.slug === selected.slug ? "selected" : ""} onClick={() => chooseProcess(process.slug)}>
                        <CircleDot size={12} />{process.name}
                      </button>
                    ))}
                    {visibleProcesses.length === 0 && <p className="no-results">No matching processes</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="browse-all" onClick={() => router.push("/processes")}><Grid2X2 size={15} />Browse all processes</button>
          <button className="add-process" onClick={() => setDialog("contribute")}><Plus size={15} />Add new process</button>
          <div className="library-stat"><strong>{initialProcesses.length}</strong><span>documented processes</span></div>
        </aside>

        <section className="content">
          <div className="breadcrumbs"><Home size={14} /><ChevronRight size={13} /><span>{selected.family}</span><ChevronRight size={13} /><span>{selected.group}</span><ChevronRight size={13} /><strong>{selected.name}</strong></div>

          <section className="process-hero">
            <div className="process-icon" style={{ "--accent": selected.accent } as React.CSSProperties}><span>{selected.icon}</span><i /></div>
            <div className="process-title"><div className="eyebrow">PROCESS / {selected.group.toUpperCase()}</div><h1>{selected.name}</h1><p>{selected.summary}</p></div>
            <div className={`status status-${(selected.status ?? "Reviewed").toLowerCase()}`}><Check size={13} />{selected.status ?? "Reviewed"}</div>
            <div className="hero-actions">
              <button onClick={() => setDialog("suggest")}><PencilLine size={16} /><span>Suggest change</span></button>
              <button className={favorite ? "is-favorite" : ""} onClick={() => setFavorite((value) => !value)}><Star size={16} fill={favorite ? "currentColor" : "none"} />{favorite ? "Saved" : "Save"}</button>
              <button onClick={() => { void navigator.clipboard?.writeText(window.location.href); }}><Share2 size={16} /><span>Copy link</span></button>
              <button className="primary" onClick={() => { const blob = new Blob([`${selected.name}\n\n${selected.description}\n\nFeatures: ${selected.features.join(", ")}`], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${selected.slug}.txt`; a.click(); URL.revokeObjectURL(url); }}><Download size={16} /><span>Download</span></button>
            </div>
          </section>

          <div className="view-switcher">
            <button className={mode === "text" ? "active" : ""} onClick={() => setMode("text")}><FileText size={18} />Text / Information</button>
            <button className={mode === "visual" ? "active" : ""} onClick={() => setMode("visual")}><ImageIcon size={18} />Image / Diagram</button>
          </div>

          <div className="tab-strip" role="tablist">
            {tabs.map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}
          </div>

          <div className="detail-body">
            {tab === "Overview" ? <Overview process={selected} mode={mode} /> : <TabContent process={selected} tab={tab} />}
          </div>
        </section>
        {relatedOpen && <button className="related-scrim" aria-label="Close related knowledge" onClick={() => setRelatedOpen(false)} />}
        <RelatedKnowledge process={selected} processes={initialProcesses} onSelect={chooseProcess} open={relatedOpen} onClose={() => setRelatedOpen(false)} onEvidence={() => setTab("Evidence")} />
      </div>
      {dialog && <Dialog type={dialog} onClose={() => setDialog(null)} />}
    </main>
  );
}

function Overview({ process, mode }: { process: Process; mode: "text" | "visual" }) {
  if (mode === "visual") {
    return <VisualGallery key={process.slug} process={process} />;
  }

  return (
    <>
      <section className="overview-card"><div className="card-heading"><Info size={17} />Overview</div><p>{process.description}</p></section>
      <div className="detail-grid">
        <section className="info-card characteristics"><div className="card-heading"><Sparkles size={17} />Key characteristics</div><ul>{process.characteristics.map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul></section>
        <section className="info-card transformation"><div className="card-heading"><ArrowRight size={17} />Input → transformation → output</div><div className="mini-flow"><div className="cube"><span /></div><ArrowRight /><div className="broach"><i /><i /><i /><i /><i /></div><ArrowRight /><div className="ring"><span /></div></div><div className="flow-labels"><span><b>Workpiece</b>Starting geometry</span><span><b>{process.name}</b>Material transformation</span><span><b>Finished part</b>Defined geometry</span></div></section>
        <section className="info-card family-card"><div className="card-heading"><GitBranch size={17} />Process family</div><div className="family-path"><span>{process.family}</span><ChevronRight size={14} /><span>{process.group}</span><ChevronRight size={14} /><strong>{process.name}</strong></div></section>
        <section className="info-card feature-card"><div className="card-heading"><Microscope size={17} />Common features</div><div className="chips">{process.features.map((feature) => <span key={feature}>{feature}</span>)}</div></section>
      </div>
    </>
  );
}

function TabContent({ process, tab }: { process: Process; tab: Tab }) {
  if (tab === "Parameters") {
    const parameters = process.parameters ?? [];
    return <section className="tab-content"><div className="tab-intro"><span>Structured data</span><h2>{process.name}: parameters</h2><p>Ranges are contextual engineering guidance, not universal limits. Confirm against the cited source and your application conditions.</p></div>{parameters.length ? <div className="parameter-table"><div className="parameter-row header"><b>Parameter</b><b>Value / range</b><b>Unit</b><b>Context / conditions</b><b>Source</b></div>{parameters.map((parameter) => <div className="parameter-row" key={parameter.name}><strong>{parameter.name}</strong><span>{parameter.value}</span><span>{parameter.unit}</span><span>{parameter.context}</span><span className="source-pill">{parameter.source}</span></div>)}</div> : <Unavailable label="No verified parameter data is available for this process yet." />}</section>;
  }
  if (tab === "Evidence") {
    const evidence = process.evidence ?? [];
    return <section className="tab-content"><div className="tab-intro"><span>Traceability</span><h2>Evidence supporting {process.name}</h2><p>Sources attached to the currently approved version of this process page.</p></div>{evidence.length ? <div className="evidence-list">{evidence.map((source, index) => <article key={source.title}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{source.title}</b><p>{source.detail}</p></div><BookOpen size={18} /></article>)}</div> : <Unavailable label="No approved evidence has been attached yet." />}</section>;
  }
  const data: Partial<Record<Tab, string[]>> = {
    Materials: process.materials,
    Applications: process.applications,
    Equipment: ["Production machine", "Workholding system", "Coolant and filtration", "Inspection equipment"],
    Tooling: ["Primary cutting tool", "Tool holder", "Setup gauges", "Tool maintenance equipment"],
    Capabilities: ["Repeatable production", "Complex feature creation", "Controlled surface finish", "Dimensional accuracy"],
    Quality: ["Dimensional inspection", "Surface finish verification", "Tool wear monitoring", "Process capability tracking"],
    Limitations: ["Dedicated tooling may be required", "Setup depends on part geometry", "Material machinability affects performance", "Economics vary by production volume"],
    Parameters: ["Cutting speed", "Feed or stroke rate", "Depth of cut", "Tool geometry"],
    Evidence: ["Process planning references", "Material compatibility data", "Quality inspection records", "Supplier capability documentation"],
    "Process details": process.characteristics,
  };
  return <section className="tab-content"><div className="tab-intro"><span>{tab}</span><h2>{process.name}: {tab.toLowerCase()}</h2><p>A practical starting point for evaluating this process. Detailed Markdown content from R2 will populate this section when connected.</p></div><div className="tab-cards">{(data[tab] ?? []).map((item, index) => <article key={item}><small>0{index + 1}</small><b>{item}</b><ArrowRight size={16} /></article>)}</div></section>;
}

function VisualGallery({ process }: { process: Process }) {
  const visuals = process.visuals ?? [{ title: `${process.name} visual`, caption: "A verified process diagram has not been uploaded yet." }];
  const [visualIndex, setVisualIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const visual = visuals[visualIndex];
  return <section className={`visual-panel ${expanded ? "expanded" : ""}`}>
    <div className="visual-toolbar"><div><span>Diagram {visualIndex + 1} of {visuals.length}</span><b>{visual.title}</b></div><button onClick={() => setExpanded((value) => !value)}><Maximize2 size={16} />{expanded ? "Close" : "Enlarge"}</button></div>
    <div className="visual-stage"><div className="stage-object raw"><span /></div><ArrowRight /><div className="stage-object tool"><i /><i /><i /><i /><i /><i /></div><ArrowRight /><div className="stage-object finished"><span /></div></div>
    <div className="stage-labels"><span><b>Workpiece</b>Stock material</span><span><b>{process.name} tool</b>Controlled transformation</span><span><b>Finished profile</b>Specified geometry</span></div>
    <p className="visual-caption">{visual.caption}</p>
    {visuals.length > 1 && <div className="visual-thumbnails">{visuals.map((item, index) => <button key={item.title} className={index === visualIndex ? "active" : ""} onClick={() => setVisualIndex(index)}><span>0{index + 1}</span><b>{item.title}</b></button>)}</div>}
  </section>;
}

function RelatedKnowledge({ process, processes, onSelect, open, onClose, onEvidence }: { process: Process; processes: Process[]; onSelect: (slug: string) => void; open: boolean; onClose: () => void; onEvidence: () => void }) {
  const related = (process.related ?? []).map((slug) => processes.find((item) => item.slug === slug)).filter(Boolean) as Process[];
  return <aside className={`related-panel ${open ? "open" : ""}`}>
    <div className="related-heading"><span><Network size={17} />Related knowledge</span><button onClick={onClose}><X size={17} /></button></div>
    <div className="graph-card"><div className="graph-label">Knowledge graph</div><div className="knowledge-graph"><span className="node center">{process.name}</span>{related.slice(0, 4).map((item, index) => <button key={item.slug} className={`node node-${index + 1}`} onClick={() => onSelect(item.slug)}>{item.name}</button>)}<i className="edge edge-1" /><i className="edge edge-2" /><i className="edge edge-3" /></div></div>
    <section className="related-list"><h3>Related processes</h3>{related.length ? related.map((item) => <button key={item.slug} onClick={() => onSelect(item.slug)}><span style={{ background: item.accent }}>{item.icon}</span><div><b>{item.name}</b><small>{item.group}</small></div><ChevronRight size={15} /></button>) : <Unavailable label="No related processes have been mapped." />}</section>
    <section className="quick-actions"><h3>Quick actions</h3><button><BarChart3 size={15} />Compare processes</button><button onClick={onEvidence}><BookOpen size={15} />View evidence</button></section>
    <div className="review-note"><ShieldCheck size={16} /><span><b>{process.status ?? "Reviewed"} knowledge</b>Contributions publish only after admin approval.</span></div>
  </aside>;
}

function Unavailable({ label }: { label: string }) {
  return <div className="unavailable"><Info size={18} /><span><b>Information unavailable</b>{label}</span></div>;
}

function Dialog({ type, onClose }: { type: "signup" | "login" | "admin" | "contribute" | "suggest"; onClose: () => void }) {
  const contribution = type === "contribute" || type === "suggest";
  const title = type === "signup" ? "Create your OMKAR account" : type === "login" ? "Log in to OMKAR" : type === "admin" ? "Administrator login" : type === "contribute" ? "Add a new process" : "Suggest a change";
  return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}><section className="dialog" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><div className="dialog-head"><div><span>{contribution ? "CONTRIBUTION" : "ACCOUNT"}</span><h2>{title}</h2></div><button onClick={onClose}><X size={18} /></button></div>{contribution ? <><div className="auth-gate"><ShieldCheck size={20} /><div><b>Sign in required</b><p>Contributors must have an account so authorship and review history remain traceable.</p></div></div><div className="workflow"><span className="active">Proposed</span><ArrowRight size={14} /><span>Under review</span><ArrowRight size={14} /><span>Approved / rejected</span></div><button className="dialog-primary">Continue to log in</button><button className="dialog-secondary">Create an account</button></> : <><label>Email address<input type="email" placeholder="you@example.com" /></label><label>Password<input type="password" placeholder="Enter your password" /></label><button className="dialog-primary">{type === "signup" ? "Create account" : "Continue securely"}</button>{type !== "admin" && <p className="dialog-note">Contributors can propose processes and changes. Only administrators can publish knowledge.</p>}</>}</section></div>;
}
