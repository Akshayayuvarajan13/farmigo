-- HarvestLink database schema
-- Paste into Supabase Dashboard > SQL Editor, then click Run.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Vegetables',
  quantity numeric not null check (quantity >= 0),
  unit text not null default 'kg',
  price numeric not null check (price >= 0),
  farmer_name text not null,
  location text not null,
  delivery_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  buyer_name text not null,
  farmer_name text not null,
  quantity numeric not null check (quantity > 0),
  unit text not null default 'kg',
  total_price numeric not null check (total_price >= 0),
  delivery_date date,
  delivery_address text,
  is_preorder boolean not null default false,
  status text not null default 'Requested'
    check (status in ('Requested','Accepted','Preparing','Dispatched','Delivered','Cancelled')),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

-- HACKATHON DEMO POLICIES ONLY: allow public access so the MVP can be tested
-- quickly without login. Do NOT use these policies for a real production system.
drop policy if exists "demo read products" on public.products;
create policy "demo read products" on public.products for select to anon, authenticated using (true);
drop policy if exists "demo add products" on public.products;
create policy "demo add products" on public.products for insert to anon, authenticated with check (true);
drop policy if exists "demo update products" on public.products;
create policy "demo update products" on public.products for update to anon, authenticated using (true) with check (true);

drop policy if exists "demo read orders" on public.orders;
create policy "demo read orders" on public.orders for select to anon, authenticated using (true);
drop policy if exists "demo add orders" on public.orders;
create policy "demo add orders" on public.orders for insert to anon, authenticated with check (true);
drop policy if exists "demo update orders" on public.orders;
create policy "demo update orders" on public.orders for update to anon, authenticated using (true) with check (true);

-- Seed some example produce. You can remove these rows later.
insert into public.products (name, category, quantity, unit, price, farmer_name, location, delivery_date)
select v.name, v.category, v.quantity, v.unit, v.price, v.farmer_name, v.location, v.delivery_date::date
from (values
 ('Tomatoes','Vegetables',180,'kg',28,'Green Valley Farm','Kanchipuram','2026-10-23'),
 ('Red Onions','Vegetables',250,'kg',32,'Sunrise Organics','Chengalpattu','2026-10-23'),
 ('Potatoes','Vegetables',300,'kg',24,'Green Valley Farm','Kanchipuram','2026-10-24'),
 ('Spinach','Leafy Greens',65,'kg',35,'Fresh Roots Co-op','Tambaram','2026-10-22'),
 ('Carrots','Vegetables',120,'kg',42,'Hilltop Produce','Vandalur','2026-10-24'),
 ('Bananas','Fruits',200,'dozen',48,'Sunrise Organics','Chengalpattu','2026-10-23')
) as v(name,category,quantity,unit,price,farmer_name,location,delivery_date)
where not exists (select 1 from public.products);


alter table public.orders add column if not exists delivery_address text;
alter table public.orders add column if not exists is_preorder boolean not null default false;

-- Farmigo ratings, customer feedback and issue reporting.
create table if not exists public.order_feedback (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  order_reference text,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.order_reports (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  order_reference text,
  reason text not null,
  details text not null,
  status text not null default 'Under review',
  created_at timestamptz not null default now()
);
alter table public.order_feedback enable row level security;
alter table public.order_reports enable row level security;
-- Demo-only policies. Replace with authenticated, ownership-based policies before production.
drop policy if exists "demo read feedback" on public.order_feedback;
create policy "demo read feedback" on public.order_feedback for select to anon, authenticated using (true);
drop policy if exists "demo add feedback" on public.order_feedback;
create policy "demo add feedback" on public.order_feedback for insert to anon, authenticated with check (true);
drop policy if exists "demo read reports" on public.order_reports;
create policy "demo read reports" on public.order_reports for select to anon, authenticated using (true);
drop policy if exists "demo add reports" on public.order_reports;
create policy "demo add reports" on public.order_reports for insert to anon, authenticated with check (true);
