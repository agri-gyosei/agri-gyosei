-- articles table
create table articles (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  body_mdx text not null,
  category text not null,
  seo_description text,
  published_at timestamptz default now(),
  is_member_only boolean default false,
  created_at timestamptz default now()
);

alter table articles enable row level security;

create policy "public read free articles" on articles
  for select using (is_member_only = false);

create policy "members read all articles" on articles
  for select to authenticated using (true);

-- Service role can insert articles (used by GitHub Actions)
create policy "service role insert articles" on articles
  for insert to service_role with check (true);

-- profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users primary key,
  tier text default 'free' check (tier in ('free', 'paid')),
  stripe_customer_id text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "users read own profile" on profiles
  for select using (auth.uid() = id);

create policy "users update own profile" on profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- forum_posts table
create table forum_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  body text not null,
  created_at timestamptz default now()
);

alter table forum_posts enable row level security;

create policy "members read posts" on forum_posts
  for select to authenticated using (true);

create policy "members create posts" on forum_posts
  for insert to authenticated with check (auth.uid() = user_id);

-- forum_comments table
create table forum_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references forum_posts on delete cascade not null,
  user_id uuid references auth.users not null,
  body text not null,
  created_at timestamptz default now()
);

alter table forum_comments enable row level security;

create policy "members read comments" on forum_comments
  for select to authenticated using (true);

create policy "members create comments" on forum_comments
  for insert to authenticated with check (auth.uid() = user_id);

-- indexes
create index articles_published_at_idx on articles(published_at desc);
create index articles_slug_idx on articles(slug);
create index articles_category_idx on articles(category);
