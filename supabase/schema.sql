-- =============================================
-- propertiesテーブルの作成
-- =============================================
create table if not exists public.properties (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references auth.users(id) on delete cascade not null,
  name       text        not null,
  rent       integer     not null check (rent >= 0),
  area       text        not null,
  layout     text        not null,
  created_at timestamptz default now() not null
);

-- =============================================
-- Row Level Security（行単位セキュリティ）を有効化
-- =============================================
alter table public.properties enable row level security;

-- 自分が登録した物件のみ参照できる
create policy "自分の物件のみ参照可能"
  on public.properties for select
  using ( auth.uid() = user_id );

-- 自分のユーザーIDでのみ登録できる（INSERT時にuser_idが一致することを強制）
create policy "自分の物件のみ登録可能"
  on public.properties for insert
  with check ( auth.uid() = user_id );

-- 自分が登録した物件のみ更新できる
create policy "自分の物件のみ更新可能"
  on public.properties for update
  using ( auth.uid() = user_id );

-- 自分が登録した物件のみ削除できる
create policy "自分の物件のみ削除可能"
  on public.properties for delete
  using ( auth.uid() = user_id );
