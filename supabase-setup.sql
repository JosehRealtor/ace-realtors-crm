-- ============================================
-- ACE REALTORS CRM - SUPABASE DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- 1. ENQUIRIES TABLE
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  phone text not null,
  email text,
  type text not null check (type in ('Buy', 'Rent')),
  property_interest text not null,
  budget numeric not null default 0,
  source_platform text not null check (source_platform in ('BuyRent Kenya', 'Property24', 'Website', 'Referral')),
  assigned_marketer text not null default 'Unassigned' check (assigned_marketer in ('Joseph', 'Kenneth', 'Mercy', 'Lucy', 'Unassigned')),
  pipeline_stage text not null default 'New' check (pipeline_stage in ('New', 'Contacted', 'Viewing Scheduled', 'Negotiating', 'Closed Won', 'Closed Lost')),
  next_followup date,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.enquiries enable row level security;
create policy "Allow anon full access" on public.enquiries for all to anon using (true) with check (true);

-- 2. PROPERTIES TABLE
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  property_name text not null,
  type text not null check (type in ('House', 'Apartment', 'Plot', 'Commercial')),
  location text not null,
  price numeric not null default 0,
  deal_type text not null check (deal_type in ('For Sale', 'For Rent')),
  bedrooms integer,
  status text not null default 'Available' check (status in ('Available', 'Under Offer', 'Taken')),
  platforms text[] default '{}',
  owner_name text,
  owner_type text check (owner_type in ('Landlord', 'Developer')),
  assigned_marketer text default 'Unassigned' check (assigned_marketer in ('Joseph', 'Kenneth', 'Mercy', 'Lucy', 'Unassigned')),
  created_at timestamptz not null default now()
);
alter table public.properties enable row level security;
create policy "Allow anon full access" on public.properties for all to anon using (true) with check (true);

-- 3. CLIENTS TABLE
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  type text not null check (type in ('Buyer', 'Tenant')),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.clients enable row level security;
create policy "Allow anon full access" on public.clients for all to anon using (true) with check (true);

-- 4. PARTNERS TABLE (Landlords & Developers)
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  type text not null check (type in ('Landlord', 'Developer')),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.partners enable row level security;
create policy "Allow anon full access" on public.partners for all to anon using (true) with check (true);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Sample enquiries
insert into public.enquiries (client_name, phone, email, type, property_interest, budget, source_platform, assigned_marketer, pipeline_stage, next_followup, notes) values
  ('James Mwangi', '+254 712 345 678', 'james@email.com', 'Buy', '3BR House, Kilimani', 15000000, 'BuyRent Kenya', 'Joseph', 'Viewing Scheduled', current_date, 'Interested in gated community'),
  ('Amina Hassan', '+254 722 987 654', 'amina.h@email.com', 'Rent', '2BR Apartment, Westlands', 85000, 'Property24', 'Kenneth', 'Contacted', current_date - interval '2 days', 'Needs parking space'),
  ('Peter Ochieng', '+254 733 111 222', 'peter.o@email.com', 'Buy', '4BR Villa, Karen', 35000000, 'Referral', 'Unassigned', 'New', current_date + interval '3 days', 'Referred by existing client'),
  ('Grace Wanjiru', '+254 700 222 333', 'grace.w@email.com', 'Rent', '1BR Studio, Ngong Road', 45000, 'Website', 'Mercy', 'Negotiating', current_date + interval '1 day', 'Looking to move in immediately'),
  ('David Kamau', '+254 711 444 555', 'david.k@email.com', 'Buy', 'Commercial Space, CBD', 25000000, 'BuyRent Kenya', 'Lucy', 'Contacted', current_date + interval '5 days', 'For business premises');

-- Sample properties
insert into public.properties (property_name, type, location, price, deal_type, bedrooms, status, platforms, owner_name, owner_type, assigned_marketer) values
  ('Karen Villa', 'House', 'Karen, Nairobi', 45000000, 'For Sale', 4, 'Available', '{"BuyRent Kenya","Property24"}', 'G. Njoroge', 'Landlord', 'Joseph'),
  ('Westlands 2BR Apartment', 'Apartment', 'Westlands, Nairobi', 65000, 'For Rent', 2, 'Available', '{"Property24","Website"}', 'H. Patel', 'Landlord', 'Mercy'),
  ('Ruiru Plot', 'Plot', 'Ruiru, Kiambu', 8500000, 'For Sale', null, 'Available', '{"BuyRent Kenya"}', 'Apex Homes', 'Developer', 'Kenneth'),
  ('Kilimani 3BR Townhouse', 'House', 'Kilimani, Nairobi', 22000000, 'For Sale', 3, 'Under Offer', '{"BuyRent Kenya","Property24","Website"}', 'Zenith Developments', 'Developer', 'Lucy');

-- Sample clients
insert into public.clients (name, phone, email, type, notes) values
  ('James Mwangi', '+254 712 345 678', 'james@email.com', 'Buyer', 'Looking for 3BR in Kilimani'),
  ('Amina Hassan', '+254 722 987 654', 'amina.h@email.com', 'Tenant', 'Needs parking, prefers Westlands');

-- Sample partners
insert into public.partners (name, phone, email, type, notes) values
  ('H. Patel', '+254 720 111 000', 'patel@email.com', 'Landlord', '3 units in Westlands'),
  ('G. Njoroge', '+254 722 333 444', 'njoroge@email.com', 'Landlord', '1 villa in Karen'),
  ('Apex Homes', '+254 700 555 666', 'info@apexhomes.co.ke', 'Developer', '8 plots in Ruiru'),
  ('Zenith Developments', '+254 733 777 888', 'info@zenith.co.ke', 'Developer', '12 units in Kilimani');
