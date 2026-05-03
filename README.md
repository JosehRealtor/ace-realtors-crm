# Ace Realtors CRM

A full-featured CRM for Ace Realtors Ltd, Nairobi — built with React, Vite, Tailwind CSS and Supabase.

## Features
- Dashboard with KPIs and charts
- Enquiries management with full CRUD
- Pipeline Kanban board (drag and drop)
- Properties listings (grid & list view)
- Clients & Partners directory
- Team performance tracking
- Reports & commission tracking

## Setup Instructions

### Step 1 — Create Supabase Project
1. Go to https://supabase.com and create a free account
2. Create a new project — name it `ace-realtors-crm`
3. Go to **SQL Editor** and run the entire contents of `supabase-setup.sql`
4. Go to **Project Settings → API** and copy your **Project URL** and **anon key**

### Step 2 — Configure Environment Variables
1. Create a `.env` file in the root folder
2. Add your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3 — Push to GitHub
1. Create a new repository on https://github.com
2. Upload all these files to the repository

### Step 4 — Deploy on Netlify
1. Go to https://netlify.com and sign up free
2. Click **Add new site → Import from GitHub**
3. Select your repository
4. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Go to **Site settings → Environment variables** and add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
6. Click **Deploy** — your CRM is live!

## Team
- Peter — Director
- Joseph — Marketer
- Kenneth — Marketer
- Mercy — Marketer
- Lucy — Marketer
- Secretary — TBD
