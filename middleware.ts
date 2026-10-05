import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
export async function middleware(request:NextRequest){
 const path=request.nextUrl.pathname;
 const publicRoute=['/login','/signup','/admin/login','/auth/confirm','/api/auth/logout'].includes(path);
 let response=NextResponse.next({request});
 const client=createServerClient(process.env.NEXT_PUBLIC_OMKAR_SUPABASE_URL!,process.env.NEXT_PUBLIC_OMKAR_SUPABASE_PUBLISHABLE_KEY!,{cookies:{getAll:()=>request.cookies.getAll(),setAll:items=>{items.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});items.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
 const {data:{user}}=await client.auth.getUser();
 const finish=(result:NextResponse)=>{response.cookies.getAll().forEach(c=>result.cookies.set(c));result.headers.set('Cache-Control','private, no-store');return result;};
 if(!publicRoute&&(!user||!user.email_confirmed_at)){
  if(path.startsWith('/api/'))return finish(NextResponse.json({error:'Sign in required'},{status:401}));
  const url=new URL(path.startsWith('/admin')?'/admin/login':'/login',request.url);url.searchParams.set('next',path+request.nextUrl.search);return finish(NextResponse.redirect(url));
 }
 if(!publicRoute&&(path.startsWith('/admin')||path.startsWith('/api/admin/'))){
  const {data}=await client.from('omkar_admins').select('user_id').eq('user_id',user!.id).maybeSingle();
  if(!data)return finish(path.startsWith('/api/')?NextResponse.json({error:'Administrator access required'},{status:403}):new NextResponse('Administrator access required. Your account does not have this role.',{status:403}));
 }
 return finish(response);
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|omkar-logo.png|manufacturing-hero.png).*)']};
