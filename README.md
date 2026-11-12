# Toufeeq Shaikh | Portfolio

Multi-page portfolio for **Toufeeq Shaikh**, Full Stack Developer and AI Engineer.
Built with React, Vite, Framer Motion and Supabase.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: hero, services, short About, featured projects |
| `/about` | Story, journey, tech stack, hackathon wins, process, FAQ |
| `/projects` | All projects |
| `/book` | Book a call (own booking system) or send a message |
| `/play` | Games: Hand Cricket vs AI, Bug Squash |
| `/admin` | Private page: add, edit and delete projects, confirm bookings, read messages |

## Run locally

```bash
npm install
cp .env.example .env   # Windows CMD: copy .env.example .env
npm run dev
```

`.env` needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Supabase setup (one time)

1. Open Supabase, SQL Editor, paste everything from `supabase/schema.sql` and run it.
   (If you use another admin email, change it in that file first.)
2. Authentication, Users, Add user: create your admin user with email and password.
3. Authentication, Providers/Settings: turn **off** "Allow new users to sign up".
4. Open `/admin` on your site and sign in. Projects added, edited or deleted there show on Home and Projects right away (the SQL file creates the `projects` table and inserts the 4 sample projects).

## Booking settings

Edit `bookingCfg` in `src/data.js`: open days, hours, call length, how many days ahead.
Times are Pakistan time. Visitors see them in their own timezone.

## Deploy (Vercel)

Import the repo, add the two environment variables, deploy.
`vercel.json` makes direct links like `/about` work.
