import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
export async function authClient() {
 const jar=await cookies();
 return createServerClient(process.env.NEXT_PUBLIC_OMKAR_SUPABASE_URL!,process.env.NEXT_PUBLIC_OMKAR_SUPABASE_PUBLISHABLE_KEY!,{
  cookies:{getAll:()=>jar.getAll(),setAll:items=>{try{items.forEach(({name,value,options})=>jar.set(name,value,options));}catch{/* Middleware refreshes Server Component cookies. */}}}
 });
}
export function serviceClient(){return createClient(process.env.NEXT_PUBLIC_OMKAR_SUPABASE_URL!,process.env.OMKAR_SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});}
export async function identity(){
 const client=await authClient();const {data:{user},error}=await client.auth.getUser();
 if(error||!user||!user.email_confirmed_at)return null;
 const {data}=await client.from('omkar_admins').select('user_id').eq('user_id',user.id).maybeSingle();
 return {id:user.id,email:user.email,admin:!!data};
}
export function sameOrigin(request:Request){return request.headers.get('origin')===new URL(request.url).origin;}
