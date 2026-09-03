create extension if not exists "pgcrypto";

create type public.process_status as enum ('proposed', 'reviewed', 'verified', 'established');
create type public.review_status as enum ('proposed', 'under_review', 'approved', 'changes_requested', 'rejected');
create type public.contribution_kind as enum ('new_process', 'process_change');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.processes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  family text not null,
  subgroup text,
  status public.process_status not null default 'reviewed',
  summary text,
  current_revision_id uuid,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.process_revisions (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.processes(id) on delete cascade,
  version integer not null,
  content_key text,
  content jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (process_id, version)
);

alter table public.processes
  add constraint processes_current_revision_fk
  foreign key (current_revision_id) references public.process_revisions(id);

create table public.process_visuals (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.processes(id) on delete cascade,
  revision_id uuid references public.process_revisions(id) on delete cascade,
  r2_key text not null,
  title text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.process_relationships (
  process_id uuid not null references public.processes(id) on delete cascade,
  related_process_id uuid not null references public.processes(id) on delete cascade,
  relationship text not null default 'related',
  primary key (process_id, related_process_id),
  check (process_id <> related_process_id)
);

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  kind public.contribution_kind not null,
  process_id uuid references public.processes(id) on delete cascade,
  contributor_id uuid not null references public.profiles(id),
  proposed_content jsonb not null,
  status public.review_status not null default 'proposed',
  reviewer_id uuid references public.profiles(id),
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.processes(id) on delete cascade,
  revision_id uuid references public.process_revisions(id) on delete cascade,
  title text not null,
  url text,
  citation text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.processes enable row level security;
alter table public.process_revisions enable row level security;
alter table public.process_visuals enable row level security;
alter table public.process_relationships enable row level security;
alter table public.contributions enable row level security;
alter table public.evidence enable row level security;

create policy "published processes are public"
  on public.processes for select using (published = true or auth.uid() is not null);
create policy "approved revisions are public"
  on public.process_revisions for select using (
    exists (select 1 from public.processes p where p.current_revision_id = process_revisions.id and p.published = true)
  );
create policy "published visuals are public"
  on public.process_visuals for select using (
    exists (select 1 from public.processes p where p.id = process_visuals.process_id and p.published = true)
  );
create policy "relationships are public"
  on public.process_relationships for select using (true);
create policy "published evidence is public"
  on public.evidence for select using (
    exists (select 1 from public.processes p where p.id = evidence.process_id and p.published = true)
  );
create policy "users read own contributions"
  on public.contributions for select using (contributor_id = auth.uid());
create policy "users create contributions"
  on public.contributions for insert with check (contributor_id = auth.uid() and status = 'proposed');
create policy "admins manage contributions"
  on public.contributions for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create index processes_family_idx on public.processes (family, subgroup, name);
create index contributions_status_idx on public.contributions (status, created_at);
create index process_visuals_order_idx on public.process_visuals (process_id, sort_order);
