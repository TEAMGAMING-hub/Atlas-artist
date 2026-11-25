# Atlas musical

Atlas en français présentant cinq artistes et leurs informations essentielles.

## Publication GitHub Pages

Dans GitHub : **Settings → Pages → Build and deployment → Source: Deploy from a branch** puis choisissez la branche `main` et le dossier `/ (root)`.

## Supabase

La page interroge la table `artists` avec la clé publique Supabase. Si la table est absente ou vide, les données locales sont utilisées comme secours.

Structure attendue :

```sql
create table public.artists (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  country text,
  genres text[],
  active_from text,
  biography text,
  birth_place text,
  image_url text,
  official_url text,
  wikipedia_url text
);

alter table public.artists enable row level security;
create policy "Public artists read" on public.artists
for select to anon using (true);
```
