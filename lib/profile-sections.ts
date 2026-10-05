export function profileSections(markdown: string) {
  return Array.from(markdown.matchAll(/^###\s+(.+)\r?\n([\s\S]*?)(?=^###\s|$(?![\s\S]))/gm)).map(m => ({
    title: m[1].replace(/^\d+\.\s*/, ''),
    body: m[2].replace(/\n---\s*$/, '').trim(),
  }));
}
export function overviewParts(body: string) {
  const at = body.search(/^\*\s+\*\*Process Classification:/m);
  return at < 0 ? { description: body, classification: '' } : {
    description: body.slice(0, at).trim(), classification: body.slice(at).trim(),
  };
}
