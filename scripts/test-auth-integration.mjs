import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const url=process.env.NEXT_PUBLIC_OMKAR_SUPABASE_URL,key=process.env.NEXT_PUBLIC_OMKAR_SUPABASE_PUBLISHABLE_KEY;
const service=createClient(url,process.env.OMKAR_SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const users=[];let reportId;const entryKey='capability:gas-compression';let madeEntry=false;
async function account(admin=false){const email=`omkar-test-${randomUUID()}@example.com`,password=randomUUID()+randomUUID();const {data,error}=await service.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{is_admin:true}});assert.ifError(error);users.push(data.user.id);if(admin){const {error}=await service.from('omkar_admins').insert({user_id:data.user.id});assert.ifError(error);}let cookies=[];const auth=createServerClient(url,key,{cookies:{getAll:()=>cookies,setAll:items=>{for(const c of items){cookies=cookies.filter(x=>x.name!==c.name);cookies.push(c);}}}});const login=await auth.auth.signInWithPassword({email,password});assert.ifError(login.error);return {id:data.user.id,auth,cookie:()=>cookies.map(c=>`${c.name}=${c.value}`).join('; ')};}
async function request(path,user,method='GET',body,origin=base){return fetch(base+path,{method,redirect:'manual',headers:{...(user?{cookie:user.cookie()}:{}),...(method!=='GET'?{'Content-Type':'application/json',origin}:{})},...(body?{body:JSON.stringify(body)}:{})});}
try{
 assert.equal((await request('/processes')).status,307);
 for(const path of ['/api/catalog','/api/content/drilling','/api/media/drilling/0','/api/reports','/api/admin/content?key='+entryKey])assert.equal((await request(path)).status,401,path);
 console.log('PASS anonymous pages and content APIs require authentication.');
 const member=await account(),other=await account(),admin=await account(true);
 assert.equal((await request('/api/session',member).then(r=>r.json())).admin,false);
 assert.equal((await request('/api/admin/content?key='+entryKey,member)).status,403);
 assert.equal((await request('/api/admin/content',member,'PUT',{key:entryKey,data:{description:'forbidden'},version:0})).status,403);
 const {error:roleWrite}=await member.auth.from('omkar_admins').insert({user_id:member.id});assert.ok(roleWrite);
 console.log('PASS member cannot escalate via user metadata, role table, or admin API.');
 const badOrigin=await request('/api/reports',member,'POST',{page_path:'/processes/drilling',message:'A test correction request.'},'https://example.org');assert.equal(badOrigin.status,403);
 const submitted=await request('/api/reports',member,'POST',{page_path:'/processes/drilling',message:'Integration test only: please verify the source reference.'});assert.equal(submitted.status,201);reportId=(await submitted.json()).id;
 assert.ok((await request('/api/reports',member).then(r=>r.json())).some(r=>r.id===reportId));assert.ok(!(await request('/api/reports',other).then(r=>r.json())).some(r=>r.id===reportId));
 assert.equal((await request('/api/reports',member,'PATCH',{id:reportId,status:'resolved',admin_note:'forbidden'})).status,403);
 assert.equal((await request('/api/reports',admin,'PATCH',{id:reportId,status:'resolved',admin_note:'Test review complete.'})).status,200);
 assert.equal((await request('/api/reports',member).then(r=>r.json())).find(r=>r.id===reportId).status,'resolved');
 console.log('PASS correction persistence, member isolation, CSRF protection and admin review.');
 const loaded=await request('/api/admin/content?key='+entryKey,admin).then(r=>r.json());assert.equal(loaded.version,0,'Use an untouched test entry');
 const changed={...loaded.data,description:loaded.data.description+' Integration verification.'};const saved=await request('/api/admin/content',admin,'PUT',{key:entryKey,data:changed,version:0});assert.equal(saved.status,200);madeEntry=true;
 const catalog=await request('/api/catalog',member).then(r=>r.json());assert.equal(catalog.find(x=>x.key===entryKey).data.description,changed.description);
 assert.equal((await request('/api/admin/content',admin,'PUT',{key:entryKey,data:changed,version:0})).status,409);
 assert.equal((await request('/api/admin/content',admin,'PUT',{key:entryKey,data:{...changed,sourceKey:'arbitrary'},version:1})).status,400);
 const history=await request('/api/admin/content?key='+entryKey,admin).then(r=>r.json());assert.equal(history.history[0].version,1);
 const document=await request('/api/content/drilling',member);assert.equal(document.status,200);assert.match(document.headers.get('cache-control'),/no-store/);
 console.log('PASS direct publishing, live catalog, revision history, stale-edit conflict and field validation.');
}finally{
 if(madeEntry){await service.from('omkar_content').delete().eq('key',entryKey);await service.from('omkar_revisions').delete().eq('key',entryKey).in('editor_id',users);}
 if(reportId)await service.from('omkar_reports').delete().eq('id',reportId);
 for(const id of users){await service.from('omkar_admins').delete().eq('user_id',id);await service.auth.admin.deleteUser(id);}
 console.log('Temporary test users, report and edited record removed. No emails sent.');
}
