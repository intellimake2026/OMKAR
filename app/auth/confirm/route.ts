import { authClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
export async function GET(request:Request){const url=new URL(request.url);const client=await authClient();const code=url.searchParams.get('code');const hash=url.searchParams.get('token_hash');const type=url.searchParams.get('type');let ok=false;
 if(code){const {error}=await client.auth.exchangeCodeForSession(code);ok=!error;}
 else if(hash&&(type==='signup'||type==='email'||type==='magiclink')){const {error}=await client.auth.verifyOtp({token_hash:hash,type});ok=!error;}
 return NextResponse.redirect(new URL(ok?'/':'/login?confirmation=failed',url.origin));
}
