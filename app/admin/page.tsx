import { identity } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin-dashboard';
export default async function Page(){const user=await identity();if(!user)redirect('/admin/login');if(!user.admin)return <main className="auth-page"><h1>Administrator access required</h1></main>;return <AdminDashboard/>;}
