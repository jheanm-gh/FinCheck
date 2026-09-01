-- Climeo schema (§28)
--
-- ⚠️  DO NOT APPLY THIS UNTIL THE POPIA RESPONSIBLE PARTY IS SETTLED.
--
-- Harika advises as a representative under Sanlam's FSP licence. Client contact
-- details and financial information held in a third-party Supabase project sit
-- outside her FSP's governance. Whether that is permitted at all is a question for
-- Concept Wealth's key individual, not a technical decision. The schema is written
-- and ready; applying it is a compliance call.
--
-- Design principle: PII and analytics NEVER share a table.
--   leads                  -> personal information, locked down hard
--   lead_consents          -> immutable audit of exactly what was agreed to
--   assessment_sessions    -> anonymous, no join key back to a person
--   calculator_sessions    -> anonymous, no join key back to a person
--
-- The anonymous tables carry no lead_id on purpose. Being able to join a check
-- result back to a named person turns aggregate analytics into a profile of
-- someone's finances, which is exactly what data minimisation is meant to prevent.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Personal information
-- ---------------------------------------------------------------------------

create type lead_status as enum (
  'new', 'contacted', 'meeting_booked', 'follow_up',
  'converted', 'not_suitable', 'closed'
);

create type contact_method as enum ('email', 'phone', 'whatsapp');

create table leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  first_name        text not null check (length(first_name) between 1 and 80),
  surname           text check (length(surname) <= 80),
  email             text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  mobile            text check (length(mobile) <= 30),

  intent            text,
  preferred_contact contact_method not null default 'email',
  message           text check (length(message) <= 1200),

  -- Band only. Individual answers are deliberately never stored.
  check_band        text check (check_band in ('attention','developing','ontrack','strong')),

  source            text not null default 'site',
  campaign          text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,

  status            lead_status not null default 'new',
  adviser_notes     text,
  updated_at        timestamptz not null default now()
);

create index leads_created_at_idx on leads (created_at desc);
create index leads_status_idx on leads (status);

-- ---------------------------------------------------------------------------
-- Consent audit — append only, never updated, never deleted
-- ---------------------------------------------------------------------------

create table lead_consents (
  id                 uuid primary key default gen_random_uuid(),
  lead_id            uuid not null references leads(id) on delete cascade,
  recorded_at        timestamptz not null default now(),

  version            text not null,
  contact_wording    text not null,
  contact_agreed_at  timestamptz not null,

  -- Null means marketing consent was NOT given. Never store a default of true.
  marketing_wording  text,
  marketing_agreed_at timestamptz,

  -- Set when consent is later withdrawn. The original record is never altered.
  withdrawn_at       timestamptz,

  constraint marketing_pair check (
    (marketing_wording is null and marketing_agreed_at is null)
    or (marketing_wording is not null and marketing_agreed_at is not null)
  )
);

create index lead_consents_lead_idx on lead_consents (lead_id);

-- A lead may be contacted about their enquiry. Marketing needs live consent.
create view marketable_leads as
  select l.*
  from leads l
  join lead_consents c on c.lead_id = l.id
  where c.marketing_agreed_at is not null
    and c.withdrawn_at is null;

-- ---------------------------------------------------------------------------
-- Anonymous analytics — no route back to a person
-- ---------------------------------------------------------------------------

create table assessment_sessions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  completed    boolean not null default false,
  band         text check (band in ('attention','developing','ontrack','strong')),
  protect_band text,
  prepare_band text,
  grow_band    text,
  plan_band    text,
  campaign     text
);

create table calculator_sessions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  calculator_id text not null,
  completed     boolean not null default false,
  campaign      text
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table leads enable row level security;
alter table lead_consents enable row level security;
alter table assessment_sessions enable row level security;
alter table calculator_sessions enable row level security;

-- No anon policies on leads at all. The public site writes via a server route using
-- the service role, never from the browser. An anon insert policy here would let
-- anyone POST directly to PostgREST and flood the table.

create policy "adviser reads leads"
  on leads for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'adviser');

create policy "adviser updates lead status"
  on leads for update
  to authenticated
  using (auth.jwt() ->> 'role' = 'adviser')
  with check (auth.jwt() ->> 'role' = 'adviser');

create policy "adviser reads consents"
  on lead_consents for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'adviser');

-- Deliberately no update or delete policy on lead_consents.
-- An audit trail you can edit is not an audit trail.

create policy "adviser reads assessment sessions"
  on assessment_sessions for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'adviser');

create policy "adviser reads calculator sessions"
  on calculator_sessions for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'adviser');

-- ---------------------------------------------------------------------------
-- Housekeeping
-- ---------------------------------------------------------------------------

create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_touch_updated_at
  before update on leads
  for each row execute function touch_updated_at();

comment on table leads is
  'Personal information. Retention period must be set by the responsible party once identified.';
comment on table lead_consents is
  'Append-only POPIA consent audit. Never update or delete rows here.';
