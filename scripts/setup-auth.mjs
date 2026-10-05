import postgres from 'postgres';
import fs from 'node:fs';
const sql=postgres(process.env.OMKAR_POSTGRES_URL_NON_POOLING||process.env.OMKAR_POSTGRES_URL,{ssl:'require',max:1,connect_timeout:20});
try {
 const rows=await sql`select to_regclass('public.omkar_admins') as name`;
 if(!rows[0].name){await sql.unsafe(fs.readFileSync('supabase/migrations/002_accounts_editing_reports.sql','utf8'));console.log('Account, admin, content revision and correction-report migration applied.');}
 else console.log('Account tables already installed.');
 await sql`select instance_id from auth.users limit 0`;
 console.log('Database connection verified.');
} catch(e){ console.error('Setup failed:',e.code||'database connection error');process.exitCode=1; } finally {await sql.end();}
