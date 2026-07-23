-- RAMSHAD PORTFOLIO PRO ADMIN
-- Safe to run again after the earlier setup.sql.
-- Supabase Dashboard > SQL Editor > New query > paste all > Run.

create table if not exists public.site_settings (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_categories (
  id text primary key,
  name text not null unique,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id text primary key,
  title text not null check (char_length(title) between 1 and 150),
  category text not null check (char_length(category) between 1 and 100),
  type text not null check (type in ('image', 'video')),
  accent text not null default 'g' check (accent in ('g', 'b', 'o')),
  src text not null,
  storage_path text,
  description text not null default '',
  project_date date,
  external_url text,
  thumbnail_url text,
  thumbnail_storage_path text,
  featured boolean not null default false,
  visible boolean not null default true,
  status text not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Upgrade an older portfolio_items table without deleting existing projects.
alter table public.portfolio_items add column if not exists description text not null default '';
alter table public.portfolio_items add column if not exists project_date date;
alter table public.portfolio_items add column if not exists external_url text;
alter table public.portfolio_items add column if not exists thumbnail_url text;
alter table public.portfolio_items add column if not exists thumbnail_storage_path text;
alter table public.portfolio_items add column if not exists featured boolean not null default false;
alter table public.portfolio_items add column if not exists visible boolean not null default true;
alter table public.portfolio_items add column if not exists status text not null default 'published';
alter table public.portfolio_items add column if not exists sort_order integer not null default 0;
alter table public.portfolio_items add column if not exists updated_at timestamptz not null default now();

create table if not exists public.skills (
  id text primary key,
  title text not null,
  percentage integer not null default 0,
  description text not null default '',
  icon_class text not null default 'fa-solid fa-star',
  accent text not null default 'g',
  size_class text not null default 'normal',
  short_label text not null default 'SK',
  chips text[] not null default '{}',
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tools (
  id text primary key,
  name text not null,
  icon_class text not null default 'fa-solid fa-wand-magic-sparkles',
  accent text not null default 'g',
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline_items (
  id text primary key,
  year_label text not null,
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  title text not null,
  description text not null default '',
  icon_url text,
  icon_storage_path text,
  icon_class text not null default 'fa-solid fa-pen-nib',
  accent text not null default 'g',
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id text primary key,
  platform text not null,
  handle text not null default '',
  url text not null,
  icon_class text not null default 'fa-solid fa-link',
  accent text not null default 'g',
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_messages (
  id text primary key,
  name text not null check (char_length(name) between 1 and 100),
  contact text,
  service text not null,
  project_type text,
  message text not null check (char_length(message) between 1 and 2000),
  ip text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_messages add column if not exists status text not null default 'new';
alter table public.portfolio_messages add column if not exists updated_at timestamptz not null default now();

create index if not exists portfolio_items_order_idx on public.portfolio_items (featured desc, sort_order asc, created_at desc);
create index if not exists portfolio_messages_created_at_idx on public.portfolio_messages (created_at desc);
create index if not exists services_order_idx on public.services (sort_order asc);
create index if not exists skills_order_idx on public.skills (sort_order asc);
create index if not exists tools_order_idx on public.tools (sort_order asc);
create index if not exists timeline_order_idx on public.timeline_items (sort_order asc);
create index if not exists social_links_order_idx on public.social_links (sort_order asc);

alter table public.site_settings enable row level security;
alter table public.portfolio_categories enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.skills enable row level security;
alter table public.tools enable row level security;
alter table public.timeline_items enable row level security;
alter table public.services enable row level security;
alter table public.social_links enable row level security;
alter table public.portfolio_messages enable row level security;

-- No public table policies are needed. Vercel Functions use the private server key.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  262144000,
  array[
    'image/jpeg','image/png','image/webp','image/gif','image/avif','image/svg+xml',
    'video/mp4','video/webm','video/quicktime','video/x-m4v'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into public.site_settings (id, content)
values (
  'main',
  $$
  {
    "site": {
      "logoUrl": "/assets/images/branding/ramshad-portfolio.png",
      "navCta": "Hire Me"
    },
    "hero": {
      "eyebrow": "Graphic Designer — Kerala, India",
      "greeting": "Hi, I'm",
      "name": "Ramshad",
      "roles": ["Graphic Designer", "Motion Designer", "3D Visual Artist", "AI Visual Creator"],
      "description": "Self-taught creative designer from Kerala, India — crafting cinematic digital experiences through 3D, motion graphics, branding & AI visuals. Where faith, technology, and design converge.",
      "profileUrl": "/assets/images/profile/profile.png",
      "profileStoragePath": "",
      "profileName": "RAMSHAD V",
      "profilePlace": "Velluvangad",
      "miniCards": [
        {"icon":"fa-solid fa-pen-nib","value":"5+ Years","label":"Creative practice"},
        {"icon":"fa-solid fa-rocket","value":"Visual Stories","label":"Design & motion"},
        {"icon":"fa-solid fa-location-dot","value":"Kerala","label":"India based"}
      ]
    },
    "about": {
      "headingHtml": "Designing with <span class=\"eg\">passion</span> —<br>building with <span class=\"eb\">purpose</span>,<br>guided by <span class=\"eo\">faith</span>",
      "bio1": "I'm Ramshad, a 23-year-old Islamic student and self-taught creative designer from Kerala, India. My passion for design started nearly 5 years ago when I began learning Blender through YouTube tutorials. Since then, I've explored motion graphics, branding, video editing, AI-generated visuals, and modern digital experiences.",
      "bio2": "Even without a coding background, I love creating cinematic digital experiences through pure curiosity and dedication. My goal is to build a meaningful creative career where faith, technology, and design come together.",
      "stats": [
        {"value":"5+","label":"Years of Design","accent":"g"},
        {"value":"6","label":"Tools Mastered","accent":"b"},
        {"value":"KL","label":"Kerala, India","accent":"o"}
      ]
    },
    "contact": {
      "heading": "Find me on social media",
      "description": "Open to freelance projects, creative collaborations, and conversations. Reach out through any platform — I'd love to connect!",
      "whatsappNumber": "918086754598",
      "email": "",
      "formNote": "Your enquiry is saved securely, then WhatsApp opens for a quick reply."
    },
    "footer": {
      "copy": "© 2026 Ramshad. All rights reserved. Kerala, India."
    }
  }
  $$::jsonb
)
on conflict (id) do nothing;

insert into public.portfolio_categories (id, name, sort_order) values
  ('cat-graphic-design','Graphic Design',10),
  ('cat-motion-graphics','Motion Graphics',20),
  ('cat-3d-design','3D Design',30),
  ('cat-ai-visuals','AI Visuals',40),
  ('cat-video-editing','Video Editing',50),
  ('cat-brand-identity','Brand Identity',60),
  ('cat-social-media','Social Media Design',70),
  ('cat-other','Other Creative Work',80)
on conflict (id) do nothing;

insert into public.services (id,title,description,icon_url,icon_class,accent,sort_order) values
  ('service-graphic-design','Graphic Design','Visual identities, brand materials, social media content, and print designs built with sharp creative vision.','/assets/images/services/graphic design.png','fa-solid fa-pen-nib','g',10),
  ('service-motion-graphics','Motion Graphics','Cinematic animations and motion design in After Effects — bringing visuals to life with real energy.','/assets/images/services/Motion Graphics.png','fa-solid fa-play','b',20),
  ('service-3d-design','3D Design','Stunning 3D models, renders, and environments in Blender — from product visuals to abstract art.','/assets/images/services/3d.png','fa-solid fa-cube','o',30),
  ('service-ai-visuals','AI Visuals','Harnessing AI tools to generate and refine unique, high-impact visual content for modern brands.','/assets/images/services/AI Visuals.png','fa-solid fa-brain','g',40),
  ('service-video-editing','Video Editing','Professional editing and color grading for reels, short films, commercials, and social content.','/assets/images/services/Video Editing.png','fa-solid fa-film','b',50),
  ('service-brand-identity','Brand Identity','Complete brand identities — logos, color systems, typography, and guidelines that truly stand out.','/assets/images/services/Brand Identity.png','fa-solid fa-award','o',60)
on conflict (id) do nothing;

insert into public.skills (id,title,percentage,description,icon_class,accent,size_class,short_label,chips,sort_order) values
  ('skill-blender','Blender & 3D Visuals',90,'Product-style renders, cinematic scenes, abstract visuals and creative 3D explorations.','fa-solid fa-cube','g','big','3D',array['3D Modeling','Lighting','Rendering','Visual Concepts'],10),
  ('skill-photoshop','Photoshop Design',88,'High-impact posters, social media creatives, manipulation and polished brand visuals.','fa-solid fa-wand-magic-sparkles','b','normal','PS',array[]::text[],20),
  ('skill-brand','Brand Identity',85,'Logo systems, typography direction, visual language and clean brand presentation.','fa-solid fa-pen-nib','o','normal','BR',array[]::text[],30),
  ('skill-motion','Motion Graphics & Video Editing',86,'Cinematic reels, kinetic titles, smooth transitions and After Effects based visual storytelling.','fa-solid fa-play','b','wide','MO',array['After Effects','Premiere Pro','Reels','Motion'],40),
  ('skill-ai','AI Visuals',82,'Prompt-based creative visuals, cinematic references and AI-assisted concept design.','fa-solid fa-brain','g','normal','AI',array[]::text[],50),
  ('skill-layout','Layout & Social Media',80,'Clean composition, campaign posts, visual hierarchy and audience-focused content design.','fa-solid fa-layer-group','o','normal','SM',array[]::text[],60)
on conflict (id) do nothing;

insert into public.tools (id,name,icon_class,accent,sort_order) values
  ('tool-blender','Blender','fa-solid fa-cube','g',10),
  ('tool-photoshop','Photoshop','fa-solid fa-wand-magic-sparkles','b',20),
  ('tool-illustrator','Illustrator','fa-solid fa-pen-nib','o',30),
  ('tool-after-effects','After Effects','fa-solid fa-play','g',40),
  ('tool-premiere','Premiere Pro','fa-solid fa-film','b',50),
  ('tool-ai','AI Tools','fa-solid fa-brain','o',60),
  ('tool-branding','Branding','fa-solid fa-object-group','g',70),
  ('tool-motion','Motion','fa-solid fa-bolt','b',80)
on conflict (id) do nothing;

insert into public.timeline_items (id,year_label,title,description,sort_order) values
  ('timeline-2003','2003','Born in Pandikkad, Malappuram','The beginning of a life shaped by family, faith, learning and a deep creative curiosity.',10),
  ('timeline-2009','2009','School & Madrasa Life Begins','Started academic learning at AMLP School Velluvangad and religious learning at Noorul Huda Madrasa.',20),
  ('timeline-2013','2013','Jamia Islamiyya Manjeri','Moved to Jamia Junior College, Jamia Islamiyya Manjeri, for higher studies and stronger academic discipline.',30),
  ('timeline-2019','2019','SSLC & Alathurpadi Dars','Completed SSLC from Jamia and joined the renowned Alathurpadi Dars, one of Kerala''s respected centres for Dars studies.',40),
  ('timeline-2021','2021','Plus Two & BA Arabic','Completed Plus Two in Humanities and started BA Arabic under Calicut University alongside religious studies.',50),
  ('timeline-2022','2022','Entering the Design World','Discovered a strong interest in Blender and stepped into the creative world of 3D design, visuals and digital media.',60),
  ('timeline-2024','2024','BA Arabic Completed','Completed BA Arabic while continuing the journey of Islamic learning, design practice and personal growth.',70),
  ('timeline-2025','2025','Jamia Nizamiyya & Media Journey','Started another degree at Jamia Nizamiyya, Hyderabad, and got the great opportunity to join the Samastha Sandesh Yathra media team.',80),
  ('timeline-2026','2026','Samastha 100th Anniversary Media Team','Became part of the Samastha 100th Anniversary media team — continuing the great journey towards the next level.',90)
on conflict (id) do nothing;

insert into public.social_links (id,platform,handle,url,icon_class,accent,sort_order) values
  ('social-instagram','Instagram','@ramshad_v_','https://www.instagram.com/ramshad_v_/','fa-brands fa-instagram','g',10),
  ('social-whatsapp','WhatsApp','+91 8086754598','https://wa.me/918086754598','fa-brands fa-whatsapp','b',20),
  ('social-linkedin','LinkedIn','ramshu-undefined-919a18261','https://www.linkedin.com/in/ramshu-undefined-919a18261','fa-brands fa-linkedin','o',30),
  ('social-pinterest','Pinterest','pin.it/6ImXu9Qm9','https://pin.it/6ImXu9Qm9','fa-brands fa-pinterest','g',40),
  ('social-telegram','Telegram','@ramshad4598','https://t.me/ramshad4598','fa-brands fa-telegram','b',50),
  ('social-linktree','Linktree','linktr.ee/ramshad_v_','https://linktr.ee/ramshad_v_','fa-solid fa-tree','o',60)
on conflict (id) do nothing;
