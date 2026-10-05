import { identity, serviceClient } from '@/lib/supabase/server';
export async function GET(){if(!await identity())return new Response('Unauthorized',{status:401});const {data,error}=await serviceClient().from('omkar_content').select('key,data,version');if(error)return new Response('Catalog unavailable',{status:503});return Response.json(data,{headers:{'Cache-Control':'private, no-store'}});}
