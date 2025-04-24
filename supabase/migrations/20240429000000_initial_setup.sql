-- Create necessary schemas
create schema if not exists public;

-- Enable Row Level Security
alter table auth.users enable row level security;

-- Create todo table
create table if not exists public.todos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  title text check (char_length(title) <= 50) not null,
  content text check (char_length(content) <= 100),
  status text check (status in ('完了', '途中', '未完了')) not null default '未完了',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.todos enable row level security;

-- Create comments table
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  todo_id uuid references public.todos(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  content text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.comments enable row level security;

-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  last_login timestamp with time zone default now(),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create RLS policies
-- Todos policies
create policy "Users can view their own todos"
  on todos for select
  using (auth.uid() = user_id);

create policy "Users can create their own todos"
  on todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own todos"
  on todos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own todos"
  on todos for delete
  using (auth.uid() = user_id);

-- Comments policies
create policy "Users can view comments on their todos"
  on comments for select
  using (auth.uid() = user_id or
         auth.uid() in (select user_id from todos where id = comments.todo_id));

create policy "Users can create comments on todos"
  on comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on comments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on comments for delete
  using (auth.uid() = user_id);

-- Profiles policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create functions and triggers
-- Function to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for todos table
create trigger update_todos_updated_at
before update on todos
for each row
execute function update_updated_at_column();

-- Trigger for comments table
create trigger update_comments_updated_at
before update on comments
for each row
execute function update_updated_at_column();

-- Trigger for profiles table
create trigger update_profiles_updated_at
before update on profiles
for each row
execute function update_updated_at_column();

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger after user creation in auth.users
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user(); 