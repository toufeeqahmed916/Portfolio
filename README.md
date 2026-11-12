# Toufeeq Portfolio (React + Vite)
```
npm install
cp .env.example .env   # Supabase keys daalo
npm run dev
```
**Supabase table (SQL Editor mein run karo):**
```sql
create table messages (id bigint generated always as identity primary key,
  name text, email text, service text, message text, created_at timestamptz default now());
alter table messages enable row level security;
create policy "anyone can send" on messages for insert to anon with check (true);
```
Content edit: `src/data.js` (TODO wali lines). Deploy: Vercel pe import karo, env vars add karo.
