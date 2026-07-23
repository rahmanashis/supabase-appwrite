# Supabase-Aperite

Host backend applications with Coolify on a VPS and manage them through a React application. The current frontend is a task dashboard prototype with mock authentication and local in-memory task management.

## Features

- Mock sign in and registration with a short loading delay
- Demo session stored in `localStorage`
- Protected dashboard route
- Initial dummy task data
- Add and edit tasks
- Attach local image previews
- Delete tasks
- Search by title or description
- Load-more pagination
- Responsive dark interface
- Hamburger sidebar and logout

## Routes

- `/login` — sign in
- `/register` — create a demo account
- `/` — protected task dashboard
- `/dashboard` — protected task dashboard

## Data behavior

Authentication is a local frontend demo. Tasks are held in React state and reset to the initial dummy data after a full page reload. No external API or backend service is contacted.

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
│   ├── auth/          # Mock authentication and route protection
│   ├── dashboard/     # Task form, cards, search, pagination, states
│   ├── layout/        # Header, main layout, sidebar
│   └── ui/            # Shared controls and surfaces
├── constants/         # Demo user data
├── hooks/             # Shared React hooks
├── styles/            # Design tokens
├── App.jsx            # Routes and providers
└── main.jsx           # Application entry point
```

See [docs/diagrams/architecture.mmd](docs/diagrams/architecture.mmd) for the current frontend flow.
