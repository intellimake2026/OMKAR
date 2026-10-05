import { identity } from '@/lib/supabase/server';
export async function GET(){const user=await identity();return Response.json(user??{error:'Sign in required'},{status:user?200:401,headers:{'Cache-Control':'private, no-store'}});}
