// ✏️ Sara content yahan se edit hota hai. "TODO" wali lines apni real info se replace karo.
export const links = {
  linkedin: 'https://www.linkedin.com/in/toufeeq-shaikh-880019321',
  github: 'https://github.com/toufeeqahmed916',
  email: 'toufeeqahmed912006@gmail.com',
  phone: '+92 303 3869307',
}

export const services = [
  { t: 'Full Stack Web Development', p: ['Fast, responsive websites and web apps', 'React, Node.js, Express and PostgreSQL / Supabase', 'Login, dashboards and admin panels', 'Launch, fixes and ongoing support'] },
  { t: 'AI Engineering & Automation', p: ['Add AI to your product with LLM APIs like Gemini', 'Smart assistants and chatbots', 'Python scripts that automate boring work', 'Turn messy data into useful answers'] },
  { t: 'Embedded & Smart Devices', p: ['Arduino and C++ projects', 'Voice assistants on small chips', 'Sensors, screens and real-world gadgets', 'Connecting hardware with the web'] },
  { t: 'Graphic Design & Branding', p: ['Logos and brand looks', 'Social media posts and banners', 'YouTube thumbnails', 'UI design that matches your brand'] },
]

export const stats = [
  { n: 2, l: 'Years of Experience' },
  { n: 100, l: 'Completed Projects' },
  { n: 95, l: 'Clients Worldwide' },
]

export const projects = [
  { tag: 'AI + Maps', title: 'Karwan', color: 'var(--green)', ink: '#111', img: '/karwan.jpg',
    problem: 'After floods and disasters, relief trucks reach some areas late and others get too much. Teams plan on guesswork.',
    what: 'Karwan shows needs on a live map with heatmaps, finds real routes, tracks trucks live, and lets teams test what-if plans before they send help. It won 2nd place at OPEN HACK\'26 among 60+ teams.',
    live: 'https://karwann-frontend.vercel.app/', code: 'https://github.com/toufeeqahmed916' },
  { tag: 'AI + Full Stack', title: 'Haven', color: 'var(--blue)', ink: '#fff', img: '/haven.jpg',
    problem: 'Many people in Pakistan do not know where to complain, or never hear back when they do.',
    what: 'Haven lets citizens report safety issues and complaints in Urdu, Sindhi or English. AI sorts and ranks them, and an admin control room helps teams act fast.',
    live: 'https://haven-five-flax.vercel.app/', code: 'https://github.com/toufeeqahmed916' },
  { tag: 'Event Website', title: 'System X Hackathon', color: '#111', ink: '#fff', img: '/systemx.jpg',
    what: 'I built the official website for System X Hackathon 1.0, a CS event at MUET Jamshoro. Winners, judges, gallery, reviews and FAQ, all in one fast place.',
    live: 'https://systemhackathon.netlify.app/', code: 'https://github.com/System-x-hackathon' },
  { tag: 'Mobile App', title: 'Hostel 24', color: 'var(--yellow)', ink: '#111',
    what: 'A React Native app to manage hostels: rooms, residents and payments, with white-label builds so each hostel gets its own app.',
    live: '', code: 'https://github.com/toufeeqahmed916' },
]

export const stack = [
  ['React JS', 'Fast, reusable interfaces for web apps.'],
  ['Node JS & Express', 'APIs and server logic that scale.'],
  ['PostgreSQL & Supabase', 'Reliable data, auth and storage.'],
  ['Python & AI APIs', 'Automation, LLM features and smart tools.'],
  ['TypeScript, JS, HTML & CSS', 'Clean, safe and responsive code.'],
  ['Arduino (C++)', 'Hardware projects that talk to the web.'],
]

export const journey = [
  ['Co-Founder', 'Skyline Concepts', '2025 · Present'],
  ['Freelance Developer', 'Independent Projects', '2023 · Present'],
  ['Built Official Website', 'System X Hackathon 1.0 · MUET', '2026'],
  ['IEEE CS Design Team', 'MUET', 'Present'],
]

export const process = [
  { n: '01', t: 'Research & Planning', k: 'white' }, { img: '/proc1.jpg' }, { n: '02', t: 'Creative Concept', k: 'green' },
  { img: '/proc2.jpg' }, { n: '03', t: 'Design & Development', k: 'dark', wide: true },
  { n: '04', t: 'Testing & Refinement', k: 'green' }, { n: '05', t: 'Launch & Support', k: 'white' }, { img: '/proc3.jpg' },
]

// TODO: real client reviews paste karo (Fiverr etc.)
export const reviews = [
  { q: 'Paste a real client review here.', n: 'Client name' },
  { q: 'Paste a real client review here.', n: 'Client name' },
  { q: 'Paste a real client review here.', n: 'Client name' },
]

export const faqs = [
  ['What services do you offer?', 'I build full stack web apps, add AI and automation to products, and do some graphic design and branding on the side.'],
  ['Do you build responsive websites?', 'Yes. Every site I build works well on phones, tablets and desktops.'],
  ['Can you add AI to my existing product?', 'Yes. I can connect LLM APIs, build assistants, and automate repeated tasks with Python.'],
  ['How long does a project take?', 'A simple site takes about 1 to 2 weeks. Bigger apps take longer. I will give you a clear timeline before we start.'],
  ['Do you offer revisions and support?', 'Yes. Revisions are part of the work, and I stay available after launch to fix and improve things.'],
  ['How do I get started?', 'Send me a message below with your idea. I reply fast and we plan the next step together.'],
]

export const hackathons = [
  { place: 'Runner-Up', title: "DITE Hackathon '26", org: 'Denning University, Hyderabad', note: 'Team Triple Bytes beat 150+ teams. On Day 1 we were still fixing errors. We did not give up, and we went home with the trophy.' },
  { place: '2nd Place', title: "OPEN HACK'26", org: 'Dept. of Software Engineering, MUET', note: 'We built Karwan, a disaster relief resource optimizer, and finished 1st runner-up among 60+ teams.' },
  { place: '5th Place', title: 'AWS HacktoberFest 2026', org: 'AWS Student Builder Group, MUET Jamshoro', note: 'Team Triple Bytes finished in the top 5 among 54 teams. Ideas turned into code, and code turned into solutions.' },
]

export const previews = [
  ['Full Stack', 'var(--green)'], ['AI & Automation', 'var(--yellow)'], ['Embedded', 'var(--blue)'], ['Design', '#fff'],
]

// Booking settings. Times are in Pakistan time (PKT, UTC+5).
export const bookingCfg = {
  days: [1, 2, 3, 4, 5, 6], // open days: 0 = Sunday ... 6 = Saturday
  from: 11,                 // first slot starts at 11:00
  to: 19,                   // last slot ends at 19:00
  slotMins: 30,             // length of one call
  ahead: 14,                // how many days ahead people can book
  minNoticeHrs: 3,          // no booking closer than this
  utcOffset: 5,             // Pakistan time
}
