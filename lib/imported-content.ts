import { processes } from './processes';

export function importedProcess(slug: string) {
  return processes.find(p => p.slug === slug && p.sourceKey);
}

export function normalizeMarkdown(raw: string): string {
  const text = raw.trim().replace(/^```(?:markdown|md)\s*\n([\s\S]*?)\n```\s*$/i, '$1');
  // Source tables contain HTML line breaks. Use safe text separators; raw HTML is never enabled.
  return text.replace(/<br\s*\/?\s*>/gi, ' · ');
}
