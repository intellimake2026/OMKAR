import { serviceClient } from './supabase/server';
export async function managedEntry(key:string){const {data,error}=await serviceClient().from('omkar_content').select('data,version').eq('key',key).maybeSingle();if(error)throw new Error('Content store unavailable');return data;}
