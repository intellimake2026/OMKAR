import { authClient, sameOrigin } from '@/lib/supabase/server';
export async function POST(request:Request){if(!sameOrigin(request))return new Response('Forbidden',{status:403});await (await authClient()).auth.signOut();return Response.json({ok:true});}
