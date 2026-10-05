begin;
create table if not exists public.omkar_admins(user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());
create table if not exists public.omkar_content(key text primary key, data jsonb not null, version integer not null default 1, updated_by uuid not null references auth.users(id), updated_at timestamptz not null default now());
create table if not exists public.omkar_revisions(id bigint generated always as identity primary key, key text not null, data jsonb not null, version integer not null, editor_id uuid not null references auth.users(id), created_at timestamptz not null default now());
create table if not exists public.omkar_reports(id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), page_path text not null, message text not null check(length(message) between 10 and 5000), status text not null default 'open' check(status in ('open','resolved','dismissed')), admin_note text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
alter table public.omkar_admins enable row level security;
alter table public.omkar_content enable row level security;
alter table public.omkar_revisions enable row level security;
alter table public.omkar_reports enable row level security;
create policy "read own admin role" on public.omkar_admins for select to authenticated using(user_id=auth.uid());
create policy "members read content" on public.omkar_content for select to authenticated using(true);
create policy "members read own reports" on public.omkar_reports for select to authenticated using(user_id=auth.uid() or exists(select 1 from public.omkar_admins where user_id=auth.uid()));
-- All writes use server-only routines after verified session and role checks.
revoke all on public.omkar_admins,public.omkar_content,public.omkar_revisions,public.omkar_reports from anon,authenticated;
grant select on public.omkar_admins,public.omkar_content,public.omkar_reports to authenticated;
grant all on public.omkar_admins,public.omkar_content,public.omkar_revisions,public.omkar_reports to service_role;
grant usage,select on sequence public.omkar_revisions_id_seq to service_role;
create or replace function public.omkar_publish(p_key text,p_data jsonb,p_version integer,p_editor uuid) returns integer language plpgsql security definer set search_path=public as $$
declare current_version integer; next_version integer;
begin
 if not exists(select 1 from omkar_admins where user_id=p_editor) then raise exception 'Administrator required'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_key,0));
 select version into current_version from omkar_content where key=p_key;
 if coalesce(current_version,0)<>p_version then raise exception 'Version conflict'; end if;
 next_version:=coalesce(current_version,0)+1;
 insert into omkar_content(key,data,version,updated_by) values(p_key,p_data,next_version,p_editor) on conflict(key) do update set data=excluded.data,version=excluded.version,updated_by=excluded.updated_by,updated_at=now();
 insert into omkar_revisions(key,data,version,editor_id) values(p_key,p_data,next_version,p_editor);
 return next_version;
end;$$;
revoke all on function public.omkar_publish(text,jsonb,integer,uuid) from public,anon,authenticated;
grant execute on function public.omkar_publish(text,jsonb,integer,uuid) to service_role;
create or replace function public.omkar_initial_admin() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if lower(new.email)='riduak01@gmail.com' and new.email_confirmed_at is not null then insert into omkar_admins(user_id) values(new.id) on conflict do nothing; end if;
 return new;
end;$$;
revoke all on function public.omkar_initial_admin() from public,anon,authenticated;
create trigger omkar_initial_admin after insert or update of email_confirmed_at on auth.users for each row execute function public.omkar_initial_admin();
insert into public.omkar_admins(user_id) select id from auth.users where lower(email)='riduak01@gmail.com' and email_confirmed_at is not null on conflict do nothing;
commit;
