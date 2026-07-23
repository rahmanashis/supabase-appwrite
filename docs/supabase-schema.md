# Supabase Schema for Todo Dashboard

## Database

### `todos` table

| Column      | Type        | Notes                                          |
|-------------|-------------|------------------------------------------------|
| `id`        | `uuid`      | Primary key, default `gen_random_uuid()`       |
| `user_id`   | `uuid`      | `auth.users.id` reference, not null              |
| `title`     | `text`      | Not null                                       |
| `description` | `text`  | Nullable                                       |
| `image_url` | `text`      | Nullable, public Supabase Storage URL            |
| `created_at`| `timestamp` | Default `now()`                                  |

### Row Level Security (RLS)

Enable RLS on `todos` and add these policies for authenticated users:

- `SELECT`: `auth.uid() = user_id`
- `INSERT`: `auth.uid() = user_id`
- `UPDATE`: `auth.uid() = user_id`
- `DELETE`: `auth.uid() = user_id`

## Storage

Create a public bucket named `todo-images` with the following upload policy for authenticated users:

- `INSERT`: `auth.role() = 'authenticated'`
- `SELECT`: Public access (or `auth.role() = 'authenticated'`)

Files are uploaded under a folder named after the user's ID to avoid collisions.
