# TaskFlow — React + TypeScript + Vite

Todo app UI (React 19, Tailwind 4, Vite). All data lives in the NestJS backend
in `../todo-backend` — there is no localStorage persistence anymore.

## Running

The app needs the backend API running:

```bash
# terminal 1 — backend (see todo-backend/README.md for first-time setup)
cd ../todo-backend && docker compose up -d && npm run migration:run && npm run start:dev

# terminal 2 — frontend
npm install
npm run dev
```

Open http://localhost:5173.

Vite proxies `/api/*` to `http://localhost:3000` (see `vite.config.ts`), so the
frontend talks to the API without CORS concerns during development.

To point at a different backend (e.g. a deployed one), set:

```bash
VITE_API_URL=https://api.example.com/api npm run build
```

## API usage

The UI talks to these backend endpoints (`src/lib/*-api.ts`):

| Feature            | Call                                                     |
| ------------------ | -------------------------------------------------------- |
| List/filter/search | `GET /api/v1/todo?status=&q=`                            |
| Stats tiles        | `GET /api/v1/todo/stats`                                 |
| Create             | `POST /api/v1/todo`                                      |
| Edit / star        | `PATCH /api/v1/todo/:id`                                 |
| Delete             | `DELETE /api/v1/todo/:id`                                |
| Bulk status/delete | `PATCH /api/v1/todo/bulk/status`, `DELETE /api/v1/todo/bulk` |
| Profile            | `GET` / `PUT /api/v1/profile`                            |

Filtering, search, and sorting are done server-side; the client shows a
debounced (300 ms) search and re-fetches after every mutation so the UI always
reflects saved data. API failures surface in an alert banner with a Retry button.

## Scripts

```bash
npm run dev      # dev server with HMR
npm run build    # type-check + production build
npm run lint     # ESLint
npm run preview  # preview the production build
```
