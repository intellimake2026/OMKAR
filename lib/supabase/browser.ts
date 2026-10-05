import { createBrowserClient } from '@supabase/ssr';
export function browserAuth(){return createBrowserClient(process.env.NEXT_PUBLIC_OMKAR_SUPABASE_URL!,process.env.NEXT_PUBLIC_OMKAR_SUPABASE_PUBLISHABLE_KEY!);}
