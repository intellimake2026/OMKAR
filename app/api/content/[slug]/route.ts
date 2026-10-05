import { identity } from '@/lib/supabase/server';
import { managedEntry } from '@/lib/managed-content';
import { processes } from '@/lib/processes';
import { getR2Text } from '@/lib/r2';
import { normalizeMarkdown } from '@/lib/imported-content';
export const runtime = 'nodejs';
export async function GET(request: Request, { params }: { params: Promise<{slug:string}> }) {
  if(!await identity())return new Response('Unauthorized',{status:401});
  const {slug} = await params;
  const process = processes.find(p=>p.slug===slug);
  if (!process) return new Response('Not found', { status:404 });
  try {
    const edited = await managedEntry(`process:${slug}`);
    const text = edited?.data.markdown ?? (process.sourceKey ? await getR2Text(process.sourceKey) : null);
    if (!text) return new Response('Content temporarily unavailable', { status:503 });
    if (new URL(request.url).searchParams.has('download')) return new Response(text, { headers: { 'Content-Type':'text/markdown; charset=utf-8', 'Content-Disposition':`attachment; filename="${slug}.md"`, 'X-Content-Type-Options':'nosniff' } });
    return Response.json({markdown:normalizeMarkdown(text)}, {headers:{'Cache-Control':'private, no-store'}});
  } catch {
    console.error('R2 document read failed', {slug});
    return new Response('Content temporarily unavailable', {status:503});
  }
}
