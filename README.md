# Toufeeq Shaikh | Portfolio

Personal portfolio of **Toufeeq Shaikh**, a Full Stack Developer and AI Engineer from Pakistan. I build web apps and smart automations that work.

**Live site:** https://YOUR-VERCEL-LINK.vercel.app

## What's inside

- Welcome loader with a 0 to 100% counter, typewriter text and an Urdu greeting
- Floating nav that shrinks to an "Available for work" pill on scroll
- Hero with a tilting photo card
- Sticky photo card that changes as you scroll
- Hover previews on the services list
- Featured projects: Karwan, Haven, Hostel 24, System X Hackathon
- Hackathon wins section
- Floating, draggable tech icons that move away from your mouse
- Contact form that saves messages to Supabase
- Responsive design for phone, tablet and desktop

## Tech stack

React, Vite, Framer Motion, Supabase (PostgreSQL), plain CSS

## Run it locally

```bash
git clone https://github.com/toufeeqahmed916/toufeeq-portfolio.git
cd toufeeq-portfolio
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. On Windows CMD, use `copy .env.example .env`.

## Environment variables

Add these to `.env`:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

If they are empty, the contact form shows "Form is not connected yet". Everything else still works.

## Supabase setup

Run this in the Supabase SQL Editor:

```sql
create table messages (
  id bigint generated always as identity primary key,
  name text, email text, service text, message text,
  created_at timestamptz default now()
);
alter table messages enable row level security;
create policy "anyone can send" on messages
  for insert to anon with check (true);
```

## Edit the content

Most text lives in `src/data.js`: services, projects, journey, stats and hackathons. Images and icons are in `public/`.

## Build and deploy

```bash
npm run build
npm run preview
```

Deploy on Vercel: import the repo, add the two environment variables, and deploy.

## Contact

- Email: toufeeqahmed912006@gmail.com
- LinkedIn: https://www.linkedin.com/in/toufeeq-shaikh-880019321
- GitHub: https://github.com/toufeeqahmed916