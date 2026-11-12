-- Run this whole file once in Supabase: SQL Editor -> New query -> Run.
-- Replace the email below with the email of YOUR admin user.

-- 1) Contact messages
create table if not exists messages (
  id bigint generated always as identity primary key,
  name text, email text, service text, message text,
  created_at timestamptz default now()
);
alter table messages enable row level security;
drop policy if exists "anyone can send" on messages;
create policy "anyone can send" on messages for insert to anon with check (true);
drop policy if exists "admin reads messages" on messages;
create policy "admin reads messages" on messages for select to authenticated
  using ((auth.jwt() ->> 'email') = 'toufeeqahmed912006@gmail.com');

-- 2) Bookings
create table if not exists bookings (
  id bigint generated always as identity primary key,
  name text not null, email text not null, topic text, note text,
  slot_start timestamptz not null,
  visitor_tz text,
  status text not null default 'pending' check (status in ('pending','confirmed','declined')),
  created_at timestamptz default now()
);
-- One person per time slot (declined slots become free again)
create unique index if not exists bookings_one_per_slot on bookings (slot_start) where status <> 'declined';

alter table bookings enable row level security;
drop policy if exists "anyone can book" on bookings;
create policy "anyone can book" on bookings for insert to anon with check (status = 'pending');
drop policy if exists "admin reads bookings" on bookings;
create policy "admin reads bookings" on bookings for select to authenticated
  using ((auth.jwt() ->> 'email') = 'toufeeqahmed912006@gmail.com');
drop policy if exists "admin updates bookings" on bookings;
create policy "admin updates bookings" on bookings for update to authenticated
  using ((auth.jwt() ->> 'email') = 'toufeeqahmed912006@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'toufeeqahmed912006@gmail.com');

-- 3) Visitors may only see WHICH times are taken, never who booked
create or replace function booked_slots()
returns table (slot_start timestamptz)
language sql security definer set search_path = public as $$
  select b.slot_start from bookings b where b.status <> 'declined' and b.slot_start > now();
$$;
grant execute on function booked_slots() to anon, authenticated;

-- 4) Projects (shown on Home + Projects pages, managed from /admin)
create table if not exists projects (
  id bigint generated always as identity primary key,
  title text not null check (char_length(btrim(title)) between 2 and 80),
  tag text not null default '' check (char_length(tag) <= 40),
  problem text check (problem is null or char_length(problem) <= 400),
  what text not null check (char_length(btrim(what)) between 10 and 600),
  live_url text check (live_url is null or live_url ~* '^https?://\S+$'),
  code_url text check (code_url is null or code_url ~* '^https?://\S+$'),
  img text check (img is null or img ~* '^(/|https?://)\S+$'),
  color text not null default '#6bf01f' check (color ~* '^#[0-9a-f]{6}$'),
  sort_order int not null default 0,
  created_at timestamptz default now()
);
alter table projects enable row level security;
-- anyone can read; only the admin can add, edit or delete
drop policy if exists "public reads projects" on projects;
create policy "public reads projects" on projects for select to anon, authenticated using (true);
drop policy if exists "admin adds projects" on projects;
create policy "admin adds projects" on projects for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'toufeeqahmed912006@gmail.com');
drop policy if exists "admin edits projects" on projects;
create policy "admin edits projects" on projects for update to authenticated
  using ((auth.jwt() ->> 'email') = 'toufeeqahmed912006@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'toufeeqahmed912006@gmail.com');
drop policy if exists "admin deletes projects" on projects;
create policy "admin deletes projects" on projects for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'toufeeqahmed912006@gmail.com');

-- Sample records (only inserted when the table is empty)
insert into projects (title, tag, problem, what, live_url, code_url, img, color, sort_order)
select * from (values
  ('Karwan', 'AI + Maps', 'After floods and disasters, relief trucks reach some areas late and others get too much. Teams plan on guesswork.',
   'Karwan shows needs on a live map with heatmaps, finds real routes, tracks trucks live, and lets teams test what-if plans before they send help. It won 2nd place at OPEN HACK''26 among 60+ teams.',
   'https://karwann-frontend.vercel.app/', 'https://github.com/toufeeqahmed916', '/karwan.jpg', '#6bf01f', 1),
  ('Haven', 'AI + Full Stack', 'Many people in Pakistan do not know where to complain, or never hear back when they do.',
   'Haven lets citizens report safety issues and complaints in Urdu, Sindhi or English. AI sorts and ranks them, and an admin control room helps teams act fast.',
   'https://haven-five-flax.vercel.app/', 'https://github.com/toufeeqahmed916', '/haven.jpg', '#3b7bff', 2),
  ('System X Hackathon', 'Event Website', null,
   'I built the official website for System X Hackathon 1.0, a CS event at MUET Jamshoro. Winners, judges, gallery, reviews and FAQ, all in one fast place.',
   'https://systemhackathon.netlify.app/', 'https://github.com/System-x-hackathon', '/systemx.jpg', '#111111', 3),
  ('Hostel 24', 'Mobile App', null,
   'A React Native app to manage hostels: rooms, residents and payments, with white-label builds so each hostel gets its own app.',
   null, 'https://github.com/toufeeqahmed916', null, '#ffd23f', 4)
) as v(title, tag, problem, what, live_url, code_url, img, color, sort_order)
where not exists (select 1 from projects);
