# Supabase-Aperite

Host backend applications with Coolify on a VPS and manage tasks through a React application backed by Supabase Auth, Database, and Storage.

## Features

- Supabase email/password sign up and sign in
- Session restoration with protected dashboard routes
- Supabase-backed task CRUD scoped to the signed-in user
- Optional task image uploads to the `task-images` storage bucket
- Debounced server-side search by title or description
- Load-more pagination with a page size of 3
- Responsive dark interface
- Hamburger sidebar and Supabase logout

## Routes

- `/login` — sign in
- `/register` — create an account
- `/` — protected task dashboard
- `/dashboard` — protected task dashboard

## Supabase setup

Create a Supabase project and copy `.env.example` to `.env.local`:

```env
VITE_SUPABASE_URL=https://your-supabase-url.example.com
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

Use a public anon/publishable key in Vite. Never put a Supabase service-role key in frontend environment variables.

### Auth settings

In the Supabase dashboard:

1. Enable the Email provider and email/password signups.
2. Decide whether email confirmation is required.
   - If confirmation is enabled, signup sends the user to `/login` with a “check your email” message.
   - If confirmation is disabled and Supabase returns a session, signup opens the dashboard immediately.
3. Add local and deployed app URLs to the Site URL / Redirect URLs settings, for example `http://localhost:5173` for Vite dev.

### Database and storage

Apply the SQL migration in [20260724000100_task_ownership.sql](supabase/migrations/20260724000100_task_ownership.sql). It adds task ownership, enables RLS, creates per-user task policies, and creates write/delete policies for images under the signed-in user folder in the `task-images` bucket.

Expected `public.tasks` columns include:

- `id`
- `title`
- `description`
- `image_url`
- `created_at`
- `user_id uuid references auth.users(id)`

If your `tasks` table already has rows, resolve rows with `user_id is null` before making `user_id` `not null`. For playground data you can delete or backfill those rows in the Supabase SQL editor.

The current app reads task images with public URLs. Keep the `task-images` bucket public only if public image reads are intended; otherwise switch the app to signed URLs in a separate change.

## Data behavior

The authenticated user's Supabase session is the source of truth. The dashboard only queries rows where `tasks.user_id` matches the signed-in user, and RLS policies enforce the same boundary in Supabase. Pagination is cumulative: the first load fetches 3 tasks, each “Load more” click fetches 3 additional tasks, and the button hides when the exact filtered count is loaded.

## Commands

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

## Structure

```text
src/
├── components/
│   ├── auth/          # Supabase auth forms, session context, route protection
│   ├── dashboard/     # Task form, cards, search, pagination, states
│   ├── layout/        # Header, main layout, sidebar
│   └── ui/            # Shared controls and surfaces
├── hooks/             # Shared React hooks
├── styles/            # Design tokens
├── test/              # Vitest setup
├── utils/             # Supabase client and validation helpers
├── App.jsx            # Routes and providers
└── main.jsx           # Application entry point
```

See [architecture.mmd](docs/diagrams/architecture.mmd) for the current frontend and Supabase flow.
