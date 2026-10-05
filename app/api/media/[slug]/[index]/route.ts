import { identity } from '@/lib/supabase/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { createR2Client } from '@/lib/r2';
import { importedProcess } from '@/lib/imported-content';
export const runtime = 'nodejs';
export async function GET(_request:Request, {params}:{params:Promise<{slug:string;index:string}>}) {
 if(!await identity())return new Response('Unauthorized',{status:401});
 const {slug,index}=await params;
 if (!/^\d+$/.test(index)) return new Response('Not found',{status:404});
 const entry=importedProcess(slug)?.images?.[Number(index)];
 if (!entry) return new Response('Not found',{status:404});
 const client=createR2Client();
 if (!client || !process.env.R2_BUCKET_NAME) return new Response('Media unavailable',{status:503});
 try {
  const object=await client.send(new GetObjectCommand({Bucket:process.env.R2_BUCKET_NAME,Key:entry.key}));
  if (!object.Body) return new Response('Not found',{status:404});
  return new Response(object.Body.transformToWebStream(),{headers:{'Content-Type':entry.key.endsWith('.png')?'image/png':'image/jpeg','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 } catch {
  console.error('R2 image read failed',{slug,index});
  return new Response('Media temporarily unavailable',{status:503});
 }
}
